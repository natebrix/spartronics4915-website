// Imports published WordPress posts into src/content/posts/ from the site
// backup's database dump, and copies the images they use into src/assets/uploads/.
//
// Usage:
//   npm run import:wordpress -- --backup /path/to/site-archive-folder
//
// The backup folder is the unzipped All-in-One WP Migration archive: it holds
// wp-content/mysql.sql and wp-content/uploads/. Nothing else from it is read,
// and nothing private (drafts, users, form entries) is written out.
//
// Adapted from scripts/import-wordpress.mjs in brixius-web.

import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import TurndownService from "turndown";
import { readTables } from "./lib/wp-sql.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const POSTS_DIR = path.join(ROOT, "src/content/posts");
const UPLOADS_DIR = path.join(ROOT, "src/assets/uploads");
const FILES_DIR = path.join(ROOT, "public/files");
const DATA_DIR = path.join(ROOT, "scripts/data");

const TABLE_PREFIX = "8h3_";
const OLD_HOSTS = ["spartronics4915.com", "www.spartronics4915.com", "spartronicsbhs.wpengine.com"];
const GENERIC_AUTHORS = new Set(["Spartronics", "admin"]);
const MAX_IMAGE_SIDE = 2000;
const MAX_IMAGE_BYTES = 1024 * 1024;
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".heic"]);
const FILE_EXTENSIONS = new Set([".pdf", ".docx", ".pptx", ".xlsx"]);

// Routes the site builds itself; a post with one of these slugs would collide.
const RESERVED_SLUGS = new Set([
  "news", "calendar", "sponsors", "join", "history", "support", "about",
  "feed", "tag", "category", "files", "images", "rss.xml", "404"
]);

function getCliArg(flag) {
  const index = process.argv.indexOf(flag);
  return index === -1 ? null : (process.argv[index + 1] ?? null);
}

function normalizeText(value) {
  return String(value ?? "").replace(/\r\n/g, "\n").trim();
}

function normalizeWhitespace(value) {
  return String(value ?? "").replace(/ /g, " ").replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value) {
  return String(value ?? "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'");
}

function decodeSlug(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function safeFileName(value) {
  return value.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/-+/g, "-");
}

// --- Old-site URLs ---------------------------------------------------------

function parseOldUrl(raw) {
  if (/^(#|mailto:|tel:)/i.test(raw.trim())) return null;
  try {
    const url = new URL(decodeHtmlEntities(raw).trim(), "https://spartronics4915.com/");
    return OLD_HOSTS.includes(url.hostname.toLowerCase()) ? url : null;
  } catch {
    return null;
  }
}

function uploadPathOf(raw) {
  const url = parseOldUrl(raw);
  if (!url) return null;
  const match = url.pathname.match(/\/wp-content\/uploads\/(.+)$/);
  return match ? decodeSlug(match[1]) : null;
}

// --- Media -----------------------------------------------------------------

class MediaLibrary {
  constructor(uploadsRoot) {
    this.uploadsRoot = uploadsRoot;
    this.done = new Map(); // upload path -> published name, or null if missing
    this.missing = new Set();
    this.heicSkipped = new Set();
  }

  // WordPress serves resized copies like photo-300x200.jpg and photo-scaled.jpg;
  // the original is photo.jpg. Returns the original's path if the backup has it.
  findOriginal(uploadPath) {
    const parsed = path.posix.parse(uploadPath);
    const stem = parsed.name.replace(/-\d+x\d+$/, "").replace(/-scaled$/, "");
    const candidates = [
      path.posix.join(parsed.dir, stem + parsed.ext),
      path.posix.join(parsed.dir, `${stem}-scaled${parsed.ext}`),
      uploadPath
    ];
    return candidates.find((c) => existsSync(path.join(this.uploadsRoot, c))) ?? null;
  }

  async addImage(uploadPath) {
    if (this.done.has(uploadPath)) return this.done.get(uploadPath);
    const original = this.findOriginal(uploadPath);
    if (!original) {
      this.missing.add(uploadPath);
      this.done.set(uploadPath, null);
      return null;
    }

    const parsed = path.posix.parse(original);
    let ext = parsed.ext.toLowerCase();
    let source = path.join(this.uploadsRoot, original);
    if (ext === ".heic") {
      source = convertHeic(source);
      if (!source) {
        this.heicSkipped.add(original);
        this.done.set(uploadPath, null);
        return null;
      }
      ext = ".jpg";
    }
    if (ext === ".jpeg") ext = ".jpg";

    const stem = safeFileName([parsed.dir, parsed.name.replace(/-scaled$/, "")].filter(Boolean).join("-"));
    const name = await writeResized(source, stem, ext);
    this.done.set(uploadPath, name);
    return name;
  }

  async addFile(uploadPath) {
    if (this.done.has(uploadPath)) return this.done.get(uploadPath);
    const source = path.join(this.uploadsRoot, uploadPath);
    if (!existsSync(source)) {
      this.missing.add(uploadPath);
      this.done.set(uploadPath, null);
      return null;
    }
    const name = safeFileName(uploadPath.replace(/\//g, "-"));
    await fs.copyFile(source, path.join(FILES_DIR, name));
    this.done.set(uploadPath, name);
    return name;
  }
}

function convertHeic(source) {
  if (process.platform !== "darwin") return null;
  const target = path.join(os.tmpdir(), `${path.parse(source).name}-${process.pid}.jpg`);
  execFileSync("sips", ["-s", "format", "jpeg", source, "--out", target], { stdio: "ignore" });
  return target;
}

// Writes a copy no larger than MAX_IMAGE_SIDE and returns its file name. PNGs
// that are still over MAX_IMAGE_BYTES (usually photo screenshots) become JPEGs.
async function writeResized(source, stem, ext) {
  for (const existing of [`${stem}${ext}`, `${stem}.jpg`]) {
    if (existsSync(path.join(UPLOADS_DIR, existing))) return existing;
  }
  if (ext === ".gif") {
    await fs.copyFile(source, path.join(UPLOADS_DIR, stem + ext));
    return stem + ext;
  }
  let image = sharp(source, { failOn: "none" }).rotate();
  const { width = 0, height = 0 } = await image.metadata();
  if (Math.max(width, height) > MAX_IMAGE_SIDE) {
    image = image.resize({ width: MAX_IMAGE_SIDE, height: MAX_IMAGE_SIDE, fit: "inside" });
  }
  if (ext === ".png") {
    const png = await image.clone().png({ compressionLevel: 9 }).toBuffer();
    if (png.length <= MAX_IMAGE_BYTES) {
      await fs.writeFile(path.join(UPLOADS_DIR, stem + ext), png);
      return stem + ext;
    }
    image = image.flatten({ background: "#ffffff" });
    ext = ".jpg";
  }
  if (ext === ".jpg") image = image.jpeg({ quality: 82, mozjpeg: true });
  await image.toFile(path.join(UPLOADS_DIR, stem + ext));
  return stem + ext;
}

// --- HTML to Markdown ------------------------------------------------------

function youtubeEmbed(url) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([\w-]{11})/);
  if (!match) return null;
  return `<iframe src="https://www.youtube-nocookie.com/embed/${match[1]}" title="YouTube video" allowfullscreen loading="lazy"></iframe>`;
}

function expandShortcodes(html, attachments) {
  return String(html ?? "")
    .replace(/<!--\s*\/?wp:[\s\S]*?-->/g, "")
    .replace(/\[caption[^\]]*](.*?)\[\/caption]/gis, (_, inner) => {
      const caption = normalizeWhitespace(inner.replace(/<[^>]+>/g, ""));
      const media = inner.replace(/(<\/a>|\/?>)\s*[^<>]*$/s, "$1");
      return `<figure>${media}${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
    })
    .replace(/\[embed](.*?)\[\/embed]/gis, (_, url) => {
      const clean = normalizeText(url);
      return youtubeEmbed(clean) ?? `<p><a href="${clean}">${clean}</a></p>`;
    })
    .replace(/\[gallery[^\]]*ids="([^"]+)"[^\]]*]/gis, (_, ids) =>
      ids
        .split(",")
        .map((id) => attachments.get(Number(id.trim())))
        .filter(Boolean)
        .map((file) => `<p><img src="/wp-content/uploads/${file}" alt=""></p>`)
        .join("\n")
    )
    // Only these shortcodes appear in posts; other [brackets] are real text,
    // like the speaker labels in interviews.
    .replace(/\[\/?(?:caption|embed|gallery)\b[^\]]*]/g, "");
}

// Old posts were written in the classic editor, which stored paragraphs as
// blank-line-separated text instead of <p> tags.
function wrapLegacyParagraphs(html) {
  const normalized = html.replace(/\r\n/g, "\n").trim();
  if (!normalized || /<p[\s>]/i.test(normalized)) return normalized;
  return normalized
    .split(/\n\s*\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => (/^<\/?(?:ul|ol|li|table|figure|blockquote|pre|h[1-6]|hr|div|iframe)\b/i.test(block) ? block : `<p>${block.replace(/\n/g, "<br>")}</p>`))
    .join("\n\n");
}

// WordPress floated aligned images beside the text, often mid-sentence.
// Markdown can't float, so move them ahead of their paragraph.
function hoistAlignedImages(html) {
  const aligned = /(?:<a\b[^>]*>\s*)?<img\b[^>]*\balign(?:left|right)\b[^>]*>(?:\s*<\/a>)?/gi;
  return html.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/gi, (paragraph, attrs, inner) => {
    const images = inner.match(aligned);
    if (!images) return paragraph;
    return `${images.map((img) => `<p>${img}</p>`).join("\n")}\n<p${attrs}>${inner.replace(aligned, "")}</p>`;
  });
}

function isDataTable(table) {
  if (table.querySelector("img, table")) return false;
  return Array.from(table.querySelectorAll("tr")).some((row) => row.querySelectorAll("td, th").length > 1);
}

function makeTurndown(media) {
  const turndown = new TurndownService({ codeBlockStyle: "fenced", headingStyle: "atx", hr: "---" });

  turndown.keep(["iframe"]);
  turndown.keep((node) => node.nodeName === "TABLE" && isDataTable(node));
  turndown.remove(["script", "style", "noscript"]);

  // Newsletter posts pasted from Mailchimp use tables for layout; flatten them.
  turndown.addRule("layoutTable", {
    filter: ["table", "thead", "tbody", "tfoot", "tr", "td", "th"],
    replacement: (content) => `\n\n${content}\n\n`
  });

  turndown.addRule("figcaption", {
    filter: ["figcaption"],
    replacement(content) {
      const text = normalizeWhitespace(content);
      return text ? `\n\n_${text}_\n\n` : "";
    }
  });

  turndown.addRule("image", {
    filter: "img",
    replacement(_, node) {
      const src = node.getAttribute("src") ?? "";
      const alt = normalizeWhitespace(node.getAttribute("alt") ?? "").replace(/[[\]]/g, "");
      const upload = uploadPathOf(src);
      if (upload) {
        const name = media.done.get(upload);
        return name ? `![${alt}](../../assets/uploads/${name})` : "";
      }
      return src ? `![${alt}](${src})` : "";
    }
  });

  turndown.addRule("link", {
    filter: (node) => node.nodeName === "A" && node.getAttribute("href"),
    replacement(content, node) {
      const href = node.getAttribute("href");
      const upload = uploadPathOf(href);
      // A thumbnail linking to its own full-size image: keep just the image.
      if (upload && IMAGE_EXTENSIONS.has(path.extname(upload).toLowerCase())) return content;
      if (!normalizeWhitespace(content)) return content;
      let target = href;
      if (upload) {
        const name = media.done.get(upload);
        target = name ? `/files/${name}` : href;
      } else {
        const old = parseOldUrl(href);
        if (old) target = `${old.pathname}${old.search}${old.hash}`;
      }
      return `[${content}](${target.replace(/ /g, "%20")})`;
    }
  });

  return turndown;
}

function collectUploads(html) {
  const images = new Set();
  const files = new Set();
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const upload = uploadPathOf(match[1]);
    if (!upload) continue;
    const ext = path.extname(upload).toLowerCase();
    if (IMAGE_EXTENSIONS.has(ext)) images.add(upload);
    else if (FILE_EXTENSIONS.has(ext)) files.add(upload);
  }
  return { images, files };
}

function cleanMarkdown(markdown) {
  return markdown
    .replace(/ /g, " ")
    .replace(/^[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildSummary(markdown, maxChars = 180) {
  const text = normalizeWhitespace(
    markdown
      .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
      .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
      .replace(/<[^>]+>/g, " ")
      .replace(/[`#>*_~|]/g, " ")
  );
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

function yamlList(values) {
  return values.length ? `\n${values.map((v) => `  - ${JSON.stringify(v)}`).join("\n")}` : " []";
}

function frontmatter(post) {
  const lines = [
    "---",
    `title: ${JSON.stringify(post.title)}`,
    `date: ${post.date}`,
    `summary: ${JSON.stringify(post.summary)}`
  ];
  if (post.cover) lines.push(`cover: ${JSON.stringify(post.cover)}`);
  if (post.author) lines.push(`author: ${JSON.stringify(post.author)}`);
  lines.push(`tags:${yamlList(post.tags)}`, `wordpressId: ${post.id}`, "---");
  return lines.join("\n");
}

// --- Main ------------------------------------------------------------------

async function main() {
  const backup = getCliArg("--backup");
  if (!backup) {
    console.error("Usage: npm run import:wordpress -- --backup /path/to/site-archive-folder");
    process.exit(1);
  }
  const dumpPath = path.join(backup, "wp-content/mysql.sql");
  const media = new MediaLibrary(path.join(backup, "wp-content/uploads"));

  const db = await readTables(dumpPath, TABLE_PREFIX, [
    "posts", "postmeta", "terms", "term_taxonomy", "term_relationships", "users"
  ]);

  const attachments = new Map(); // attachment id -> upload path
  for (const meta of db.postmeta) {
    if (meta.meta_key === "_wp_attached_file") attachments.set(meta.post_id, meta.meta_value);
  }
  const thumbnails = new Map();
  for (const meta of db.postmeta) {
    if (meta.meta_key === "_thumbnail_id") thumbnails.set(meta.post_id, Number(meta.meta_value));
  }
  const authors = new Map(db.users.map((u) => [u.ID, u.display_name]));
  const terms = new Map(db.terms.map((t) => [t.term_id, t]));
  const taxonomies = new Map(db.term_taxonomy.map((t) => [t.term_taxonomy_id, { ...t, term: terms.get(t.term_id) }]));
  const postTerms = new Map();
  for (const rel of db.term_relationships) {
    const tax = taxonomies.get(rel.term_taxonomy_id);
    if (!tax || !["category", "post_tag"].includes(tax.taxonomy)) continue;
    if (!postTerms.has(rel.object_id)) postTerms.set(rel.object_id, []);
    postTerms.get(rel.object_id).push(tax);
  }

  const skipped = [];
  const seen = new Map(); // title + content -> slug
  const candidates = db.posts
    .filter((p) => p.post_type === "post" && p.post_status === "publish")
    .sort((a, b) => a.post_date.localeCompare(b.post_date));
  const posts = [];
  for (const p of candidates) {
    const title = decodeHtmlEntities(normalizeText(p.post_title));
    const key = `${title}\n${p.post_content.trim()}`;
    if (!title || /^https?:\/\//i.test(title)) {
      skipped.push(`${p.post_name}: junk title`);
    } else if (seen.has(key)) {
      skipped.push(`${p.post_name}: exact duplicate of ${seen.get(key)}`);
    } else if (RESERVED_SLUGS.has(p.post_name)) {
      skipped.push(`${p.post_name}: slug collides with a site route`);
    } else {
      seen.set(key, p.post_name);
      posts.push({ ...p, title });
    }
  }

  await fs.rm(POSTS_DIR, { recursive: true, force: true });
  for (const dir of [POSTS_DIR, UPLOADS_DIR, FILES_DIR, DATA_DIR]) await fs.mkdir(dir, { recursive: true });

  const turndown = makeTurndown(media);
  const externalImages = new Map();
  for (const p of posts) {
    const html = hoistAlignedImages(wrapLegacyParagraphs(expandShortcodes(p.post_content, attachments)));
    const { images, files } = collectUploads(html);
    for (const image of images) await media.addImage(image);
    for (const file of files) await media.addFile(file);
    for (const match of html.matchAll(/<img[^>]+src="(https?:\/\/[^"]+)"/g)) {
      if (!uploadPathOf(match[1])) {
        const host = new URL(match[1]).hostname;
        externalImages.set(host, (externalImages.get(host) ?? 0) + 1);
      }
    }

    const markdown = cleanMarkdown(turndown.turndown(html));
    const thumbnail = attachments.get(thumbnails.get(p.ID));
    const coverName = thumbnail ? await media.addImage(thumbnail) : null;
    const author = authors.get(p.post_author);
    const tags = (postTerms.get(p.ID) ?? [])
      .filter((t) => t.term && t.term.slug !== "uncategorized")
      .map((t) => decodeHtmlEntities(t.term.name));

    const post = {
      id: p.ID,
      title: p.title,
      date: p.post_date.slice(0, 10),
      summary: decodeHtmlEntities(normalizeText(p.post_excerpt)) || buildSummary(markdown),
      cover: coverName ? `../../assets/uploads/${coverName}` : null,
      author: author && !GENERIC_AUTHORS.has(author) ? author : null,
      tags: [...new Set(tags)]
    };
    await fs.writeFile(path.join(POSTS_DIR, `${p.post_name}.md`), `${frontmatter(post)}\n\n${markdown}\n`);
  }

  // Every URL the old site served for these posts and their archives, for the
  // redirect file and the old-URL check.
  const oldUrls = new Set(["/", "/feed/"]);
  for (const p of posts) {
    oldUrls.add(`/${p.post_name}/`);
    oldUrls.add(`/${p.post_date.slice(0, 4)}/`);
    oldUrls.add(`/${p.post_date.slice(0, 4)}/${p.post_date.slice(5, 7)}/`);
    for (const t of postTerms.get(p.ID) ?? []) {
      if (t.term) oldUrls.add(`/${t.taxonomy === "category" ? "category" : "tag"}/${t.term.slug}/`);
    }
  }
  await fs.writeFile(path.join(DATA_DIR, "old-urls.txt"), `${[...oldUrls].sort().join("\n")}\n`);

  console.log(`Imported ${posts.length} posts into ${path.relative(ROOT, POSTS_DIR)}`);
  console.log(`Copied ${[...media.done.values()].filter(Boolean).length} images and files`);
  for (const line of skipped) console.log(`Skipped ${line}`);
  for (const upload of media.missing) console.log(`Missing from backup: ${upload}`);
  for (const upload of media.heicSkipped) console.log(`HEIC not converted (needs macOS sips): ${upload}`);
  for (const [host, count] of externalImages) console.log(`Still remote: ${count} images on ${host}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

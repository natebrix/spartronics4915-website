// Checks the built site in dist/ for broken internal links and images, and
// checks that no image in the repo is over the size limit.
//
//   npm run check:site

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { DIST, ROOT, htmlFiles, readRedirects, requireBuild, resolvePath } from "./lib/site.mjs";

const MAX_IMAGE_BYTES = 1024 * 1024;
const IMAGE_DIRS = ["src/assets", "public"];
const IMAGE_PATTERN = /\.(jpe?g|png|gif|webp|avif|svg)$/i;

function imageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return imageFiles(full);
    return IMAGE_PATTERN.test(entry.name) ? [full] : [];
  });
}

function checkImageSizes() {
  return IMAGE_DIRS.flatMap((dir) => imageFiles(path.join(ROOT, dir)))
    .filter((file) => fs.statSync(file).size > MAX_IMAGE_BYTES)
    .map((file) => {
      const mb = (fs.statSync(file).size / 1024 / 1024).toFixed(1);
      return `${path.relative(ROOT, file)} is ${mb} MB (limit 1 MB). Resize it or save it as a JPEG.`;
    });
}

function checkInternalLinks() {
  const redirects = readRedirects();
  const problems = [];
  for (const file of htmlFiles()) {
    const html = fs.readFileSync(file, "utf8");
    const page = `/${path.relative(DIST, file)}`.replace(/index\.html$/, "");
    for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
      const raw = match[1].replace(/&amp;/g, "&");
      if (/^(https?:|mailto:|tel:|data:|#|\/\/)/i.test(raw)) continue;
      const target = new URL(raw, `https://site.invalid${page}`).pathname;
      if (!resolvePath(target, redirects).ok) problems.push(`${page} links to missing ${target}`);
    }
  }
  return [...new Set(problems)];
}

requireBuild();
const problems = [...checkImageSizes(), ...checkInternalLinks()];
if (problems.length) {
  console.error(`${problems.length} problems:`);
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}
console.log(`Checked ${htmlFiles().length} pages: no broken internal links, no oversized images.`);

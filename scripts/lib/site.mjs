// Helpers for checking the built site in dist/ without a server: does a URL
// path resolve to a built page, either directly or through public/_redirects?

import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(import.meta.dirname, "../..");
export const DIST = path.join(ROOT, "dist");

/** Parses Cloudflare's _redirects format into [{ from, to, status }]. */
export function readRedirects(file = path.join(ROOT, "public/_redirects")) {
  return fs
    .readFileSync(file, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [from, to, status = "302"] = line.split(/\s+/);
      return { from, to, status: Number(status) };
    });
}

function matchRule(rule, urlPath) {
  if (rule.from.endsWith("*")) {
    const prefix = rule.from.slice(0, -1);
    if (!urlPath.startsWith(prefix)) return null;
    return rule.to.replace(":splat", urlPath.slice(prefix.length));
  }
  return rule.from === urlPath ? rule.to : null;
}

/** The built file a path is served from, or null. */
export function builtFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const candidates = clean.endsWith("/")
    ? [path.join(DIST, clean, "index.html")]
    : [path.join(DIST, clean), path.join(DIST, clean, "index.html"), path.join(DIST, `${clean}.html`)];
  return candidates.find((file) => file.startsWith(DIST) && fs.existsSync(file) && fs.statSync(file).isFile()) ?? null;
}

/**
 * Follows a path through the redirect rules the way Cloudflare Pages would:
 * a built file wins over a redirect. Returns { ok, chain }.
 */
export function resolvePath(urlPath, redirects) {
  const chain = [urlPath];
  let current = urlPath;
  for (let hop = 0; hop < 5; hop++) {
    if (builtFile(current)) return { ok: true, chain };
    const next = redirects.map((rule) => matchRule(rule, current)).find((to) => to !== null);
    if (!next) return { ok: false, chain };
    if (/^https?:\/\//.test(next)) return { ok: true, chain: [...chain, next] };
    chain.push(next);
    current = next;
  }
  return { ok: false, chain };
}

/** Every built HTML file under dist/. */
export function htmlFiles(dir = DIST) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith(".html") ? [full] : [];
  });
}

export function requireBuild() {
  if (!fs.existsSync(DIST)) {
    console.error("No dist/ folder. Run `npm run build` first.");
    process.exit(1);
  }
}

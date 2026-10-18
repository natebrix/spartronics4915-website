// Newsletter posts pasted from Mailchimp link through Mailchimp click trackers
// (…list-manage.com/track/click?…), which stop working if the Mailchimp
// account goes away. This asks Mailchimp where each one goes and saves the
// answers to scripts/data/mailchimp-links.json; the import script then links
// straight to the real page.
//
//   npm run resolve:mailchimp
//   npm run import:wordpress -- --backup <folder>
//
// Links already in the JSON file aren't requested again.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const POSTS_DIR = path.join(ROOT, "src/content/posts");
const MAP_FILE = path.join(ROOT, "scripts/data/mailchimp-links.json");
const TRACKER = /https?:\/\/[a-z0-9.]+\.list-manage\.com\/track\/click\?[^)\s"]+/g;

const map = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, "utf8")) : {};
const found = new Set();
for (const file of fs.readdirSync(POSTS_DIR)) {
  // Keyed by the https:// form; the import script looks links up the same way.
  for (const match of fs.readFileSync(path.join(POSTS_DIR, file), "utf8").matchAll(TRACKER)) {
    found.add(match[0].replace(/^http:/, "https:"));
  }
}

const todo = [...found].filter((url) => !(url in map));
console.log(`${found.size} tracker links in posts, ${todo.length} not resolved yet`);

// Follows redirects until they leave Mailchimp (old http:// trackers first
// redirect to their https:// version). Returns null for a dead tracker.
async function resolve(url) {
  let current = url;
  for (let hop = 0; hop < 5; hop++) {
    const response = await fetch(current, { redirect: "manual" });
    const location = response.headers.get("location");
    if (response.status < 300 || response.status >= 400 || !location) return null;
    current = new URL(location, current).href;
    if (!/\.list-manage\.com\/track\//.test(current)) return current;
  }
  return null;
}

for (const url of todo) {
  // A dead tracker is recorded as null: the import keeps the link text and
  // drops the link.
  map[url] = await resolve(url);
  console.log(map[url] ?? `(dead) ${url}`);
}

const sorted = Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(MAP_FILE, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`Saved ${Object.keys(sorted).length} links to ${path.relative(ROOT, MAP_FILE)}`);

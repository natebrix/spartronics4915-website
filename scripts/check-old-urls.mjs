// Checks that every URL the old WordPress site served still works: it must be
// a page on the new site or redirect to one.
//
//   npm run check:urls                        checks the build in dist/
//   npm run check:urls -- --base <site URL>   checks a deployed site over HTTP
//
// URLs come from scripts/data/old-urls.txt (written by the import script) and
// scripts/data/old-pages.txt (hand-maintained).

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { ROOT, readRedirects, requireBuild, resolvePath } from "./lib/site.mjs";

function readUrlList(name) {
  return fs
    .readFileSync(path.join(ROOT, "scripts/data", name), "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

const lines = [...readUrlList("old-urls.txt"), ...readUrlList("old-pages.txt")];
const pending = lines.filter((line) => line.startsWith("pending ")).map((line) => line.split(/\s+/)[1]);
const urls = [...new Set(lines.filter((line) => !line.startsWith("pending ")))];

async function checkDeployed(base) {
  const failures = [];
  for (const url of urls) {
    const response = await fetch(new URL(url, base), { redirect: "follow" });
    if (!response.ok) failures.push(`${url} → HTTP ${response.status}`);
  }
  return failures;
}

function checkBuild() {
  requireBuild();
  const redirects = readRedirects();
  return urls
    .map((url) => ({ url, ...resolvePath(url, redirects) }))
    .filter((result) => !result.ok)
    .map((result) => `${result.url} → not found (tried ${result.chain.join(" → ")})`);
}

const baseIndex = process.argv.indexOf("--base");
const base = baseIndex === -1 ? null : process.argv[baseIndex + 1];
const failures = base ? await checkDeployed(base) : checkBuild();

for (const url of pending) console.warn(`warning: no decision yet for ${url} (see scripts/data/old-pages.txt)`);
if (failures.length) {
  console.error(`${failures.length} of ${urls.length} old URLs are broken:`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`All ${urls.length} old URLs work${base ? ` on ${base}` : " in dist/"}.`);

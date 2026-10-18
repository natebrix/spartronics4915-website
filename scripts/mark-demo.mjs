// Marks the build in dist/ as a demo before `npm run deploy:demo` uploads it:
// every page gets an X-Robots-Tag: noindex header, so search engines don't
// index the demo copy alongside the real spartronics4915.com.
//
// This only touches dist/, never public/, so a normal production build is
// never marked noindex.

import fs from "node:fs";
import path from "node:path";
import { DIST, requireBuild } from "./lib/site.mjs";

requireBuild();
const headersFile = path.join(DIST, "_headers");
const existing = fs.existsSync(headersFile) ? fs.readFileSync(headersFile, "utf8") : "";
fs.writeFileSync(headersFile, `${existing}/*\n  X-Robots-Tag: noindex\n`);
fs.writeFileSync(path.join(DIST, "robots.txt"), "User-agent: *\nDisallow: /\n");
console.log("Marked dist/ as a demo: noindex on every page.");

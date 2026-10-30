// Writes vercel.json from public/_redirects, so the redirects live in one list.
// Vercel ignores _redirects (a Cloudflare format) and reads vercel.json instead.
//
//   npm run vercel:json    rewrite vercel.json after changing _redirects
//
// `npm run check:urls` fails if vercel.json is out of date.

import fs from "node:fs";
import { VERCEL_JSON, vercelConfig } from "./lib/site.mjs";

fs.writeFileSync(VERCEL_JSON, `${JSON.stringify(vercelConfig(), null, 2)}\n`);
console.log("Wrote vercel.json from public/_redirects.");

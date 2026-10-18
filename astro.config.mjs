// @ts-check

import fs from 'node:fs';
import node from '@astrojs/node';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import { defineConfig, fontProviders } from 'astro/config';

// Pages marked `noindex: true` (like the grant applications) stay out
// of the sitemap. The content collections aren't loaded yet when this file
// runs, so read the front matter directly.
const PAGES_DIR = './src/content/pages';
const noindexPages = fs
	.readdirSync(PAGES_DIR)
	.filter((file) => file.endsWith('.mdoc'))
	.filter((file) => /^noindex:\s*true\s*$/m.test(fs.readFileSync(`${PAGES_DIR}/${file}`, 'utf8').split(/^---$/m)[1] ?? ''))
	.map((file) => `/${file.slice(0, -'.mdoc'.length)}/`);

// The Keystatic editor (keystatic.config.ts) needs a server, so it only runs
// with `npm run dev`. Production builds stay fully static.
const editing = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
	site: 'https://spartronics4915.com',
	// Match WordPress: every page URL ends in a slash, like /history/. In dev,
	// Keystatic's API calls URLs without one, so accept both there.
	trailingSlash: editing ? 'ignore' : 'always',
	// Keystatic's editing pages run on a small local server during dev.
	...(editing ? { adapter: node({ mode: 'standalone' }) } : {}),
	integrations: [
		// Posts and pages are Markdoc, the format the Keystatic editor writes.
		// allowHTML keeps the bits of raw HTML imported from WordPress working.
		markdoc({ allowHTML: true }),
		sitemap({
			filter: (page) => !noindexPages.some((path) => page.endsWith(path)),
		}),
		...(editing ? [react(), keystatic()] : []),
	],
	// Fonts follow the Spartronics brand guide: Open Sans for all website text,
	// SF TransRobotics only for the logo and titles. (Raleway is the print font.)
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Open Sans',
			cssVariable: '--font-body',
			weights: [400, 600, 700, 800],
			styles: ['normal', 'italic'],
			fallbacks: ['sans-serif'],
		},
		{
			// Freeware from ShyFonts Type Foundry.
			provider: fontProviders.local(),
			name: 'SF TransRobotics',
			cssVariable: '--font-logo',
			fallbacks: ['sans-serif'],
			options: {
				variants: [{ src: ['./src/assets/fonts/sf-transrobotics.ttf'], weight: 400, style: 'normal', display: 'swap' }],
			},
		},
	],
});

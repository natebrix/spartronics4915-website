// @ts-check

import fs from 'node:fs';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// Markdown pages marked `noindex: true` (like the grant applications) stay out
// of the sitemap. The content collections aren't loaded yet when this file
// runs, so read the front matter directly.
const PAGES_DIR = './src/content/pages';
const noindexPages = fs
	.readdirSync(PAGES_DIR)
	.filter((file) => file.endsWith('.md'))
	.filter((file) => /^noindex:\s*true\s*$/m.test(fs.readFileSync(`${PAGES_DIR}/${file}`, 'utf8').split(/^---$/m)[1] ?? ''))
	.map((file) => `/${file.slice(0, -3)}/`);

// https://astro.build/config
export default defineConfig({
	site: 'https://spartronics4915.com',
	// Match WordPress: every page URL ends in a slash, like /history/.
	trailingSlash: 'always',
	integrations: [
		sitemap({
			filter: (page) => !noindexPages.some((path) => page.endsWith(path)),
		}),
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

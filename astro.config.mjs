// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://spartronics4915.com',
	// Match WordPress: every page URL ends in a slash, like /history/.
	trailingSlash: 'always',
	integrations: [
		sitemap({
			// Grant applications are shared by link only; keep them out of search.
			filter: (page) => !/\/huney(-public)?\/$/.test(page),
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Raleway',
			cssVariable: '--font-heading',
			weights: [600, 700, 800],
			fallbacks: ['sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'Open Sans',
			cssVariable: '--font-body',
			weights: [400, 600, 700],
			styles: ['normal', 'italic'],
			fallbacks: ['sans-serif'],
		},
	],
});

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

import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';
import { SPONSOR_TIER_IDS } from './data/sponsorTiers';

// One Markdoc file (.mdoc, Markdown plus a few tags) per news post. The file
// name is the post's URL: src/content/posts/open-house-2015.mdoc is served at
// /open-house-2015/.
const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.mdoc' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			date: z.coerce.date(),
			summary: z.string(),
			cover: image().optional(),
			author: z.string().optional(),
			tags: z.array(z.string()).default([]),
			// Set on posts imported from the old WordPress site.
			wordpressId: z.number().optional(),
		}),
});

// Pages written in Markdoc. Each file is served at /<file name>/, unless
// src/pages/ has its own route for it (join.astro, history.astro), which then
// uses this file for its text.
const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '*.mdoc' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Add the page to the main menu, after the built-in links.
		menu: z.boolean().default(false),
		// Keep the page out of search engines and the sitemap; it still works by link.
		noindex: z.boolean().default(false),
	}),
});

// Collections come back sorted by id. For lists where the file's order is the
// display order, record each entry's position as `order` and sort by that.
function inFileOrder(text: string) {
	return (parse(text) as Record<string, unknown>[]).map((entry, order) => ({ ...entry, order }));
}

// One YAML file per sponsor, edited in Keystatic. Each sponsor's logo is in
// src/assets/sponsors/<file name>/.
const sponsors = defineCollection({
	loader: glob({ base: './src/content/sponsors', pattern: '*.yaml' }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			tier: z.enum(SPONSOR_TIER_IDS),
			logo: image().optional(),
			link: z.url().optional(),
			// Order within the tier: lowest first, then sponsors without one by name.
			position: z.number().optional(),
		}),
});

const subteams = defineCollection({
	loader: file('./src/data/subteams.yaml', { parser: inFileOrder }),
	schema: z.object({
		name: z.string(),
		summary: z.string(),
		order: z.number(),
	}),
});

// Every award the team has won, one YAML file per season, shown on /awards/.
const awards = defineCollection({
	loader: glob({ base: './src/content/awards', pattern: '*.yaml' }),
	schema: z.object({
		year: z.coerce.number(),
		note: z.string().optional(),
		awards: z.array(z.string()),
	}),
});

export const collections = { posts, pages, sponsors, subteams, awards };

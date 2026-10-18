import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';
import { SPONSOR_TIER_IDS } from './data/sponsorTiers';

// One Markdown file per news post. The file name is the post's URL:
// src/content/posts/open-house-2015.md is served at /open-house-2015/.
const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
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

// Text-heavy pages (history, join). Each one has its own route in src/pages/.
const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
	}),
});

// Collections come back sorted by id. For lists where the file's order is the
// display order, record each entry's position as `order` and sort by that.
function inFileOrder(text: string) {
	return (parse(text) as Record<string, unknown>[]).map((entry, order) => ({ ...entry, order }));
}

const sponsors = defineCollection({
	loader: file('./src/data/sponsors.yaml', { parser: inFileOrder }),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			tier: z.enum(SPONSOR_TIER_IDS),
			logo: image().optional(),
			link: z.url().optional(),
			order: z.number(),
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

export const collections = { posts, pages, sponsors, subteams };

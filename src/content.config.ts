import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
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

const sponsors = defineCollection({
	loader: file('./src/data/sponsors.yaml'),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			tier: z.enum(SPONSOR_TIER_IDS),
			logo: image().optional(),
			link: z.url().optional(),
		}),
});

const subteams = defineCollection({
	loader: file('./src/data/subteams.yaml'),
	schema: z.object({
		name: z.string(),
		summary: z.string(),
	}),
});

export const collections = { posts, pages, sponsors, subteams };

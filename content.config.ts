// The site's content: every file in content/ belongs to one of these
// collections. The schemas check each file's fields when the site builds, and
// tell the Nuxt Studio editor which form fields to show.
import { defineCollection, defineContentConfig, property, z } from '@nuxt/content';
import { SPONSOR_TIER_IDS } from './shared/data/sponsorTiers';

// Image fields hold a path under public/, like /images/posts/<post name>/cover.jpg.
const image = () => property(z.string()).editor({ input: 'media' });

export default defineContentConfig({
	collections: {
		// One Markdown file per news post. The file name is the post's URL:
		// content/posts/open-house-2015.md is served at /open-house-2015/.
		posts: defineCollection({
			type: 'page',
			source: { include: 'posts/*.md', prefix: '/' },
			schema: z.object({
				date: z.date(),
				summary: z.string(),
				cover: image().optional(),
				author: z.string().optional(),
				tags: z.array(z.string()).default([]),
				// Set on posts imported from the old WordPress site.
				wordpressId: z.number().optional(),
			}),
		}),

		// Pages written in Markdown. Each file is served at /<file name>/, unless
		// app/pages/ has its own route for it (join.vue, history.vue), which then
		// uses this file for its text.
		pages: defineCollection({
			type: 'page',
			source: { include: 'pages/*.md', prefix: '/' },
			schema: z.object({
				// Add the page to the main menu, after the built-in links.
				menu: z.boolean().default(false),
				// Keep the page out of search engines and the sitemap; it still works by link.
				noindex: z.boolean().default(false),
			}),
		}),

		// One YAML file per sponsor. Each sponsor's logo is in
		// public/images/sponsors/<file name>/.
		sponsors: defineCollection({
			type: 'data',
			source: 'sponsors/*.yaml',
			schema: z.object({
				name: z.string(),
				tier: z.enum(SPONSOR_TIER_IDS),
				logo: image().optional(),
				link: z.string().url().optional(),
				// Order within the tier: lowest first, then sponsors without one by name.
				position: z.number().optional(),
			}),
		}),

		// The subteams on the Join page, one YAML file each, shown in `order`.
		subteams: defineCollection({
			type: 'data',
			source: 'subteams/*.yaml',
			schema: z.object({
				name: z.string(),
				summary: z.string(),
				photo: image().optional(),
				order: z.number(),
			}),
		}),

		// Every award the team has won, one YAML file per season, shown on /awards/.
		awards: defineCollection({
			type: 'data',
			source: 'awards/*.yaml',
			schema: z.object({
				year: z.coerce.number(),
				note: z.string().optional(),
				awards: z.array(z.string()),
			}),
		}),
	},
});

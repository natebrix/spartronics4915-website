// The visual editor at http://localhost:4321/keystatic (run `npm run dev`).
// It reads and writes the same Markdoc (.mdoc) files as everyone else, so
// anything saved here shows up as an ordinary change in git.
//
// Storage is `local` for now: edits go straight to the files on this
// computer. Once the site is on GitHub, switching to `github` storage lets
// writers edit from a browser with no setup.
import { collection, config, fields } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';
import { SPONSOR_TIERS } from './src/data/sponsorTiers';

// Keystatic keeps each entry's images in a folder named after the entry:
// src/assets/posts/<post name>/ and src/assets/pages/<page name>/.
const postImages = {
	directory: 'src/assets/posts',
	publicPath: '../../assets/posts/',
};
const pageImages = {
	directory: 'src/assets/pages',
	publicPath: '../../assets/pages/',
};
const sponsorImages = {
	directory: 'src/assets/sponsors',
	publicPath: '../../assets/sponsors/',
};

// Tags writers can insert from the editor's + menu. Each one is defined for
// the site in markdoc.config.mjs.
const components = {
	youtube: block({
		label: 'YouTube video',
		schema: {
			url: fields.url({
				label: 'YouTube link',
				description: 'Paste the video’s link, like https://www.youtube.com/watch?v=…',
				validation: { isRequired: true },
			}),
			title: fields.text({ label: 'Title', description: 'What the video is, for screen readers.' }),
		},
	}),
};

export default config({
	storage: { kind: 'local' },
	ui: {
		brand: { name: 'Spartronics 4915' },
	},
	collections: {
		posts: collection({
			label: 'News posts',
			path: 'src/content/posts/*',
			slugField: 'title',
			format: { contentField: 'content' },
			entryLayout: 'content',
			columns: ['title', 'date'],
			schema: {
				title: fields.slug({
					name: { label: 'Title' },
					slug: {
						label: 'Web address',
						description: 'The post is at spartronics4915.com/<web address>/. Changing it breaks old links.',
					},
				}),
				date: fields.date({ label: 'Date', validation: { isRequired: true } }),
				summary: fields.text({
					label: 'Summary',
					description: 'One or two sentences shown on the News page.',
					multiline: true,
					validation: { length: { min: 1 } },
				}),
				cover: fields.image({
					label: 'Cover photo',
					description: 'Shown on the News page. At most 2000 px wide and under 1 MB.',
					...postImages,
				}),
				author: fields.text({ label: 'Author' }),
				tags: fields.array(fields.text({ label: 'Tag' }), {
					label: 'Tags',
					itemLabel: (props) => props.value,
				}),
				wordpressId: fields.integer({
					label: 'WordPress ID',
					description: 'Only set on posts imported from the old site. Leave it alone.',
				}),
				content: fields.markdoc({
					label: 'Post',
					options: { image: postImages },
					components,
				}),
			},
		}),
		pages: collection({
			label: 'Pages',
			path: 'src/content/pages/*',
			slugField: 'title',
			format: { contentField: 'content' },
			entryLayout: 'content',
			schema: {
				title: fields.slug({
					name: { label: 'Title' },
					slug: {
						label: 'Web address',
						description: 'The page is at spartronics4915.com/<web address>/.',
					},
				}),
				description: fields.text({
					label: 'Description',
					description: 'One sentence for search engines and link previews.',
					validation: { length: { min: 1 } },
				}),
				menu: fields.checkbox({ label: 'Show in the main menu' }),
				noindex: fields.checkbox({
					label: 'Hide from search engines',
					description: 'The page still works for anyone with the link.',
				}),
				content: fields.markdoc({
					label: 'Page',
					options: { image: pageImages },
					components,
				}),
			},
		}),
		sponsors: collection({
			label: 'Sponsors',
			path: 'src/content/sponsors/*',
			slugField: 'name',
			columns: ['name', 'tier'],
			schema: {
				name: fields.slug({
					name: { label: 'Name', description: 'As the sponsor wants it shown, like “Rotary Club of Bainbridge Island”.' },
					slug: { label: 'File name', description: 'Lowercase, with dashes. Leave it as it is.' },
				}),
				tier: fields.select({
					label: 'Tier',
					description: 'The tier names and amounts are on the Support Us page.',
					options: SPONSOR_TIERS.map((tier) => ({ label: `${tier.name} (${tier.amount})`, value: tier.id })),
					defaultValue: 'friends',
				}),
				logo: fields.image({
					label: 'Logo',
					description: 'Logos sit on a blue tile, so use a white or light version. PNG with a transparent background is best.',
					...sponsorImages,
				}),
				link: fields.url({ label: 'Website', description: 'Optional. Clicking the logo goes here.' }),
				position: fields.integer({
					label: 'Position in tier',
					description: 'Optional. Lower numbers come first. Sponsors without one come after, in A–Z order.',
				}),
			},
		}),
		awards: collection({
			label: 'Awards',
			path: 'src/content/awards/*',
			slugField: 'year',
			columns: ['year'],
			schema: {
				year: fields.slug({
					name: {
						label: 'Season',
						description: 'The year of the competition season, like 2027.',
						validation: { pattern: { regex: /^\d{4}$/, message: 'Enter a four-digit year.' } },
					},
					slug: { label: 'File name', description: 'Leave it as it is.' },
				}),
				note: fields.text({ label: 'Note', description: 'Optional. Shown next to the year, like “rookie year”.' }),
				awards: fields.array(fields.text({ label: 'Award', description: 'The award and the event, like “Judges’ Award (Auburn)”.' }), {
					label: 'Awards',
					itemLabel: (props) => props.value,
				}),
			},
		}),
	},
});

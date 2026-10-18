// The visual editor at http://localhost:4321/keystatic (run `npm run dev`).
// It reads and writes the same Markdoc (.mdoc) files as everyone else, so
// anything saved here shows up as an ordinary change in git.
//
// Storage is `local` for now: edits go straight to the files on this
// computer. Once the site is on GitHub, switching to `github` storage lets
// writers edit from a browser with no setup.
import { collection, config, fields } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

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
	},
});

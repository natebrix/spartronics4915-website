import fs from 'node:fs';
import { withTrailingSlash } from 'ufo';

// Every post and page in content/ is served at /<file name>/.
const contentFiles = (dir: string) =>
	fs
		.readdirSync(`./content/${dir}`)
		.filter((file) => file.endsWith('.md'))
		.map((file) => file.slice(0, -'.md'.length));
const postNames = contentFiles('posts');
const pageNames = contentFiles('pages');
// Folders in app/pages/, like news/ and sponsors/. A page can't share their name.
const routeFolders = fs.readdirSync('./app/pages', { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
for (const name of pageNames) {
	if (postNames.includes(name) || routeFolders.includes(name)) {
		throw new Error(`content/pages/${name}.md has the same name as another page or post. Rename the file.`);
	}
}
const contentRoutes = [...postNames, ...pageNames].map((name) => `/${name}/`);
let appRoutes: string[] = [];

// Pages marked `noindex: true` (like the grant applications) stay out of the
// sitemap. Read the front matter directly: the content isn't loaded yet when
// this file runs.
const PAGES_DIR = './content/pages';
const noindexPages = fs
	.readdirSync(PAGES_DIR)
	.filter((file) => file.endsWith('.md'))
	.filter((file) => /^noindex:\s*true\s*$/m.test(fs.readFileSync(`${PAGES_DIR}/${file}`, 'utf8').split(/^---$/m)[1] ?? ''))
	.map((file) => `/${file.slice(0, -'.md'.length)}/`);

// https://nuxt.com/docs/api/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2026-10-01',
	modules: ['@nuxt/content', '@nuxt/image', '@nuxt/fonts', '@nuxtjs/sitemap'],

	// The Nuxt Studio editor (the pencil button, bottom left) only runs with
	// `npm run dev`, editing the files on this computer. `npm run build` makes a
	// fully static site in dist/, with no editor and no server.
	$development: {
		modules: ['nuxt-studio'],
	},

	css: ['~/assets/css/global.css'],

	app: {
		head: {
			htmlAttrs: { lang: 'en' },
			link: [
				{ rel: 'icon', type: 'image/png', href: '/favicon-32.png' },
				{ rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
			],
		},
	},

	// Used for canonical URLs, the sitemap and the RSS feed. Match WordPress:
	// every page URL ends in a slash, like /history/.
	site: {
		url: 'https://spartronics4915.com',
		name: 'Spartronics 4915',
		trailingSlash: true,
	},

	content: {
		// Node's built-in SQLite, so there's nothing extra to install.
		experimental: { sqliteConnector: 'native' },
		build: {
			markdown: {
				// The History page links each robot to its season's ## heading.
				toc: { depth: 2 },
			},
		},
		// Headings get an id to link to, but aren't links themselves.
		renderer: { anchorLinks: false },
	},

	image: {
		// Resize at build time into /_ipx/ on every host. On Vercel it would
		// otherwise use Vercel's image service, which a static build can't.
		provider: 'ipx',
		quality: 80,
	},

	// Fonts follow the Spartronics brand guide: Open Sans for all website text,
	// SF TransRobotics only for the logo and titles (its @font-face is in
	// global.css). Raleway is the print font. @nuxt/fonts downloads Open Sans at
	// build time and serves it from the site.
	fonts: {
		families: [
			{ name: 'Open Sans', provider: 'google', weights: [400, 600, 700, 800], styles: ['normal', 'italic'], global: true },
		],
	},

	sitemap: {
		exclude: noindexPages,
	},

	// Build 404.html from app/error.vue, so a missing page shows the site's
	// own "not found" page.
	experimental: {
		prerenderErrorPages: true,
	},

	nitro: {
		// A plain static build everywhere. Without this, Nitro notices it's
		// building on Vercel or Cloudflare and switches to that host's format.
		preset: 'static',
		prerender: {
			// Build exactly the site's own pages (listed in `hooks` below) rather
			// than following links: old posts link to WordPress addresses that only
			// work through public/_redirects. `npm run check:site` checks those.
			crawlLinks: false,
			routes: ['/rss.xml', ...contentRoutes],
			failOnError: true,
		},
	},

	hooks: {
		// Also build every page in app/pages/ that has no [parameter] in its name.
		'pages:resolved'(pages) {
			appRoutes = pages.filter((page) => !page.path.includes(':')).map((page) => withTrailingSlash(page.path));
		},
		'nitro:init'(nitro) {
			nitro.hooks.hook('prerender:routes', (routes) => {
				for (const route of appRoutes) routes.add(route);
			});
			// Nuxt also writes 200.html, an empty app shell for client-only
			// hosting. Vercel serves it for every unknown URL, which hides the
			// real 404.html, so don't write it.
			nitro.hooks.hook('prerender:generate', (route) => {
				if (route.route === '/200.html') route.skip = true;
			});
		},
	},
});

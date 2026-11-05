# Spartronics 4915 website

The website for FIRST Robotics Competition Team 4915, built with [Nuxt](https://nuxt.com) as a static site.
Every page is a file in this repo, and every change goes through a pull request.

- **Writing a post or updating a page?** Read [docs/editing.md](docs/editing.md).
- **Changing code?** Read [CONTRIBUTING.md](CONTRIBUTING.md).
- **New web lead?** Read [docs/handoff.md](docs/handoff.md).

## Run the site on your computer

You need [Node.js](https://nodejs.org) 22.22.3 or newer (22, 24 or 26).

```sh
npm install
npm run dev
```

Open http://localhost:3000. The page reloads as you save files. While the dev
server runs, the visual editor (Nuxt Studio) is the **Edit this page** button at
the bottom left of every page. Press Ctrl+C to stop.

Writers don't need any of this: they use the hosted editor site from a browser
(see [docs/editing.md](docs/editing.md) and [docs/editor-setup.md](docs/editor-setup.md)).

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the site locally while you edit |
| `npm run build` | Builds the finished site into `dist/` (`nuxt generate`). With `STUDIO_EDITOR=true`, builds the editor site instead (`nuxt build`, with a server) |
| `npm run preview` | Serves the built `dist/` folder |
| `npm run check` | Type-checks the code (`nuxt typecheck`) |
| `npm run check:site` | Finds broken internal links and images over 1 MB (run after `build`) |
| `npm run check:urls` | Checks that every URL from the old WordPress site still works (run after `build`) |
| `npm run verify` | All of the above, the same as the pull request check |
| `npm run vercel:json` | Rewrites `vercel.json` from `public/_redirects` (`check:urls` fails until you do) |
| `npm run deploy:demo` | Builds and uploads a demo copy to `spartronics-demo.pages.dev`, hidden from search engines. Needs `npx wrangler login` once. |
| `npm run import:wordpress -- --backup <folder>` | Re-imports posts from a WordPress backup (only needed during the migration) |

## Where things live

```
content/            everything a writer edits (checked by content.config.ts)
  posts/            one .md file per news post; the file name is its URL
  pages/            one .md file per page; each becomes /<file name>/
                    (Join, History and Calendar have their own code in app/pages/)
  sponsors/         one .yaml file per sponsor
  awards/           one .yaml file per season
  subteams/         one .yaml file per subteam, shown on the Join page
app/
  pages/            one file per route: index.vue is /, join.vue is /join/,
                    [slug].vue serves every post and Markdown page
  components/       pieces of pages: header, footer, sponsor grid, ...
  components/content/  components Markdown can use, like ::youtube-video
  composables/      shared data loading (usePosts, useSponsors, ...)
  layouts/          the frame every page sits in
  error.vue         the "page not found" page (built as 404.html)
  assets/css/       global.css: brand colors, fonts and site-wide styles
shared/
  consts.ts         site-wide settings: email, donate link, menu, social links
  data/             sponsor tiers, history robots, countdown
server/routes/      rss.xml
public/
  images/           photos and logos, resized automatically when the site builds
    posts/<name>/   each post's photos
    pages/<name>/   each page's photos
  _redirects        old URLs and where they go now
  files/            PDFs and other downloads, served as-is
scripts/            the WordPress import and the checks
nuxt.config.ts      site settings, modules and how the build works
docs/               guides for editors and maintainers
```

## Hosting

**Demo:** `npm run deploy:demo` publishes the current build to
https://spartronics-demo.pages.dev without GitHub or the real domain. Before
uploading it adds a `noindex` header and a blocking `robots.txt` to `dist/`
only, so the demo never shows up in search results and production builds are
never affected. The first time, run `npx wrangler login` to connect to the
team's Cloudflare account.

**Preview on Vercel:** https://spartronics-nuxt-preview.vercel.app builds from
`main` on every push, and every pull request gets its own preview link.
Vercel ignores `_redirects`, so `vercel.json` carries the same redirects plus a
`noindex` header for `*.vercel.app` addresses; regenerate it with
`npm run vercel:json` after changing `_redirects`.

**Editor site on Vercel:** a second Vercel project builds the `studio` branch
with `STUDIO_EDITOR=true`: the same site plus a small server, so writers can
sign in to Nuxt Studio with Google from any browser. Their changes are saved to
`studio`, and the **Editor branch** GitHub Action keeps a pull request open from
`studio` into `main`. Setup and day-to-day care: [docs/editor-setup.md](docs/editor-setup.md).

**Production:**
The plan is Cloudflare Pages: production builds from `main`, and every other
branch gets its own preview link. Build command `npm run build`, output folder `dist`, Node 22.

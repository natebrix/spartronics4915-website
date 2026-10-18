# Spartronics 4915 website

The website for FIRST Robotics Competition Team 4915, built with [Astro](https://astro.build).
Every page is a file in this repo, and every change goes through a pull request.

- **Writing a post or updating a page?** Read [docs/editing.md](docs/editing.md).
- **Changing code?** Read [CONTRIBUTING.md](CONTRIBUTING.md).
- **New web lead?** Read [docs/handoff.md](docs/handoff.md).

## Run the site on your computer

You need [Node.js](https://nodejs.org) 22 or newer.

```sh
npm install
npm run dev
```

Open http://localhost:4321. The page reloads as you save files. The visual
editor is at http://localhost:4321/keystatic while the dev server runs. Press
Ctrl+C to stop (or `npx astro dev stop` if it was started in the background).

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs the site locally while you edit |
| `npm run build` | Builds the finished site into `dist/` |
| `npm run preview` | Serves the built `dist/` folder |
| `npm run check` | Type-checks pages and post frontmatter |
| `npm run check:site` | Finds broken internal links and images over 1 MB (run after `build`) |
| `npm run check:urls` | Checks that every URL from the old WordPress site still works (run after `build`) |
| `npm run verify` | All of the above, the same as the pull request check |
| `npm run deploy:demo` | Builds and uploads a demo copy to `spartronics-demo.pages.dev`, hidden from search engines. Needs `npx wrangler login` once. |
| `npm run import:wordpress -- --backup <folder>` | Re-imports posts from a WordPress backup (only needed during the migration) |

## Where things live

```
src/
  content/posts/    one .mdoc file per news post; the file name is its URL
  content/pages/    one .mdoc file per page; each becomes /<file name>/
                    (Join and History have their own code in pages/)
  data/             sponsors, subteams, sponsor tiers, countdown
  assets/           images, resized automatically when the site builds
    posts/<name>/   each post's photos, where the editor puts them
    pages/<name>/   each page's photos
  components/       pieces of pages: header, footer, sponsor grid, ...
  layouts/          the frame every page sits in
  pages/            one file per route: index.astro is /, join.astro is /join/
  consts.ts         site-wide settings: email, donate link, menu, social links
public/
  _redirects        old URLs and where they go now
  files/            PDFs and other downloads, served as-is
scripts/            the WordPress import and the checks
keystatic.config.ts the visual editor's fields
markdoc.config.mjs  custom tags for posts and pages, like {% youtube %}
docs/               guides for editors and maintainers
```

## Hosting

**Demo:** `npm run deploy:demo` publishes the current build to
https://spartronics-demo.pages.dev without GitHub or the real domain. Before
uploading it adds a `noindex` header and a blocking `robots.txt` to `dist/`
only, so the demo never shows up in search results and production builds are
never affected. The first time, run `npx wrangler login` to connect to the
team's Cloudflare account.

**Production:**
The plan is Cloudflare Pages: production builds from `main`, and every other
branch gets its own preview link. Build command `npm run build`, output folder `dist`.

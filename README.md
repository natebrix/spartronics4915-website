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

Open http://localhost:4321. The page reloads as you save files. Press Ctrl+C to stop.

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
| `npm run import:wordpress -- --backup <folder>` | Re-imports posts from a WordPress backup (only needed during the migration) |

## Where things live

```
src/
  content/posts/    one Markdown file per news post; the file name is its URL
  content/pages/    longer text for pages like History and Join
  data/             sponsors, subteams, sponsor tiers, countdown
  assets/           images (resized automatically when the site builds)
  components/       pieces of pages: header, footer, sponsor grid, ...
  layouts/          the frame every page sits in
  pages/            one file per route: index.astro is /, join.astro is /join/
  consts.ts         site-wide settings: email, donate link, menu, social links
public/
  _redirects        old URLs and where they go now
  files/            PDFs and other downloads, served as-is
scripts/            the WordPress import and the checks
docs/               guides for editors and maintainers
```

## Hosting

The plan is Cloudflare Pages: production builds from `main`, and every other
branch gets its own preview link. Build command `npm run build`, output folder `dist`.

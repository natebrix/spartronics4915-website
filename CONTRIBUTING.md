# Making a change

Nobody edits the live site directly. Every change, a typo fix or a new
page, goes through the same steps:

1. **Branch.** Make a branch from `main` named for the change, like `add-sponsor-ace` or `fix-join-dates`.
2. **Change.** Edit files locally (`npm run dev` shows the result as you go) or in GitHub's web editor.
3. **Check.** Run `npm run verify`. It's the same check GitHub runs on your pull request.
4. **Pull request.** Push the branch and open a pull request. Cloudflare posts a preview link on it within a couple of minutes. Open it and click through what you changed.
5. **Review.** One approval is needed. The reviewer looks at the preview, not just the code.
6. **Merge.** Merging to `main` publishes the site in about a minute.

## If the checks fail

The pull request page shows which step failed. Click **Details** to see the message.

- **Type-check or build failed:** usually a post's frontmatter is missing `title`, `date` or `summary`, or the date isn't `YYYY-MM-DD`. The build names the file.
- **Broken internal link:** a page links to a URL that doesn't exist. Fix the link, or add a line to `public/_redirects` if the page moved.
- **Image over 1 MB:** shrink it to at most 2000 px on the long side, or save it as a JPEG.
- **Old URL broken:** a URL from the old WordPress site no longer works. Add a redirect in `public/_redirects`.

## Undoing a bad change on the live site

Fastest: in Cloudflare Pages, open the project's **Deployments** list, find the
last good deployment and choose **Rollback**. The site is restored in seconds.

Then fix `main` so the next merge doesn't bring the problem back: on GitHub,
open the pull request that caused it and click **Revert**. That makes a new pull
request that undoes it. Merge that.

## Code style

- Match the file you're in: tabs in `.vue` and `.ts` files, single quotes. Components use `<script setup lang="ts">`.
- Put site-wide settings in `shared/consts.ts`, not in individual pages.
- Posts and pages are Markdown with [MDC](https://content.nuxt.com/docs/files/markdown) components, like `::youtube-video{url="..."}`. To add a component writers can use, put a Vue file in `app/components/content/`; Nuxt Studio offers it automatically. Fields for posts, pages and data files are defined in `content.config.ts`.
- Data a non-programmer should be able to change goes in `content/` (sponsors, awards, subteams) or `shared/data/` (sponsor tiers, history robots, countdown), not in page code.
- Keep each component's CSS in its own `<style scoped>` block. Colors and sizes come from the variables at the top of `app/assets/css/global.css`.
- Follow the team brand guide. Colors: blue `--blue` (Pantone 7686, #0067b9) and yellow `--yellow` (#f4e400); don't add new brand colors. Fonts: Open Sans (`--font-body`) for all text, including headings. SF TransRobotics (`--font-logo`) is only for the logo and titles, never body text. Raleway is the print font; don't use it on the site.
- Images: use `<NuxtImg>` for photos in templates so they're resized at build time. Photos live in `public/images/`.
- Internal links in templates use `<NuxtLink>` and end in a slash, like `/history/`.
- Never put passwords, API keys or anyone's personal contact details in the repo. The repo is public. Secrets go in GitHub Actions secrets.

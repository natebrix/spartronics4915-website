# Editing the website

This guide is for writers: posting news, adding a page, updating a sponsor.
You don't need to know how to code.

## The editor

The site has a visual editor called Keystatic. For now it runs on a computer
that has the site set up (a web lead can do this for you once):

1. In the `website` folder, run `npm run dev`.
2. Open http://localhost:4321/keystatic.

You'll see **News posts** and **Pages** on the left. Everything you save goes
into the site's files, and a web lead turns it into a pull request so it gets
a preview link and a review before it's live.

> Later, once the site is on GitHub, the same editor will work from any
> browser with a GitHub login, with no setup.

## Write a news post

1. Click **News posts**, then **Add**.
2. Fill in **Title**. The **Web address** fills itself in from the title; that
   becomes the post's URL, so keep it short.
3. Fill in **Date** and **Summary** (one or two sentences for the News page).
4. Write the post in the big box on the left. The toolbar does headings, bold,
   lists, links and tables.
5. Click **Save**.

## Add photos

- **Cover photo:** in the right-hand column, click **Choose file** under
  *Cover photo*. It shows on the News page.
- **Photos in the post:** drag a photo into the text, or use the **+** menu.
  Write a short description of each photo in its *alt text*, for people using
  screen readers.
- Shrink photos first: at most 2000 pixels on the long side and under 1 MB.
  Phone photos are usually too big. On a Mac, open the photo in Preview →
  **Tools → Adjust Size**.

Each post keeps its photos in its own folder, `src/assets/posts/<web address>/`.

## Add a YouTube video

In the post, click **+** → **YouTube video**, paste the video's link, and give
it a title.

## Add a page

1. Click **Pages**, then **Add**.
2. Fill in **Title** and **Description** (one sentence for search engines).
3. Tick **Show in the main menu** if it should be in the menu.
4. Write the page and click **Save**. It's live at
   spartronics4915.com/<web address>/ once the change is merged.

Tick **Hide from search engines** for pages you only want to share by link,
like a grant application.

## Things the editor doesn't cover yet

These are still edited as files, in GitHub or by a web lead:

| To change | Edit |
| --- | --- |
| Sponsors | `src/data/sponsors.yaml` |
| Awards | `src/data/awards.yaml` |
| History robot cards (add next year's robot) | `src/content/pages/history-robots.ts` |
| Subteams | `src/data/subteams.yaml` |
| Home page countdown | `src/data/countdown.ts` |
| Email, donate link, menu, social links | `src/consts.ts` |

The Join, History and Resources text *is* in the editor, under **Pages**.

### Adding a sponsor by hand

Each sponsor in `src/data/sponsors.yaml` looks like this:

```yaml
- id: ace-hardware
  name: Ace Hardware
  tier: gold
  logo: ../assets/sponsors/ace-hardware.png
  link: https://www.acehardware.com/store-details/03732
```

- `id`: the name in lowercase with dashes. It must be different from every other sponsor's.
- `tier`: one of `pantheon`, `presenting`, `gold`, `silver`, `bronze`, `supporting`, `friends`.
- `logo`: optional. Upload the logo to `src/assets/sponsors/` first. Logos sit on a blue tile, so use a white version.
- `link`: optional. The sponsor's website.

To move a sponsor to a new tier, change their `tier` line. The order within a tier is the order in the file.

## If something goes wrong

Ask a web lead. Nothing reaches the live site until a pull request is merged,
so you can't break it by experimenting.

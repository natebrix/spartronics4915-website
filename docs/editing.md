# Editing the website

This guide is for writers: posting news, adding a page, updating a sponsor.
You don't need to know how to code.

## The editor

The site has a visual editor called Nuxt Studio. It works from any browser,
with nothing to install:

1. Open the editor link (a web lead has it; it ends in `/_studio`).
2. Sign in with Google, using the email address a web lead added to the
   editor's list. Any other address gets "not authorized".
3. The site opens with the editor beside it.

The editor's **Content** tab has a folder for each kind of thing on the site:
**Posts**, **Pages**, **Sponsors**, **Awards** and **Subteams**. Its **Media**
tab holds the photos.

### How your changes go live

1. Make your changes. The preview beside the editor shows them as you go.
2. Publish them from the editor, with a few words saying what you changed.
3. Within a couple of minutes, a pull request called *Website edits from the
   editor* appears on GitHub, with a preview link. A web lead checks the preview
   and merges it, and the change is live about a minute later.

Until it's merged, your change shows in the editor but not on the public site.
Everyone's published changes go into the same pull request, so if someone else
published something earlier, it's reviewed and goes live together with yours.

### Editing on your own computer instead

Web leads can also run the editor locally: in the `website` folder, run
`npm run dev`, open http://localhost:3000 and click **Edit this page** at the
bottom left. There, changes go straight into the files on that computer ("Using
local filesystem" at the bottom), and you make the pull request yourself (see
[CONTRIBUTING.md](../CONTRIBUTING.md)).

## Write a news post

1. In **Content**, open the **⋮** menu on **Posts** and choose **New file**.
2. Name the file for the post's web address, like `open-house-2027.md`. The post
   will be at spartronics4915.com/open-house-2027/, so keep it short and don't
   change it later; that breaks old links.
3. Open **Page Settings** at the top and fill in **Title**, **Date**
   (`YYYY-MM-DD`) and **Summary** (one or two sentences for the News page).
4. Write the post below. The editor does headings, bold, lists, links and
   tables.

The editor saves as you go. The preview beside it shows the post as visitors
will see it.

## Add photos

- Put a post's photos in its own folder: in **Media**, open `images` →
  `posts` and make a folder named after the post's file (`open-house-2027`).
- **Cover photo:** in **Page Settings**, pick the photo for *Cover*. It shows
  on the News page.
- **Photos in the post:** add them from the editor. Write a short description
  of each photo in its *alt text*, for people using screen readers.
- Shrink photos first: at most 2000 pixels on the long side and under 1 MB.
  Phone photos are usually too big. On a Mac, open the photo in Preview →
  **Tools → Adjust Size**. The site makes smaller copies itself when it builds.
  The editor will accept a bigger photo, but then the pull request's check
  fails and a web lead has to swap in a smaller copy.

## Add a YouTube video

Put these two lines in the post, on their own, with the video's link:

```
::youtube-video{url="https://www.youtube.com/watch?v=..."}
::
```

## Add a page

1. In **Content**, open the **⋮** menu on **Pages** and choose **New file**.
2. Name it for its web address, like `robot-camp.md`. It will be at
   spartronics4915.com/robot-camp/.
3. In **Page Settings**, fill in **Title** and **Description** (one sentence
   for search engines). Turn on **Menu** if it should be in the main menu.
4. Write the page.

Turn on **Noindex** for pages you only want to share by link, like a grant
application.

## Add or change a sponsor

1. Open **Sponsors**. To change one, click its name; to add one, use **New
   file** and name it for the sponsor, like `ace-hardware.yaml`.
2. Fill in **Name** and pick a **Tier**.
3. Under **Logo**, pick the logo from **Media**. Put each sponsor's logo in
   `images/sponsors/<sponsor file name>/`. Logos sit on a blue tile, so use a
   white or light version of the logo. Sponsors without a logo are listed by
   name.
4. **Link** is optional; clicking the logo goes there.
5. **Position** is optional. Lower numbers come first within the tier;
   sponsors without one follow in A–Z order.

To move a sponsor to a new tier, change their **Tier**. To remove a sponsor,
choose **Delete** from the **⋮** menu next to them.

## Add a season's awards

1. Open **Awards** and make a **New file** named for the year, like `2027.yaml`.
2. Fill in **Year**.
3. Under **Awards**, add one line per award. Write the award and the event,
   like *Judges' Award (Auburn)*.

The Awards page lists seasons newest first.

## Change the subteams

Open **Subteams** and click a subteam to change its name, description or
photo. **Order** is where it appears on the Join page (1 is first).

## Change meeting times

Open **Pages**, then **calendar**, and edit the text. The calendar itself
comes from the team's Google Calendar; change events there.

## Things the editor doesn't cover yet

These are still edited as files, in GitHub or by a web lead:

| To change | Edit |
| --- | --- |
| Sponsorship levels (amounts and benefits) | `shared/data/sponsorTiers.ts` |
| History robot cards (add next year's robot) | `shared/data/robots.ts` |
| Home page countdown | `shared/data/countdown.ts` |
| Email, donate link, menu, social links | `shared/consts.ts` |

The Join, History, Calendar and Resources text *is* in the editor, under **Pages**.

## If something goes wrong

Ask a web lead. Nothing reaches the live site until a pull request is merged,
so you can't break it by experimenting.

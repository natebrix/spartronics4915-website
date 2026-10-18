# Editing the website

This guide is for writers: posting news, adding a sponsor, updating a page.
You don't need to know how to code.

> **Visual editor:** we're still choosing between Pages CMS and Keystatic.
> Until then, use GitHub's web editor as described below. This guide will be
> updated with screenshots once the editor is chosen.

## Write a news post

1. On GitHub, open the repo and go to `src/content/posts/`.
2. Click **Add file → Create new file**.
3. Name the file after the post's URL, using lowercase letters and dashes, ending in `.md`.
   For example, `glacier-peak-2027-recap.md` becomes spartronics4915.com/glacier-peak-2027-recap/.
4. Paste this at the top and fill it in:

   ```markdown
   ---
   title: "Glacier Peak 2027: Day 1 Recap"
   date: 2027-03-06
   summary: "One or two sentences that appear on the News page."
   author: "Your Name"
   tags: ["competition"]
   ---

   Write the post here. Leave a blank line between paragraphs.

   ## A heading

   **Bold text**, *italic text*, and [a link](https://www.thebluealliance.com/team/4915).
   ```

5. Click **Commit changes**, choose **Create a new branch**, then **Propose changes**, and open the pull request.
6. Wait for the preview link on the pull request, check your post there, and ask a web lead to review.

## Add photos to a post

1. Shrink photos first: at most 2000 pixels on the long side, and under 1 MB. Phone photos are usually too big.
   On a Mac, open the photo in Preview → **Tools → Adjust Size**.
2. Upload them to `src/assets/uploads/` (**Add file → Upload files**), on the same branch as your post.
3. In the post, add each photo on its own line:

   ```markdown
   ![Drive team celebrating after the final match](../../assets/uploads/glacier-peak-2027-finals.jpg)
   ```

   The words in square brackets describe the photo for people using screen readers. Always fill them in.

4. To use a photo as the post's cover on the News page, add this line to the frontmatter:

   ```markdown
   cover: "../../assets/uploads/glacier-peak-2027-finals.jpg"
   ```

## Add or change a sponsor

Sponsors are listed in `src/data/sponsors.yaml`. Each sponsor looks like this:

```yaml
- id: ace-hardware
  name: Ace Hardware
  tier: gold
  logo: ../assets/sponsors/ace-hardware.png
  link: https://www.acehardware.com/store-details/03732
```

- `id`: the name in lowercase with dashes. It must be different from every other sponsor's.
- `tier`: one of `pantheon`, `presenting`, `gold`, `silver`, `bronze`, `supporting`, `friends`.
- `logo`: optional. Upload the logo to `src/assets/sponsors/` first. PNG with a transparent background is best.
- `link`: optional. The sponsor's website.

To move a sponsor to a new tier, change their `tier` line. The order within a tier is the order in the file.

## Update a page

| To change | Edit |
| --- | --- |
| Join Us text | `src/content/pages/join.md` |
| History text | `src/content/pages/history.md` |
| History robot cards (add next year's robot) | `src/content/pages/history-robots.ts` |
| Awards | `src/data/awards.yaml` |
| Resources, grant pages | `src/content/pages/resources.md`, `huney.md`, `huney-public.md` |
| Subteams | `src/data/subteams.yaml` |
| Home page countdown | `src/data/countdown.ts` |
| Email, donate link, menu, social links | `src/consts.ts` |

## If something goes wrong

Ask a web lead. Nothing reaches the live site until a pull request is merged,
so you can't break it by experimenting on a branch.

# Setting up the editor site

This is for a mentor or the programming web lead, once. It sets up the editor
that writers use from any browser (see [editing.md](editing.md)).

## How it works

The public site is fully static: plain files, no server. Nuxt Studio's login
needs a small server, so the editor is a **second copy of the site** on Vercel,
built with a server. It has its own address and is kept out of search engines.

```
writer ──► editor site ──saves to──► studio branch ──pull request──► main ──► public site
           (Google login)                  │                  (preview, checks,
                                           │                   one approval)
                                           └─ editor site rebuilds from studio
```

- Writers sign in with Google. Only email addresses on the editor's list get in.
  They don't need GitHub accounts.
- Studio saves with one GitHub token that belongs to the team, never to `main`:
  every save goes to the `studio` branch.
- The **Editor branch** GitHub Action (`.github/workflows/studio-branch.yml`)
  keeps a pull request open from `studio` into `main` while there are unmerged
  edits. After it's merged, the Action moves `studio` back to `main`.
- The editor site builds from `studio`, so writers see their own and each
  other's published edits there before they're live.

The switch between the two builds is the `STUDIO_EDITOR=true` environment
variable, which only the editor's Vercel project sets (`nuxt.config.ts` and
`scripts/build.mjs`).

## 1. GitHub

1. **Create the `studio` branch** from `main`: on the repo's front page, open
   the branch menu, type `studio` and choose **Create branch studio from main**.
2. **Let Actions open pull requests:** **Settings → Actions → General →
   Workflow permissions**: choose **Read and write permissions** and tick
   **Allow GitHub Actions to create and approve pull requests**.
3. **Make the token Studio saves with.** Ideally from a team GitHub account
   (not a person's), because the token lasts beyond any one student:
   **Settings → Developer settings → Fine-grained personal access tokens →
   Generate new token**.
   - Repository access: **Only select repositories**, this repo.
   - Permissions: **Contents: Read and write**. Nothing else.
   - Expiration: the longest allowed (one year). Put the expiry date in the
     handoff checklist's account table.
4. Don't protect the `studio` branch: Studio and the Action both push to it.
   `main` stays protected, so nothing reaches the public site without a review.

## 2. Google sign-in

In [Google Cloud Console](https://console.cloud.google.com), signed in with a
team Google account:

1. Create a project, for example "Spartronics website editor".
2. **APIs & Services → OAuth consent screen**: user type **External**, app name
   "Spartronics website editor", the team email as the contact. Under
   **Audience**, publish the app ("In production"); it only asks for name and
   email, so Google doesn't need to review it.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   type **Web application**. Under **Authorized redirect URIs**, add the
   editor's address followed by `/__nuxt_studio/auth/google`, for example
   `https://spartronics-editor.vercel.app/__nuxt_studio/auth/google`. If you
   don't know the address yet, finish step 3 first and come back.
4. Copy the **Client ID** and **Client secret**.

## 3. Vercel

Add a **second** project for the same repo (the existing preview project stays
as it is):

1. **Add New → Project**, import this repo, and name it, for example,
   `spartronics-editor`.
2. **Environment variables** (Production):

   | Name | Value |
   | --- | --- |
   | `STUDIO_EDITOR` | `true` |
   | `STUDIO_GOOGLE_CLIENT_ID` | from step 2 |
   | `STUDIO_GOOGLE_CLIENT_SECRET` | from step 2 |
   | `STUDIO_GOOGLE_MODERATORS` | the writers' and web leads' Google addresses, separated by commas, no spaces |
   | `STUDIO_GITHUB_TOKEN` | the token from step 1 |
   | `NUXT_STUDIO_AUTH_SESSION_SECRET` | a long random string (for example from `openssl rand -hex 32`) |

   These live only in Vercel, never in the repo: it's public.
3. **Settings → Environments → Production → Branch Tracking**: set the
   production branch to `studio`.
4. **Settings → Git → Ignored Build Step**: choose **Custom** and enter
   `[ "$VERCEL_GIT_COMMIT_REF" != "studio" ]`, so this project only builds the
   `studio` branch (pull requests already get previews from the other project).
5. Deploy. The build log should say ``Building with `nuxt build` (editor site)``.

`vercel.json` sets the build command for both projects; `npm run build` reads
`STUDIO_EDITOR` and picks the right build.

## 4. Test it

1. Open the editor's address followed by `/_studio`. It should send you to
   Google, then back to the site with the editor open.
2. Sign in with an address that isn't on the list: you should get "not
   authorized".
3. Change a word on a test page and publish it. Within a couple of minutes:
   - a commit starting with `Editor:` is on the `studio` branch;
   - a pull request **Website edits from the editor** is open, with the
     checks running and a Vercel preview link;
   - the editor site rebuilds with the change.
4. Close that pull request without merging, then reset `studio` to `main`
   (delete the branch and create it again from `main`).

## Day to day

- **Add or remove a writer:** edit `STUDIO_GOOGLE_MODERATORS` in the editor
  project's Vercel settings, then redeploy (Deployments → ⋯ → Redeploy).
- **The pull request says it's out of date with main:** click **Update branch**.
- **The token expired** (saving fails with a GitHub error): make a new one as in
  step 1 and replace `STUDIO_GITHUB_TOKEN`, then redeploy.
- **The repo moves to the team's GitHub organization:** change `owner` under
  `studio.repository` in `nuxt.config.ts`, and make a new token for the new
  repo.

## Running the editor build locally

To try the server build on your own computer:

```sh
STUDIO_EDITOR=true NITRO_PRESET=node-server npm run build
node .output/server/index.mjs
```

Pages work without any login settings; `/_studio` needs the Google and GitHub
variables above (and a Google redirect URI for `http://localhost:3000`).

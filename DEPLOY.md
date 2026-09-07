# Deploying to Vercel

The repo is on GitHub at `igolly/payload-cms-hemClear` (branch `main`).
The production build passes locally — `pnpm build` prerenders every page.

---

## 1. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** for
**Production, Preview and Development**.

| Variable | Value | Notes |
| --- | --- | --- |
| `DATABASE_URL` | your MongoDB connection string | Same one as `.env`, or a separate production cluster |
| `PAYLOAD_SECRET` | a long random string | **Generate a new one for production** — do not reuse the local value |
| `PREVIEW_SECRET` | a long random string | Guards the draft-preview route |
| `CRON_SECRET` | a long random string | Guards scheduled publishing |
| `BLOB_READ_WRITE_TOKEN` | added automatically | Appears once you connect a Blob store (step 2) |

Generate secrets with:

```bash
openssl rand -base64 32
```

`NEXT_PUBLIC_SERVER_URL` is **not** required — `next.config.ts` and
`src/utilities/getURL.ts` both fall back to `VERCEL_PROJECT_PRODUCTION_URL`,
which Vercel sets for you. Set it only when you attach a custom domain, in
which case use the full origin with no trailing slash (e.g. `https://hemclear.com`).

---

## 2. Blob storage — required, not optional

Vercel's filesystem is **read-only**, so Payload cannot write uploads to
`public/media` in production. Without this step the admin appears to work but
every upload fails.

1. Vercel dashboard → **Storage** → **Create Database** → **Blob**
2. Connect it to this project
3. Vercel injects `BLOB_READ_WRITE_TOKEN` automatically
4. Redeploy

`src/plugins/index.ts` always registers the adapter; it disables itself and falls
back to `public/media` when no token is present, so local development is unchanged
and the collection schema stays identical across environments.

`clientUploads: true` is set, which matters: Vercel caps a serverless function's
request body at **4.5MB**. Without it the file is proxied through the function and
anything larger fails to upload. With it, the browser uploads straight to Blob.

**Existing images will not carry over.** `public/media/` is gitignored, so the
files uploaded locally are not in the repo. After the first deploy, re-upload
them through `/admin` → Media. The Media documents already exist in the
database; re-uploading repoints them at Blob URLs.

---

## 3. MongoDB network access

Vercel builds and functions run from rotating IPs. In **MongoDB Atlas →
Network Access**, allow `0.0.0.0/0`, or use Atlas's Vercel integration.
A restrictive IP allowlist is the most common cause of a build that hangs and
then fails on the database connection.

---

## 4. Import the project

1. Vercel → **Add New → Project** → import `igolly/payload-cms-hemClear`
2. Framework preset: **Next.js** (detected)
3. Build command, output directory and install command: **leave as defaults**
   — `pnpm build` already runs `next build` followed by `next-sitemap`
4. Node version: **20 or 22** (Settings → General → Node.js Version).
   `package.json` requires `^18.20.2 || >=20.9.0`
5. Add the environment variables from step 1, then **Deploy**

---

## 5. After the first deploy

1. Visit `/admin` and sign in — users live in the database, so your existing
   login works
2. Re-upload media (step 2)
3. Check the pages: `/`, `/why`, `/ingredients`, `/about-hemorrhoids`, `/faq`,
   `/products/hemclear-total-care-system`
4. If you add a custom domain, set `NEXT_PUBLIC_SERVER_URL` to it and redeploy

### Scheduled publishing (optional)

`Pages` and `Products` support scheduled publishing, which needs a cron job to
run the queue. Add `vercel.json`:

```json
{
  "crons": [{ "path": "/api/payload-jobs/run", "schedule": "*/5 * * * *" }]
}
```

Vercel sends `Authorization: Bearer $CRON_SECRET`, which
`src/payload.config.ts` already checks. Cron jobs need a Pro plan.

---

### Uploads still failing?

Work through these in order:

1. **Is the Blob store connected?** Vercel → Storage. If not, uploads have nowhere
   to go and Payload falls back to the read-only filesystem.
2. **Is `BLOB_READ_WRITE_TOKEN` in the project's environment variables**, ticked for
   Production? Connecting the store adds it, but only to the environments you select.
3. **Did you redeploy after connecting?** Environment variables are read at build
   start; connecting a store does not retrigger a build.
4. **Check the function logs** (Vercel → Logs) while uploading. `EROFS: read-only
   file system` means the token is missing. `413` means the body limit — confirm
   `clientUploads: true` shipped.

## Build note

`postcss.config.mjs` **must keep the `.mjs` extension**. As `postcss.config.js` under
`"type": "module"`, Turbopack fails to evaluate it and the build dies with
`TypeError: __turbopack_context__.a is not a function`. This was the cause of the
early Vercel build failures.

## Known issues to fix before launch

1. **11 links have no destination** — Shipping Information, Returns and
   Refunds, Track My Order, My Account, Reviews, Customer Stories, Terms and
   Conditions, Privacy Policy, Return Policy, Accessibility, Supplement
   Disclaimer. They 404 today.
2. **Header nav overflows at 390px** — `src/Header/Nav/index.tsx` has no mobile
   menu, so the page scrolls sideways on a phone. The only page-level overflow
   on the site.
3. **A `/undefined` draft page** exists in the CMS. Delete it in
   `/admin` → Pages.
4. **ESLint is broken repo-wide** — `@eslint/eslintrc` throws
   `Converting circular structure to JSON` on any file, including untouched
   ones. `tsc --noEmit` is clean and is the current type gate.
5. **Placeholder images** — dashed boxes mark every unset upload field
   (product gallery, ingredient photos, doctor headshots, benefit photos).

## Local development

```bash
pnpm install          # or: pnpm ii
pnpm dev              # http://localhost:3000, admin at /admin
pnpm build            # production build
pnpm generate:types   # after any field/config change
```

See `WORKFLOW.md` for the architecture and how to add a section.

# Deploying to Vercel

The repo is on GitHub at `igolly/payload-cms-hemClear` (branch `main`).
The production build passes locally — `pnpm build` prerenders every page.

---

## 1. Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** for
**Production, Preview and Development**.

| Variable                | Value                          | Notes                                                                |
| ----------------------- | ------------------------------ | -------------------------------------------------------------------- |
| `DATABASE_URL`          | your MongoDB connection string | Same one as `.env`, or a separate production cluster                 |
| `PAYLOAD_SECRET`        | a long random string           | **Generate a new one for production** — do not reuse the local value |
| `PREVIEW_SECRET`        | a long random string           | Guards the draft-preview route                                       |
| `CRON_SECRET`           | a long random string           | Guards scheduled publishing                                          |
| `BLOB_READ_WRITE_TOKEN` | added automatically            | Appears once you connect a Blob store (step 2)                       |

Generate secrets with:

```bash
openssl rand -base64 32
```

`NEXT_PUBLIC_SERVER_URL` is **not** required — `next.config.ts` and
`src/utilities/getURL.ts` both fall back to `VERCEL_PROJECT_PRODUCTION_URL`,
which Vercel sets for you. Set it only when you attach a custom domain, in
which case use the full origin with no trailing slash (e.g. `https://hemclear.com`).

---

## 2. Object storage — required, not optional

Vercel's filesystem is **read-only**, so Payload cannot write uploads to
`public/media` in production. Without this step the admin appears to work but
every upload returns a 500.

Uploads go to **Supabase Storage**, which speaks the S3 API, through Payload's
official S3 adapter. The same configuration works unchanged for Cloudflare R2 or
AWS S3 if you ever move.

### Set up the bucket

1. Supabase → **Storage** → **New bucket** → name it e.g. `media` → **Public**
2. Supabase → **Project Settings** → **Storage** → **S3 access keys** →
   **New access key**. Copy both halves — the secret is shown once.
3. Note your S3 endpoint and region from the same page. The endpoint looks like
   `https://<project-ref>.supabase.co/storage/v1/s3`

### Add the variables in Vercel

Settings → Environment Variables. **Tick Production on every one** — this is the
step that is easy to miss, and a variable that isn't scoped to Production is
invisible to the production build.

| Variable               | Example                                      |
| ---------------------- | -------------------------------------------- |
| `S3_BUCKET`            | `media`                                      |
| `S3_ENDPOINT`          | `https://abcdefgh.supabase.co/storage/v1/s3` |
| `S3_REGION`            | `us-east-1` (whatever your project reports)  |
| `S3_ACCESS_KEY_ID`     | from the S3 access key                       |
| `S3_SECRET_ACCESS_KEY` | from the S3 access key                       |

Then **redeploy** — environment variables are read at build start.

`src/plugins/index.ts` enables the adapter only when `S3_BUCKET` and
`S3_ACCESS_KEY_ID` are both set, so local development keeps writing to
`public/media` with no configuration. The plugin is registered either way, so the
collection schema is identical across environments.

**Existing images will not carry over.** `public/media/` is gitignored, so files
uploaded locally are not in the repo. After the first deploy, re-upload them
through `/admin` → Media. The Media documents already exist and blocks reference
them by ID, so re-uploading repoints them at storage URLs.

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

## Standing up another brand on this template

The site's identity is data — a **Websites** record holds the brand name, domain,
logo, contact details and palette, and `src/app/(frontend)/layout.tsx` writes that
palette into the page head as a `:root` override. Tailwind compiles every brand
utility to a custom property, so those eight colours re-skin the whole site with
no code change.

That is what makes a second brand cheap: **one repository, one Vercel project per
site, one database per site.** The sites run the same commit and differ only by
environment variables.

### What each site needs

| Resource         | Per site?  | Notes                                                                                     |
| ---------------- | ---------- | ----------------------------------------------------------------------------------------- |
| GitHub repo      | **shared** | Every site deploys the same `main`                                                        |
| Vercel project   | one each   | A project can point at a repo another project already uses                                |
| MongoDB database | one each   | One Atlas cluster holds many databases — change the name in the URI path, not the cluster |
| Supabase bucket  | one each   | One Supabase project holds many buckets — only `S3_BUCKET` changes                        |
| Domain           | one each   |                                                                                           |

So a second brand costs a Vercel project, a database name and a bucket name. It
does not cost another cluster, another Supabase project or another repository.

### Adding a site

1. **Vercel → Add New → Project**, import the same repository. Vercel allows
   several projects from one repo.
2. Copy the environment variables from the existing project and change:

   | Variable                        | Change                                                                                         |
   | ------------------------------- | ---------------------------------------------------------------------------------------------- |
   | `DATABASE_URL`                  | the database name at the end of the URI — `…mongodb.net/brandb`                                |
   | `S3_BUCKET`                     | a new bucket, created in the same Supabase project                                             |
   | `PAYLOAD_SECRET`                | **a fresh one.** Sharing it across sites means a session cookie from one is valid on the other |
   | `PREVIEW_SECRET`, `CRON_SECRET` | fresh, same reasoning                                                                          |
   | `NEXT_PUBLIC_SERVER_URL`        | the new domain                                                                                 |

   Everything else — `S3_ENDPOINT`, `S3_REGION`, the access keys — is shared,
   because they identify the Supabase project rather than the bucket.

3. Deploy, then open `/admin`, create the first user, and fill in **Settings →
   Websites**: name, domain, and only the colours that differ from the palette in
   `globals.css`. A blank colour falls through to the stylesheet.
4. Attach the domain and set `NEXT_PUBLIC_SERVER_URL` to match.

### Keeping the sites in step

Because every site deploys the same branch, a fix to a block reaches all of them
on the next deploy — which is the point, and also the risk. Merge to `main`
through a pull request and let Vercel's preview build check it before it becomes
every brand's production.

A site that genuinely needs different code — a block no other brand has — should
get its own branch, and that Vercel project should track that branch. Merge `main`
into it to pick up template work. Do this only when a site needs different
_markup_; different colours, copy and images are all data and need no branch.

### What is not data yet

- **Icon artwork.** The files under `public/icons/` are flat images drawn in
  HemClear blue, so they do not follow a palette change. The ones that carry brand
  colour want converting to inline SVG using `currentColor`.
- **Fonts.** Loaded in the frontend layout, so a brand with a different typeface
  needs a code change.
- **Page content.** A new database starts with an empty Pages collection. Until
  there is an export of this site's pages as an importable template, a new brand
  starts from blank pages rather than from HemClear's structure.

---

## Local development

```bash
pnpm install          # or: pnpm ii
pnpm dev              # http://localhost:3000, admin at /admin
pnpm build            # production build
pnpm generate:types   # after any field/config change
```

See `WORKFLOW.md` for the architecture and how to add a section.

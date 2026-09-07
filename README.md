# HemClear® — Marketing Site

Marketing and e-commerce content site for HemClear®, built on
[Payload CMS 3](https://payloadcms.com) and Next.js 16 in a single application.

Every section of every page is editable in the CMS. There is no hardcoded page copy.

---

## Stack

| | |
| --- | --- |
| CMS | Payload 3.88 |
| Framework | Next.js 16.3 (App Router, React 19) |
| Database | MongoDB (Mongoose adapter) |
| Styling | Tailwind CSS 4 |
| Uploads | local disk in dev, Supabase Storage (S3 API) in production |
| Package manager | pnpm |

---

## Getting started

```bash
pnpm install          # or: pnpm ii
cp .env.example .env  # then fill in DATABASE_URL and PAYLOAD_SECRET
pnpm dev
```

- Site — http://localhost:3000
- Admin — http://localhost:3000/admin

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build (Turbopack) + sitemap |
| `pnpm build:webpack` | Same via webpack — fallback if Turbopack misbehaves |
| `pnpm generate:types` | **Run after any field or config change** — rewrites `src/payload-types.ts` |
| `pnpm generate:importmap` | Run after adding an admin-side React component |
| `pnpm test` | Vitest (integration) + Playwright (e2e) |

`pnpm generate:types` is not optional. Field config is the source of truth and the
TypeScript types are generated from it; every block component is typed off
`payload-types.ts`.

---

## How the site is structured

```
Editor (/admin)              Database                    Frontend
───────────────              ────────                    ────────
Pages    { hero, layout[] }  ──query──▶  app/(frontend)/[slug]/page.tsx
Products { …, layout[] }     ──query──▶  app/(frontend)/products/[slug]/page.tsx
Globals  { header, footer }                 └─ <RenderBlocks blocks={layout} />

afterChange hook ──▶ revalidatePath() ──▶ Next cache invalidated
```

### Content model

| Collection | Route | Purpose |
| --- | --- | --- |
| `pages` | `/[slug]` | Marketing pages — a hero plus a free-form list of blocks |
| `products` | `/products/[slug]` | Product detail: gallery, buy box, results, plus blocks below |
| `media` | — | Uploads |
| `users` | — | Admin accounts |

Globals: **Header** (announcement bar + nav) and **Footer** (link columns,
promises, socials, legal, disclaimer).

### Pages currently published

`/` · `/why` · `/ingredients` · `/about-hemorrhoids` · `/faq` · `/contact` ·
`/products/hemclear-total-care-system`

---

## The block library

Page layouts are composed from these. All are available to both `pages` and
`products`.

| Block | What it renders |
| --- | --- |
| `statsBar` | Trust stats row — "20 Years in Business", "4.8★" |
| `causes` | Illustration + heading + icon cards or a checklist, either side |
| `productSystem` | Copy · diagram · feature-card columns |
| `videoStories` | Scroll-snap carousel of phone-framed customer videos |
| `waysGrid` | Auto-numbered benefit grid |
| `supportTabs` | Tab row + card carousel sharing one scroll position |
| `pairing` | Two feature columns flanking a product shot |
| `totalCare` | Two-sided system card |
| `pricingOffer` | Offer banner + plan cards + trust bar |
| `scienceStats` | Visual + big-number stats + CTAs |
| `benefitsCarousel` | Photo cards with expandable detail |
| `formulaTable` | Product toggle + ingredient/benefit table |
| `savingsCompare` | "Buying separately" vs the formula |
| `guarantee` | Promise seal, points, trust pills |
| `whyDays` | Image · copy · product shot with a CTA |
| `comparison` | Product comparison table, one column highlighted |
| `reviews` | Featured reviews + expandable customer grid |
| `closingCta` | Final pitch with photo cards |
| `medicalReview` | Reviewer cards with credentials |
| `faq` | Header band + numbered accordion |
| `featureStrip` | Icon/title/description in four layout variants |
| `bannerHero` | Full-bleed image band with overlay |
| `ingredientExplorer` | Formula toggle + category filter + ingredient cards |
| `formBlock` | Form-builder form |

**Adding a section is a five-file recipe.** See [`WORKFLOW.md`](./WORKFLOW.md) —
it covers the architecture, the recipe, the conventions and the gotchas.

---

## Design tokens

The brand colours are declared once in the `@theme` block of
`src/app/(frontend)/globals.css` and used as Tailwind utilities
(`bg-brand`, `text-heading`, `bg-navy`):

```css
--color-brand:      #0023a3;  /* CTAs, icons, UI accents */
--color-navy:       #192f7c;  /* full-width dark bands */
--color-heading:    #192f7c;  /* main section headings (h1/h2) */
--color-subheading: #0329b2;  /* card titles (h3/h4) */
```

Changing a brand colour is a one-line edit here, not a find-and-replace.

---

## Editor features

- **Drafts and autosave** on pages and products, with scheduled publishing
- **Live preview** with mobile / tablet / desktop breakpoints
- **Click-to-edit** — clicking a section in the live preview opens that field in
  the editor. Implemented in `src/components/VisualEditorBridge` (iframe side)
  and `src/components/VisualEditorTarget` (admin side)
- **Image placeholders** — unset upload fields render a dashed box that holds
  its exact space, so half-filled blocks look deliberate
- **SEO fields** on every page and product

---

## Deployment

See [`DEPLOY.md`](./DEPLOY.md) for the full Vercel guide. In short:

1. Set `DATABASE_URL`, `PAYLOAD_SECRET`, `PREVIEW_SECRET`, `CRON_SECRET`
2. Configure Supabase Storage (`S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`,
   `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`) — the serverless filesystem is
   read-only, so uploads fail without it
3. Allow Vercel's IPs in MongoDB Atlas network access

---

## Project layout

```
src/
├── app/
│   ├── (frontend)/          # public site
│   └── (payload)/           # admin UI, REST, GraphQL — generated
├── blocks/                  # one folder per block: config.ts + Component.tsx
├── collections/             # Pages, Products, Media, Users
├── components/              # shared UI (BrandIcons, ProductDetail, Link, Media…)
├── fields/                  # reusable field factories (link, linkGroup)
├── heros/                   # hero variants + config
├── Header/ · Footer/        # globals and their components
├── plugins/                 # SEO, redirects, form builder, blob storage
└── payload.config.ts        # entry point
```

`src/payload-types.ts` is generated — never edit it by hand.

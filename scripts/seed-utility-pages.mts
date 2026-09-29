/**
 * Creates the pages the footer already links to but which were never built, so that no link
 * on the site lands on a 404.
 *
 * Run with:
 *   NODE_OPTIONS="--no-deprecation --import=tsx/esm" node --env-file=.env ./scripts/seed-utility-pages.mts
 *
 * Idempotent: a slug that already exists is left exactly as it is, so re-running after an
 * editor has rewritten a page will not undo their work. Pass `--force` to overwrite.
 *
 * The prose here is DEMO COPY, not legal advice, and each policy page says so at the top in
 * a banner the editor deletes in one go. The shop and stories pages are seeded by copying
 * the sections off pages that already exist, so they render as real pages rather than as
 * empty scaffolding — the content on them is the other page's until someone changes it.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const force = process.argv.includes('--force')

/** Deleted in one click by an editor; loud enough that nobody ships it by accident. */
const NOTICE = `<p style="background:#fff4e5;border-left:4px solid #e8a33d;padding:12px 16px;margin:0 0 28px">
  <strong>Placeholder copy.</strong> This page is here so the link works. Replace the text below
  with your own before launch — it has not been reviewed by anyone qualified to write it.
</p>`

const updated = 'This page was last updated on 29 September 2026.'

type Doc = { heading?: string; html: string; slug: string; title: string }

const policyPages: Doc[] = [
  {
    slug: 'shipping',
    title: 'Shipping Information',
    heading: 'Shipping Information',
    html: `${NOTICE}
<p>Orders are picked and packed from our fulfilment centre on business days. You will get a
confirmation email as soon as your order is placed, and a second email with tracking once it
leaves the warehouse.</p>

<h2>Processing time</h2>
<p>Most orders leave the warehouse within one business day. Orders placed on a weekend or a
public holiday are processed the next business day.</p>

<h2>Delivery estimates</h2>
<table>
  <thead><tr><th>Service</th><th>Estimated delivery</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td>Standard</td><td>3–7 business days</td><td>Free on orders over $50</td></tr>
    <tr><td>Expedited</td><td>2–3 business days</td><td>$9.95</td></tr>
    <tr><td>Priority</td><td>1–2 business days</td><td>$19.95</td></tr>
  </tbody>
</table>
<p>Estimates are for delivery within the contiguous United States and start from the day your
order ships, not the day you place it.</p>

<h2>Discreet packaging</h2>
<p>Every order ships in a plain box with no branding, no product names and no description of
the contents on the outside. The sender shows on your statement and on the label as our
parent company name.</p>

<h2>International orders</h2>
<p>We ship to Canada, the United Kingdom, Australia and most of the EU. Any customs duties or
import taxes are set by the destination country and are the responsibility of the recipient.</p>

<h2>Something went wrong?</h2>
<p>If your tracking has not moved for more than five business days, or your parcel arrives
damaged, contact us and we will sort it out.</p>
<p><em>${updated}</em></p>`,
  },
  {
    slug: 'returns',
    title: 'Returns and Refunds',
    heading: 'Returns and Refunds',
    html: `${NOTICE}
<p>We back every order with a 60-day money-back guarantee. If the product is not right for
you, send it back and we will refund it — opened bottles included.</p>

<h2>How to start a return</h2>
<ol>
  <li>Email our support team with your order number and the reason for the return.</li>
  <li>We reply with a prepaid return label, usually the same business day.</li>
  <li>Put the items in any box, attach the label and drop it off.</li>
</ol>

<h2>What you get back</h2>
<ul>
  <li>The full purchase price of the returned items.</li>
  <li>Original shipping, if the return is because of our error or a faulty product.</li>
  <li>Refunds go back to the card or account used for the order.</li>
</ul>
<p>Refunds are issued within five business days of the return arriving, though how quickly it
appears on your statement is up to your bank.</p>

<h2>The 60 days</h2>
<p>The window runs from the day your order is delivered, not the day it was placed. A return
started on day 60 is honoured even if the parcel reaches us later.</p>

<h2>Subscriptions</h2>
<p>You can cancel or reschedule a subscription at any time from your account or by contacting
support. Cancelling before the next billing date stops that shipment entirely.</p>

<h2>Exceptions</h2>
<p>We cannot accept returns on items bought from a third-party seller. Contact the seller you
bought from instead.</p>
<p><em>${updated}</em></p>`,
  },
  {
    slug: 'track',
    title: 'Track My Order',
    heading: 'Track My Order',
    html: `${NOTICE}
<p>Every order gets a tracking number by email as soon as it leaves our warehouse. The quickest
way to find your parcel is to open that email and follow the link.</p>

<h2>Can't find the email?</h2>
<ul>
  <li>Check the spam or promotions folder — shipping notifications often land there.</li>
  <li>Search your inbox for your order number, or for the word "shipped".</li>
  <li>Make sure you are looking in the inbox you used at checkout.</li>
</ul>

<h2>Tracking hasn't updated</h2>
<p>Carriers scan a parcel at each handover, so it is normal for tracking to sit still for a day
or two between scans, especially over a weekend. If nothing has changed for more than five
business days, get in touch and we will chase it.</p>

<h2>Still stuck?</h2>
<p>Contact our support team with your order number and we will look it up and tell you where it
is. If it has genuinely gone missing, we will send a replacement.</p>
<p><em>${updated}</em></p>`,
  },
  {
    slug: 'terms',
    title: 'Terms and Conditions',
    heading: 'Terms and Conditions',
    html: `${NOTICE}
<p>These terms govern your use of this website and any purchase you make through it. By using
the site you agree to them.</p>

<h2>1. Using this site</h2>
<p>You may use this site for your own personal, non-commercial purposes. You may not copy,
scrape, resell or republish any part of it without written permission.</p>

<h2>2. Orders</h2>
<p>An order is an offer to buy. We accept it when we send the shipping confirmation. We may
decline or cancel an order — for example where a product is out of stock, where a price was
listed in error, or where we suspect fraud — and will refund you in full if we do.</p>

<h2>3. Prices</h2>
<p>Prices are shown in US dollars and may change without notice. The price that applies to your
order is the one shown at checkout. Taxes are added where required.</p>

<h2>4. Subscriptions</h2>
<p>If you choose a subscription, you authorise us to charge your payment method on the schedule
shown at checkout until you cancel. You can cancel at any time, effective from the next
billing date.</p>

<h2>5. Health claims</h2>
<p>Our products are dietary supplements and topical products. They are not intended to diagnose,
treat, cure or prevent any disease. See our <a href="/disclaimer">supplement disclaimer</a>.</p>

<h2>6. Limitation of liability</h2>
<p>To the extent the law allows, our liability for any claim relating to a product or to this
site is limited to the amount you paid for the order the claim relates to.</p>

<h2>7. Changes</h2>
<p>We may update these terms. The version published here is the one that applies, and the date
below tells you when it last changed.</p>

<h2>8. Contact</h2>
<p>Questions about these terms can go to our <a href="/contact">support team</a>.</p>
<p><em>${updated}</em></p>`,
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    heading: 'Privacy Policy',
    html: `${NOTICE}
<p>This policy explains what we collect when you use this site, why we collect it, and what
choices you have.</p>

<h2>What we collect</h2>
<ul>
  <li><strong>What you give us:</strong> name, shipping and billing address, email address,
      phone number and order history.</li>
  <li><strong>Payment details:</strong> handled by our payment processor. We never see or store
      your full card number.</li>
  <li><strong>How you use the site:</strong> pages viewed, device and browser type, and the
      general region your IP address resolves to.</li>
</ul>

<h2>Why we collect it</h2>
<p>To take payment, ship your order, answer your questions, meet our legal and tax obligations,
and understand which parts of the site are useful.</p>

<h2>Who we share it with</h2>
<p>Only the companies that help us run the shop — payment processing, fulfilment and delivery,
email, and analytics — and only the data each one needs to do its job. We do not sell your
personal information.</p>

<h2>Cookies</h2>
<p>We use cookies to keep your basket, to remember you between visits, and to measure how the
site is used. You can refuse non-essential cookies without losing the ability to shop.</p>

<h2>Your choices</h2>
<ul>
  <li>Ask for a copy of what we hold about you.</li>
  <li>Ask us to correct it or delete it.</li>
  <li>Unsubscribe from marketing email using the link in any message we send.</li>
</ul>

<h2>How long we keep it</h2>
<p>Order records are kept as long as tax and accounting rules require. Marketing preferences are
kept until you change them.</p>

<h2>Children</h2>
<p>This site is not directed at children under 13 and we do not knowingly collect their data.</p>

<h2>Contact</h2>
<p>To exercise any of the rights above, write to our <a href="/contact">support team</a>.</p>
<p><em>${updated}</em></p>`,
  },
  {
    slug: 'accessibility',
    title: 'Accessibility',
    heading: 'Accessibility',
    html: `${NOTICE}
<p>We want this site to be usable by everyone, including people who browse with a screen reader,
a keyboard alone, or at a high zoom level.</p>

<h2>What we aim for</h2>
<p>We work towards the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA. That covers
things like colour contrast, text that resizes without breaking the layout, labelled form
fields, and every control being reachable with a keyboard.</p>

<h2>What we have done</h2>
<ul>
  <li>Headings are structured so a screen reader can skim the page.</li>
  <li>Images that carry meaning have text alternatives.</li>
  <li>Controls can be reached and operated with a keyboard, and show where the focus is.</li>
  <li>Text and background colours are chosen to stay legible.</li>
</ul>

<h2>Where we fall short</h2>
<p>Some older content and some third-party components — embedded video players in particular —
do not yet meet the standard throughout. We fix these as we find them.</p>

<h2>Tell us about a problem</h2>
<p>If something on this site is difficult or impossible for you to use, please tell us what page
it was and what got in your way. Reports like that are the fastest way we find real problems,
and we will reply. You can reach us through our <a href="/contact">contact page</a>.</p>
<p><em>${updated}</em></p>`,
  },
  {
    slug: 'disclaimer',
    title: 'Supplement Disclaimer',
    heading: 'Supplement Disclaimer',
    html: `${NOTICE}
<p>Please read this before using any product bought from this site.</p>

<h2>These statements have not been evaluated</h2>
<p>Statements made on this site about dietary supplements have not been evaluated by the Food and
Drug Administration. These products are not intended to diagnose, treat, cure or prevent any
disease.</p>

<h2>Not medical advice</h2>
<p>Nothing on this site is medical advice and nothing here replaces a conversation with your own
doctor. If you have a medical condition, are pregnant or breastfeeding, or take prescription
medication, talk to a healthcare professional before starting any supplement.</p>

<h2>See a doctor if</h2>
<ul>
  <li>You notice rectal bleeding, or bleeding that changes in amount or colour.</li>
  <li>Pain is severe, or it gets worse rather than better.</li>
  <li>Symptoms last longer than seven days despite treatment.</li>
  <li>You have a fever alongside your symptoms.</li>
</ul>
<p>These can be signs of something that needs diagnosing properly. Do not wait them out.</p>

<h2>Results vary</h2>
<p>Customer-reported results describe what those customers experienced. They are not a promise of
what you will experience, and they are not a clinical result.</p>

<h2>Ingredients and allergies</h2>
<p>Check the full ingredient list before use. Stop using the product and seek advice if you have
a reaction.</p>
<p><em>${updated}</em></p>`,
  },
]

/** Pages seeded by lifting sections off a page that already exists. */
const clonedPages: { from: string; keep: string[]; slug: string; title: string }[] = [
  {
    slug: 'hemclear-capsules',
    title: 'HemClear® Capsules',
    from: 'hemclear-total-care-system',
    keep: ['productDetail', 'reviews', 'guarantee', 'faq'],
  },
  {
    slug: 'hemcream',
    title: 'HemCream®',
    from: 'hemclear-total-care-system',
    keep: ['productDetail', 'reviews', 'guarantee', 'faq'],
  },
  {
    slug: 'offers',
    title: 'Current Offers',
    from: 'home',
    keep: ['pricingOffer', 'savingsCompare', 'guarantee'],
  },
  {
    slug: 'stories',
    title: 'Customer Stories',
    from: 'home',
    keep: ['videoStories', 'reviews'],
  },
]

/** Array rows carry ids that belong to the document they came from; let Payload mint new ones. */
const stripIds = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(stripIds)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== 'id')
        .map(([key, inner]) => [key, stripIds(inner)]),
    )
  }
  return value
}

const run = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'pages', depth: 0, limit: 200, pagination: false })
  const bySlug = new Map(existing.docs.map((doc) => [doc.slug, doc]))

  const write = async (slug: string, title: string, layout: unknown[], description: string) => {
    const found = bySlug.get(slug)

    if (found && !force) {
      console.log(`  skip   /${slug} — already exists`)
      return
    }

    const data = {
      _status: 'published' as const,
      hero: { type: 'none' as const },
      layout,
      meta: { description, title },
      slug,
      title,
    }

    // `revalidatePath` only works inside a request, and this runs in a plain node process.
    // The pages are new, so there is no stale render to clear; a running dev server picks
    // them up on the next request either way.
    const context = { disableRevalidate: true }

    if (found) {
      await payload.update({ collection: 'pages', context, id: found.id, data: data as never })
      console.log(`  update /${slug}`)
    } else {
      await payload.create({ collection: 'pages', context, data: data as never })
      console.log(`  create /${slug}`)
    }
  }

  console.log('Policy pages')
  for (const page of policyPages) {
    await write(
      page.slug,
      page.title,
      [{ blockType: 'rawHtml', heading: page.heading, html: page.html, width: 'prose' }],
      `${page.title} for HemClear®.`,
    )
  }

  console.log('Pages cloned from existing sections')
  for (const page of clonedPages) {
    const source = bySlug.get(page.from)

    if (!source) {
      console.log(`  skip   /${page.slug} — source page /${page.from} not found`)
      continue
    }

    const blocks = ((source.layout ?? []) as { blockType: string }[]).filter((block) =>
      page.keep.includes(block.blockType),
    )

    if (blocks.length === 0) {
      console.log(`  skip   /${page.slug} — no matching sections on /${page.from}`)
      continue
    }

    await write(
      page.slug,
      page.title,
      stripIds(blocks) as unknown[],
      `${page.title} from HemClear®.`,
    )
  }

  console.log('Done.')
  process.exit(0)
}

void run()

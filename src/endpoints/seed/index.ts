import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'

import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]

const globals: GlobalSlug[] = ['header', 'footer']

const categories = ['Technology', 'News', 'Finance', 'Design', 'Software', 'Engineering']

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        // The header is a simple nav list; the footer has its own richer shape.
        data: (global === 'footer'
          ? { columns: [], promiseItems: [], socialItems: [], legalLinks: [] }
          : { navItems: [] }) as never,
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo-author@example.com',
      },
    },
  })

  payload.logger.info(`— Seeding media...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post1.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post2.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-post3.webp',
    ),
    fetchFileByURL(
      'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/3.x/templates/website/src/endpoints/seed/image-hero1.webp',
    ),
  ])

  const [demoAuthor, image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo Author',
        email: 'demo-author@example.com',
        password: 'password',
      },
    }),
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),
    categories.map((category) =>
      payload.create({
        collection: 'categories',
        data: {
          title: category,
          slug: category,
        },
      }),
    ),
  ])

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({ heroImage: image1Doc, blockImage: image2Doc, author: demoAuthor }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({ heroImage: image2Doc, blockImage: image3Doc, author: demoAuthor }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({ heroImage: image3Doc, blockImage: image1Doc, author: demoAuthor }),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData,
  })

  payload.logger.info(`— Seeding pages...`)

  const [_, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home({ heroImage: imageHomeDoc, metaImage: image2Doc }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm: contactForm }),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        columns: [
          {
            title: 'Support',
            items: [
              { link: { type: 'custom', label: 'Contact Us', url: '/contact' } },
              { link: { type: 'custom', label: 'Frequently Asked Questions', url: '/faq' } },
              { link: { type: 'custom', label: 'Shipping Information', url: '/shipping' } },
              { link: { type: 'custom', label: 'Returns and Refunds', url: '/returns' } },
              { link: { type: 'custom', label: 'Track My Order', url: '/track' } },
              { link: { type: 'custom', label: 'My Account', url: '/account' } },
            ],
          },
          {
            title: 'Shop',
            items: [
              { link: { type: 'custom', label: 'HemClear® Capsules', url: '/shop/capsules' } },
              { link: { type: 'custom', label: 'HemCream®', url: '/shop/hemcream' } },
              { link: { type: 'custom', label: 'Complete Care System', url: '/shop/system' } },
              { link: { type: 'custom', label: 'Current Offers', url: '/shop/offers' } },
            ],
          },
          {
            title: 'Learn',
            items: [
              { link: { type: 'custom', label: 'How HemClear® Works', url: '/how-it-works' } },
              { link: { type: 'custom', label: 'Ingredient Research', url: '/research' } },
              { link: { type: 'custom', label: 'Hemorrhoidal Comfort Guide', url: '/guide' } },
              { link: { type: 'custom', label: 'Healthy Bowel Habits', url: '/habits' } },
              { link: { type: 'custom', label: 'Customer Stories', url: '/stories' } },
            ],
          },
        ],
        promiseTitle: 'Our Promise',
        promiseItems: [
          { icon: 'stethoscope', label: 'Doctor-Formulated' },
          { icon: 'madeInUsa', label: 'Made in the USA' },
          { icon: 'gmp', label: 'GMP-Certified Manufacturing' },
          { icon: 'packageBox', label: 'Discreet Packaging' },
          { icon: 'guarantee', label: '90-Day Money-Back Guarantee' },
        ],
        socialTitle: 'Social Links',
        socialItems: [
          { platform: 'facebook', label: 'Facebook', url: '#' },
          { platform: 'instagram', label: 'Instagram', url: '#' },
          { platform: 'youtube', label: 'Youtube', url: '#' },
          { platform: 'tiktok', label: 'Tik Tok', url: '#' },
        ],
        tagline: 'Targeted Internal & External\nSupport for Everyday Comfort',
        copyright: '©2026 HemClear®. All rights reserved.',
        legalLinks: [
          { link: { type: 'custom', label: 'Terms and Conditions', url: '/terms' } },
          { link: { type: 'custom', label: 'Privacy Policy', url: '/privacy-policy' } },
          { link: { type: 'custom', label: 'Return Policy', url: '/returns' } },
          { link: { type: 'custom', label: 'Accessibility', url: '/accessibility' } },
          { link: { type: 'custom', label: 'Supplement Disclaimer', url: '/disclaimer' } },
        ],
        disclaimer:
          'These statements have not been evaluated by the Food and Drug Administration. HemClear® is not intended to diagnose, treat, cure, or prevent any disease.\n\nInformation provided on this website is for educational purposes and is not a substitute for advice, diagnosis, or treatment from a qualified healthcare professional.\n\nResearch discussed on this website relates to individual ingredients or ingredient combinations. The finished HemClear® and HemCream® products have not been shown to produce identical outcomes.\n\nConsult a healthcare professional before using a dietary supplement, particularly if you are pregnant or nursing, take prescription medication, have a medical condition, or are scheduled for a medical procedure. Rectal bleeding can have causes other than hemorrhoids. Seek medical care for persistent or substantial bleeding, severe pain, abdominal pain, fever, dizziness, black stools, or symptoms that do not improve.',
      },
    }),
  ])

  payload.logger.info('Seeded database successfully!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, {
    credentials: 'include',
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }

  const data = await res.arrayBuffer()

  return {
    name: url.split('/').pop() || `file-${Date.now()}`,
    data: Buffer.from(data),
    mimetype: `image/${url.split('.').pop()}`,
    size: data.byteLength,
  }
}

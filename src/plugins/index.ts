import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { Page } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | HemClear®` : 'HemClear®'
}

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  // Serverless filesystems are read-only, so uploads must go to object storage in
  // production. Supabase Storage speaks the S3 API, so this is the standard S3
  // adapter pointed at a Supabase endpoint — the same config works for R2 or AWS.
  //
  // `enabled` is driven by env: with no bucket configured the adapter stands down
  // and Payload writes to public/media, which is what we want locally. It stays in
  // the plugin list either way so the collection schema is identical everywhere.
  s3Storage({
    alwaysInsertFields: true,
    bucket: process.env.S3_BUCKET || '',
    collections: { media: true },
    config: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
      endpoint: process.env.S3_ENDPOINT,
      // Supabase (and R2/MinIO) address buckets by path, not by subdomain.
      forcePathStyle: true,
      region: process.env.S3_REGION || 'us-east-1',
    },
    enabled: Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID),
  }),
  redirectsPlugin({
    collections: ['pages'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
]

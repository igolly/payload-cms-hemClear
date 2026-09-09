import { mongooseAdapter } from '@payloadcms/db-mongodb'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { createPuckPlugin } from '@delmaredigital/payload-puck/plugin'
import { editorPreviewUrl } from '@/puck/editorPreviewUrl'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeLogin: ['@/components/BeforeLogin'],
      // Listens for click-to-edit messages posted by the live-preview iframe.
      providers: [
        '@/components/VisualEditorTarget#VisualEditorTarget',
        // Supplies the Puck component config to the visual editor view.
        '@/components/PuckProvider#PuckProvider',
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  collections: [Pages, Media, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    createPuckPlugin({
      pagesCollection: 'pages',
      // The Pages collection declares its own Puck fields, so the plugin must not append
      // its opinionated extras (isHomepage, conversion tracking) on top of them.
      autoGenerateCollection: false,
      // Built by `pnpm build:puck-css` from the frontend's globals.css, so the editor
      // iframe is styled identically in development and production.
      editorStylesheets: ['/puck-editor-styles.css'],
      // Also the point where a block-authored page is handed to the editor with its
      // existing sections — see the file for why it lives here.
      previewUrl: editorPreviewUrl,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})

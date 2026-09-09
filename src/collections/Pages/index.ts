import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { FormBlock } from '../../blocks/Form/config'
import { Causes } from '../../blocks/Causes/config'
import { Comparison } from '../../blocks/Comparison/config'
import { ClosingCta } from '../../blocks/ClosingCta/config'
import { BenefitsCarousel } from '../../blocks/BenefitsCarousel/config'
import { FormulaTable } from '../../blocks/FormulaTable/config'
import { PricingOffer } from '../../blocks/PricingOffer/config'
import { SavingsCompare } from '../../blocks/SavingsCompare/config'
import { ScienceStats } from '../../blocks/ScienceStats/config'
import { BannerHero } from '../../blocks/BannerHero/config'
import { IngredientExplorer } from '../../blocks/IngredientExplorer/config'
import { FeatureStrip } from '../../blocks/FeatureStrip/config'
import { FAQ } from '../../blocks/FAQ/config'
import { MedicalReview } from '../../blocks/MedicalReview/config'
import { Guarantee } from '../../blocks/Guarantee/config'
import { ProductDetail } from '../../blocks/ProductDetail/config'
import { ProductSystem } from '../../blocks/ProductSystem/config'
import { Pairing } from '../../blocks/Pairing/config'
import { StatsBar } from '../../blocks/StatsBar/config'
import { SupportTabs } from '../../blocks/SupportTabs/config'
import { TotalCare } from '../../blocks/TotalCare/config'
import { WhyDays } from '../../blocks/WhyDays/config'
import { VideoStories } from '../../blocks/VideoStories/config'
import { WaysGrid } from '../../blocks/WaysGrid/config'
import { Reviews } from '../../blocks/Reviews/config'
import { hero } from '@/heros/config'
import { puckEditorVersion } from '@/fields/puckEditorVersion'
import { puckData } from '@/fields/puckData'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { puckSeed } from './endpoints/puckSeed'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                ProductDetail,
                FormBlock,
                Reviews,
                FAQ,
                StatsBar,
                Causes,
                ProductSystem,
                VideoStories,
                WaysGrid,
                ClosingCta,
                Guarantee,
                WhyDays,
                Comparison,
                SupportTabs,
                Pairing,
                TotalCare,
                MedicalReview,
                FeatureStrip,
                BannerHero,
                IngredientExplorer,
                BenefitsCarousel,
                FormulaTable,
                PricingOffer,
                SavingsCompare,
                ScienceStats,
              ],
              // Not required: a page built in the visual editor stores its sections in
              // `puckData` instead. Existing pages keep their blocks either way.
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
    // Visual editor. `puckData` holds the Puck document, `editorVersion` decides which
    // renderer a page uses, and `puckEdit` is the "Visual Editor" button in the sidebar.
    puckData,
    puckEditorVersion,
    {
      // Declared here rather than via the plugin's `generatePuckEditField`, which always
      // stamps a default `editorPathPattern` of `/pages/{id}/edit` — that sends the button
      // back to this same view instead of the editor. With no pattern set, the button
      // falls through to `/admin/puck-editor/pages/:id`.
      name: 'puckEdit',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@delmaredigital/payload-puck/admin/client#EditWithPuckButton',
        },
        custom: {
          collectionSlug: 'pages',
          label: 'Visual Editor',
        },
      },
    },
  ],
  // Lets the visual editor open a block-authored page with its existing content.
  endpoints: [puckSeed],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}

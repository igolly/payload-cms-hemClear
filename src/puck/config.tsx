/**
 * Puck editor configuration.
 *
 * Every section available in the Payload block editor is also available here, generated
 * from the very same `src/blocks/<Name>/config.ts` definitions and rendered by the very
 * same `Component.tsx`. Adding a block the way `WORKFLOW.md` describes therefore adds it
 * to Puck too — there is no parallel component library to maintain.
 */
import type { Config, ComponentConfig } from '@puckeditor/core'
import type { Block } from 'payload'
import React from 'react'

import { fullBleed } from '@/blocks/RenderBlocks'

import { convertFields, defaultsFor } from './fields'

// Block configs (field definitions). `Form/config.ts` is deliberately absent: it imports
// the Lexical editor at runtime, which must not reach the browser bundle. Its three fields
// are declared inline below instead.
import { BannerHero } from '@/blocks/BannerHero/config'
import { BenefitsCarousel } from '@/blocks/BenefitsCarousel/config'
import { Causes } from '@/blocks/Causes/config'
import { ClosingCta } from '@/blocks/ClosingCta/config'
import { Comparison } from '@/blocks/Comparison/config'
import { FAQ } from '@/blocks/FAQ/config'
import { FeatureStrip } from '@/blocks/FeatureStrip/config'
import { FormulaTable } from '@/blocks/FormulaTable/config'
import { Guarantee } from '@/blocks/Guarantee/config'
import { IngredientExplorer } from '@/blocks/IngredientExplorer/config'
import { MedicalReview } from '@/blocks/MedicalReview/config'
import { Pairing } from '@/blocks/Pairing/config'
import { PricingOffer } from '@/blocks/PricingOffer/config'
import { ProductDetail } from '@/blocks/ProductDetail/config'
import { ProductSystem } from '@/blocks/ProductSystem/config'
import { Reviews } from '@/blocks/Reviews/config'
import { SavingsCompare } from '@/blocks/SavingsCompare/config'
import { ScienceStats } from '@/blocks/ScienceStats/config'
import { StatsBar } from '@/blocks/StatsBar/config'
import { SupportTabs } from '@/blocks/SupportTabs/config'
import { TotalCare } from '@/blocks/TotalCare/config'
import { VideoStories } from '@/blocks/VideoStories/config'
import { WaysGrid } from '@/blocks/WaysGrid/config'
import { WhyDays } from '@/blocks/WhyDays/config'

// Renderers — the same components `RenderBlocks` uses for legacy pages.
import { BannerHeroBlock } from '@/blocks/BannerHero/Component'
import { BenefitsCarouselBlock } from '@/blocks/BenefitsCarousel/Component'
import { CausesBlock } from '@/blocks/Causes/Component'
import { ClosingCtaBlock } from '@/blocks/ClosingCta/Component'
import { ComparisonBlock } from '@/blocks/Comparison/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { FeatureStripBlock } from '@/blocks/FeatureStrip/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { FormulaTableBlock } from '@/blocks/FormulaTable/Component'
import { GuaranteeBlock } from '@/blocks/Guarantee/Component'
import { IngredientExplorerBlock } from '@/blocks/IngredientExplorer/Component'
import { MedicalReviewBlock } from '@/blocks/MedicalReview/Component'
import { PairingBlock } from '@/blocks/Pairing/Component'
import { PricingOfferBlock } from '@/blocks/PricingOffer/Component'
import { ProductDetailBlockComponent } from '@/blocks/ProductDetail/Component'
import { ProductSystemBlock } from '@/blocks/ProductSystem/Component'
import { ReviewsBlock } from '@/blocks/Reviews/Component'
import { SavingsCompareBlock } from '@/blocks/SavingsCompare/Component'
import { ScienceStatsBlock } from '@/blocks/ScienceStats/Component'
import { StatsBarBlock } from '@/blocks/StatsBar/Component'
import { SupportTabsBlock } from '@/blocks/SupportTabs/Component'
import { TotalCareBlock } from '@/blocks/TotalCare/Component'
import { VideoStoriesBlock } from '@/blocks/VideoStories/Component'
import { WaysGridBlock } from '@/blocks/WaysGrid/Component'
import { WhyDaysBlock } from '@/blocks/WhyDays/Component'

// Each block component is typed by its own generated props; the registry below holds
// them uniformly, so the props type is erased at the boundary and restored by Puck.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>

/** Every block that can be generated straight from its Payload config. */
const generatedBlocks: [Block, AnyComponent][] = [
  [BannerHero, BannerHeroBlock as AnyComponent],
  [BenefitsCarousel, BenefitsCarouselBlock as AnyComponent],
  [Causes, CausesBlock as AnyComponent],
  [ClosingCta, ClosingCtaBlock as AnyComponent],
  [Comparison, ComparisonBlock as AnyComponent],
  [FAQ, FAQBlock as AnyComponent],
  [FeatureStrip, FeatureStripBlock as AnyComponent],
  [FormulaTable, FormulaTableBlock as AnyComponent],
  [Guarantee, GuaranteeBlock as AnyComponent],
  [IngredientExplorer, IngredientExplorerBlock as AnyComponent],
  [MedicalReview, MedicalReviewBlock as AnyComponent],
  [Pairing, PairingBlock as AnyComponent],
  [PricingOffer, PricingOfferBlock as AnyComponent],
  [ProductDetail, ProductDetailBlockComponent as AnyComponent],
  [ProductSystem, ProductSystemBlock as AnyComponent],
  [Reviews, ReviewsBlock as AnyComponent],
  [SavingsCompare, SavingsCompareBlock as AnyComponent],
  [ScienceStats, ScienceStatsBlock as AnyComponent],
  [StatsBar, StatsBarBlock as AnyComponent],
  [SupportTabs, SupportTabsBlock as AnyComponent],
  [TotalCare, TotalCareBlock as AnyComponent],
  [VideoStories, VideoStoriesBlock as AnyComponent],
  [WaysGrid, WaysGridBlock as AnyComponent],
  [WhyDays, WhyDaysBlock as AnyComponent],
]

const blockLabel = (block: Block): string => {
  const singular = block.labels?.singular
  if (typeof singular === 'string') return singular
  return block.slug
}

/**
 * `blockType` is what the site's components branch on and what a page carries once it is
 * exported back to Payload blocks, so it is injected rather than stored per instance.
 */
const toComponentConfig = (block: Block, Component: AnyComponent): ComponentConfig => ({
  label: blockLabel(block),
  fields: convertFields(block.fields),
  defaultProps: defaultsFor(block.fields) as never,
  render: ({ puck: _puck, id: _id, ...props }: Record<string, unknown> & { puck?: unknown; id?: unknown }) => (
    // Same wrapper rule `RenderBlocks` applies, so a section keeps its spacing whichever
    // editor the page was built in.
    <div className={fullBleed.has(block.slug) ? undefined : 'my-16'}>
      <Component {...props} blockType={block.slug} disableInnerContainer />
    </div>
  ),
})

const components: Record<string, ComponentConfig> = Object.fromEntries(
  generatedBlocks.map(([block, Component]) => [block.slug, toComponentConfig(block, Component)]),
)

// Form block, declared by hand so the Lexical editor package stays out of the browser bundle.
components.formBlock = {
  label: 'Form Block',
  fields: {
    form: {
      type: 'external',
      label: 'Form',
      placeholder: 'Select a form',
      showSearch: true,
      fetchList: async ({ query }) => {
        const params = new URLSearchParams({ limit: '50', depth: '0' })
        if (query) params.set('where[title][like]', query)
        try {
          const res = await fetch(`/api/forms?${params}`)
          if (!res.ok) return []
          const json = await res.json()
          return json.docs ?? []
        } catch {
          return []
        }
      },
      mapRow: (row) => ({ Title: row.title ?? String(row.id) }),
      getItemSummary: (item) => (item as { title?: string })?.title ?? 'Form',
    },
    enableIntro: {
      type: 'radio',
      label: 'Enable Intro Content',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
    },
    introContent: { type: 'richtext', label: 'Intro Content' },
  },
  defaultProps: { enableIntro: false } as never,
  render: ({ puck: _puck, id: _id, ...props }: Record<string, unknown> & { puck?: unknown; id?: unknown }) => {
    const Form = FormBlock as AnyComponent
    return (
      <div className="my-16">
        <Form {...props} blockType="formBlock" />
      </div>
    )
  },
}

/** Grouping for the editor's component list. Mirrors how the sections are talked about. */
export const puckConfig: Config = {
  components,
  categories: {
    hero: { title: 'Hero & Banners', components: ['bannerHero', 'featureStrip', 'statsBar'] },
    product: {
      title: 'Product & Science',
      components: [
        'productDetail',
        'productSystem',
        'ingredientExplorer',
        'formulaTable',
        'scienceStats',
        'comparison',
        'totalCare',
        'pairing',
        'whyDays',
      ],
    },
    proof: {
      title: 'Proof & Trust',
      components: ['reviews', 'videoStories', 'medicalReview', 'guarantee', 'causes', 'waysGrid'],
    },
    conversion: {
      title: 'Conversion',
      components: ['pricingOffer', 'savingsCompare', 'closingCta', 'formBlock'],
    },
    support: { title: 'Support & FAQ', components: ['faq', 'supportTabs', 'benefitsCarousel'] },
  },
}

export default puckConfig

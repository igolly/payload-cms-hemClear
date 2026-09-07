import React, { Fragment } from 'react'

import type { Page, Product } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { BannerHeroBlock } from '@/blocks/BannerHero/Component'
import { BenefitsCarouselBlock } from '@/blocks/BenefitsCarousel/Component'
import { CausesBlock } from '@/blocks/Causes/Component'
import { ClosingCtaBlock } from '@/blocks/ClosingCta/Component'
import { ComparisonBlock } from '@/blocks/Comparison/Component'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { FeatureStripBlock } from '@/blocks/FeatureStrip/Component'
import { FormulaTableBlock } from '@/blocks/FormulaTable/Component'
import { GuaranteeBlock } from '@/blocks/Guarantee/Component'
import { IngredientExplorerBlock } from '@/blocks/IngredientExplorer/Component'
import { ProductSystemBlock } from '@/blocks/ProductSystem/Component'
import { MedicalReviewBlock } from '@/blocks/MedicalReview/Component'
import { PairingBlock } from '@/blocks/Pairing/Component'
import { PricingOfferBlock } from '@/blocks/PricingOffer/Component'
import { SavingsCompareBlock } from '@/blocks/SavingsCompare/Component'
import { ScienceStatsBlock } from '@/blocks/ScienceStats/Component'
import { StatsBarBlock } from '@/blocks/StatsBar/Component'
import { SupportTabsBlock } from '@/blocks/SupportTabs/Component'
import { TotalCareBlock } from '@/blocks/TotalCare/Component'
import { VideoStoriesBlock } from '@/blocks/VideoStories/Component'
import { WaysGridBlock } from '@/blocks/WaysGrid/Component'
import { WhyDaysBlock } from '@/blocks/WhyDays/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { ReviewsBlock } from '@/blocks/Reviews/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  bannerHero: BannerHeroBlock,
  benefitsCarousel: BenefitsCarouselBlock,
  causes: CausesBlock,
  closingCta: ClosingCtaBlock,
  comparison: ComparisonBlock,
  faq: FAQBlock,
  featureStrip: FeatureStripBlock,
  formulaTable: FormulaTableBlock,
  guarantee: GuaranteeBlock,
  ingredientExplorer: IngredientExplorerBlock,
  productSystem: ProductSystemBlock,
  medicalReview: MedicalReviewBlock,
  pairing: PairingBlock,
  pricingOffer: PricingOfferBlock,
  savingsCompare: SavingsCompareBlock,
  scienceStats: ScienceStatsBlock,
  statsBar: StatsBarBlock,
  supportTabs: SupportTabsBlock,
  totalCare: TotalCareBlock,
  videoStories: VideoStoriesBlock,
  waysGrid: WaysGridBlock,
  whyDays: WhyDaysBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  reviews: ReviewsBlock,
}

/**
 * Blocks that paint edge-to-edge and own their vertical rhythm. The template's original
 * blocks sit in a centred container and rely on the `my-16` wrapper for spacing; these
 * would render a stripe of page background between every section if wrapped the same way.
 */
const fullBleed = new Set([
  'bannerHero',
  'benefitsCarousel',
  'causes',
  'closingCta',
  'comparison',
  'featureStrip',
  'guarantee',
  'ingredientExplorer',
  'formulaTable',
  'medicalReview',
  'pairing',
  'pricingOffer',
  'savingsCompare',
  'scienceStats',
  'supportTabs',
  'totalCare',
  'whyDays',
  'faq',
  'productSystem',
  'reviews',
  'statsBar',
  'videoStories',
  'waysGrid',
])

export const RenderBlocks: React.FC<{
  // Pages and Products share this renderer, so accept either collection's layout.
  blocks: (NonNullable<Product['layout']>[0] | Page['layout'][0])[]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div
                  className={fullBleed.has(blockType) ? undefined : 'my-16'}
                  data-payload-path={`layout.${index}`}
                  key={index}
                >
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}

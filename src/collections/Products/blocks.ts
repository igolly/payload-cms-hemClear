import type { Block } from 'payload'

import { BenefitsCarousel } from '../../blocks/BenefitsCarousel/config'
import { FormulaTable } from '../../blocks/FormulaTable/config'
import { PricingOffer } from '../../blocks/PricingOffer/config'
import { SavingsCompare } from '../../blocks/SavingsCompare/config'
import { ScienceStats } from '../../blocks/ScienceStats/config'
import { BannerHero } from '../../blocks/BannerHero/config'
import { Causes } from '../../blocks/Causes/config'
import { ClosingCta } from '../../blocks/ClosingCta/config'
import { Comparison } from '../../blocks/Comparison/config'
import { FAQ } from '../../blocks/FAQ/config'
import { FeatureStrip } from '../../blocks/FeatureStrip/config'
import { IngredientExplorer } from '../../blocks/IngredientExplorer/config'
import { Guarantee } from '../../blocks/Guarantee/config'
import { MedicalReview } from '../../blocks/MedicalReview/config'
import { Pairing } from '../../blocks/Pairing/config'
import { ProductSystem } from '../../blocks/ProductSystem/config'
import { Reviews } from '../../blocks/Reviews/config'
import { StatsBar } from '../../blocks/StatsBar/config'
import { SupportTabs } from '../../blocks/SupportTabs/config'
import { TotalCare } from '../../blocks/TotalCare/config'
import { WaysGrid } from '../../blocks/WaysGrid/config'
import { WhyDays } from '../../blocks/WhyDays/config'

/** Blocks available below the product detail. */
export const productBlocks: Block[] = [
  MedicalReview,
  Reviews,
  FAQ,
  Comparison,
  Guarantee,
  WhyDays,
  SupportTabs,
  Pairing,
  TotalCare,
  ProductSystem,
  Causes,
  WaysGrid,
  StatsBar,
  ClosingCta,
  FeatureStrip,
  BannerHero,
  IngredientExplorer,
  BenefitsCarousel,
  FormulaTable,
  PricingOffer,
  SavingsCompare,
  ScienceStats,
]

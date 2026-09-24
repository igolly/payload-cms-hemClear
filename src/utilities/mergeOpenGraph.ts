import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

/**
 * What a page falls back to when it sets no open-graph fields of its own — which is what a
 * link to it shows when someone shares it. The image is still the one the starter template
 * shipped; it wants replacing with a 1200×630 HemClear graphic.
 */
const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'HemClear® pairs a 13-ingredient oral supplement with targeted external care to support comfort from the inside and out.',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: 'HemClear®',
  title: 'HemClear®',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

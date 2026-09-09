import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // The product detail moved from its own `products` collection to a block on an
  // ordinary page, so the old PDP URLs now live at the root alongside every other page.
  const productRedirect = {
    destination: '/:slug',
    permanent: true,
    source: '/products/:slug',
  }

  return [internetExplorerRedirect, productRedirect]
}

import type { GlobalConfig } from 'payload'

import { footerFields } from './fields'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: footerFields,
  hooks: {
    afterChange: [revalidateFooter],
  },
}

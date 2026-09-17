import type { GlobalConfig } from 'payload'

import { headerFields } from './fields'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: headerFields,
  hooks: {
    afterChange: [revalidateHeader],
  },
}

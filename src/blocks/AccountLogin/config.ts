import type { Block } from 'payload'

export const AccountLogin: Block = {
  slug: 'accountLogin',
  interfaceName: 'AccountLoginBlock',
  labels: { singular: 'Account Login', plural: 'Account Logins' },
  fields: [
    {
      type: 'collapsible',
      label: 'Heading',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Welcome!' },
        {
          name: 'subheading',
          type: 'text',
          defaultValue: 'Access your account and manage your orders',
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Form',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'emailLabel',
              type: 'text',
              defaultValue: 'Email',
              admin: { width: '50%' },
            },
            {
              name: 'emailPlaceholder',
              type: 'text',
              defaultValue: 'Your email',
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'buttonLabel',
          type: 'text',
          defaultValue: 'Get login code (sends SMS and email)',
        },
        {
          name: 'unavailableMessage',
          type: 'textarea',
          defaultValue:
            'Account login is coming soon. For help with an order in the meantime, please contact our support team.',
          admin: {
            description:
              'Shown when the button is pressed while login is not yet connected to an account provider.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Help',
      fields: [
        {
          name: 'helpText',
          type: 'text',
          defaultValue: 'Having trouble getting your login code?',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'alternateLabel',
              type: 'text',
              label: 'Alternative login label',
              defaultValue: 'Log in with Shopify instead',
              admin: { width: '50%' },
            },
            {
              // Its own optional field rather than the shared `link` group, which insists
              // on a URL: until a provider exists there is nothing for this to point at.
              name: 'alternateUrl',
              type: 'text',
              label: 'Alternative login URL',
              admin: {
                description: 'The link is hidden until this is filled in.',
                width: '50%',
              },
            },
          ],
        },
      ],
    },
  ],
}

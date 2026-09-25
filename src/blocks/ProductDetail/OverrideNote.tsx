import React from 'react'

/**
 * Explains, inside the variant row itself, that everything in this panel is optional.
 * Without it an editor opening "Content for this variant" meets a second copy of the whole
 * product and has no way to tell that leaving a field empty keeps the shared one.
 */
export const OverrideNote: React.FC = () => (
  <p
    style={{
      background: 'var(--theme-elevation-50)',
      borderRadius: '4px',
      color: 'var(--theme-elevation-600)',
      fontSize: '0.8rem',
      lineHeight: 1.5,
      margin: '0 0 1rem',
      padding: '0.75rem 1rem',
    }}
  >
    Every field here is optional. Leave one empty and this variant shows the product&rsquo;s own
    value; fill it in and choosing this variant shows yours instead.
  </p>
)

import React from 'react'

/**
 * Inline brand icon set, shared by the CMS blocks.
 *
 * Kept as hand-rolled SVG rather than an icon library so editors pick from a fixed,
 * on-brand list via a `select` field instead of pasting markup. To add one: draw it here,
 * add the key to `brandIconOptions`, and it becomes available in every block that uses
 * `iconField`.
 */

const base = {
  'aria-hidden': true,
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  strokeWidth: 1.6,
  viewBox: '0 0 24 24',
}

export const brandIcons = {
  pregnancy: (
    <svg {...base}>
      <circle cx="11" cy="4.5" r="2" />
      <path d="M11 7c-2 0-3 1.4-3 3.2 0 2.6 2.2 3.3 3.6 3.6" />
      <path d="M11.6 13.8c2.4.3 3.9 1.6 3.9 3.3 0 1.8-1.7 2.9-3.9 2.9" />
      <path d="M9 14.5 7.5 21" />
    </svg>
  ),
  toilet: (
    <svg {...base}>
      <path d="M8 3h4v5H8z" />
      <path d="M5 10h13a5 5 0 0 1-5 5H9.5A4.5 4.5 0 0 1 5 10.5V10Z" />
      <path d="M9 15v6h5v-6" />
    </svg>
  ),
  sitting: (
    <svg {...base}>
      <circle cx="9" cy="4.5" r="1.8" />
      <path d="M7.5 8h3l1.5 5h3.5" />
      <path d="M7.5 8 6 13.5h4" />
      <path d="M6 13.5V21" />
      <path d="M18 12v9" />
    </svg>
  ),
  lifting: (
    <svg {...base}>
      <circle cx="12" cy="4" r="1.8" />
      <path d="M12 6.5v5" />
      <path d="M8 11.5h8" />
      <path d="M6.5 9.5v4M17.5 9.5v4" />
      <path d="m10 12-1.5 9M14 12l1.5 9" />
    </svg>
  ),
  fiber: (
    <svg {...base}>
      <path d="M12 21V9" />
      <path d="M12 12c0-3 1.8-5.5 4.5-6.5C16.5 9 14.7 11.5 12 12Z" />
      <path d="M12 15c0-3-1.8-5.5-4.5-6.5C7.5 12 9.3 14.5 12 15Z" />
      <path d="M12 9c0-2.5 1-4.5 2.5-6" />
    </svg>
  ),
  tissueChange: (
    <svg {...base}>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 4v4h-4" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  ),
  flask: (
    <svg {...base}>
      <path d="M9.5 3h5" />
      <path d="M10.5 3v6L5.8 17.4A2 2 0 0 0 7.5 20.5h9a2 2 0 0 0 1.7-3.1L13.5 9V3" />
      <path d="M8 15h8" />
    </svg>
  ),
  supportSystem: (
    <svg {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.4 2.4 4.6-4.8" />
    </svg>
  ),
  stethoscope: (
    <svg {...base}>
      <path d="M6 3v5a4 4 0 0 0 8 0V3" />
      <path d="M6 3H4.5M14 3h1.5" />
      <path d="M10 12v2.5a4.5 4.5 0 0 0 9 0V13" />
      <circle cx="19" cy="11" r="2" />
    </svg>
  ),
  research: (
    <svg {...base}>
      <path d="M8 4H6.5A1.5 1.5 0 0 0 5 5.5v14A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-14A1.5 1.5 0 0 0 17.5 4H16" />
      <rect height="3.5" rx="1" width="8" x="8" y="2.5" />
      <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" />
    </svg>
  ),
  madeInUsa: (
    <svg {...base}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.5 13.5-1 7 4.5-2.5 4.5 2.5-1-7" />
      <path d="m10.2 9 1.2 1.2 2.4-2.5" />
    </svg>
  ),
  guarantee: (
    <svg {...base}>
      <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4.5" />
    </svg>
  ),
  clipboardCheck: (
    <svg {...base}>
      <path d="M9 4H7.5A1.5 1.5 0 0 0 6 5.5v14A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5v-14A1.5 1.5 0 0 0 16.5 4H15" />
      <rect height="3.5" rx="1" width="6" x="9" y="2.5" />
      <path d="m9 12.5 1.8 1.8 3.7-4" />
    </svg>
  ),
  clock: (
    <svg {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.4 2" />
    </svg>
  ),
  documentSearch: (
    <svg {...base}>
      <path d="M13.5 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V8Z" />
      <path d="M13.5 3v5h5" />
      <circle cx="11" cy="13.5" r="2.6" />
      <path d="m13 15.5 2 2" />
    </svg>
  ),
  packageLock: (
    <svg {...base}>
      <path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5Z" />
      <path d="M4 7.5 12 11l8-3.5M12 11v9" />
      <rect height="4" rx=".8" width="5.5" x="9.25" y="11.5" />
      <path d="M10.7 11.5v-1a1.3 1.3 0 0 1 2.6 0v1" />
    </svg>
  ),
  gmp: (
    <svg {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 10.2a2.5 2.5 0 1 0 .3 3.3" />
      <path d="M12.2 14.5V10l1.4 2.2L15 10v4.5" />
    </svg>
  ),
  packageBox: (
    <svg {...base}>
      <path d="M4 7.5 12 4l8 3.5v9L12 20l-8-3.5Z" />
      <path d="M4 7.5 12 11l8-3.5M12 11v9" />
    </svg>
  ),
  truck: (
    <svg {...base}>
      <path d="M2.5 6.5h10v9h-10z" />
      <path d="M12.5 9.5h4l3 3v3h-7z" />
      <circle cx="6" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
    </svg>
  ),
  calendar: (
    <svg {...base}>
      <rect height="16" rx="2" width="17" x="3.5" y="4.5" />
      <path d="M3.5 9.5h17M8 2.5v4M16 2.5v4" />
      <path d="M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2" />
    </svg>
  ),
  refund: (
    <svg {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5a2.6 2.6 0 0 0-2.5-1.6c-1.4 0-2.4.8-2.4 1.9 0 2.6 5 1.4 5 4.1 0 1.2-1.1 2-2.6 2a2.7 2.7 0 0 1-2.6-1.7" />
      <path d="M12 6.2v1.7M12 16v1.8" />
    </svg>
  ),
  rotate: (
    <svg {...base}>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20.5 3.5V8h-4.5" />
    </svg>
  ),
  badgeAward: (
    <svg {...base}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.5 13.5-1 7 4.5-2.5 4.5 2.5-1-7" />
      <path d="m10.3 9 1.2 1.2 2.3-2.5" />
    </svg>
  ),
  leaf: (
    <svg {...base}>
      <path d="M5 19c0-7 4.5-12 14-12 0 8-4.5 12-11 12H5Z" />
      <path d="M5 19c2-4.5 5-7 9-8.5" />
    </svg>
  ),
  droplet: (
    <svg {...base}>
      <path d="M12 3.5c3.2 3.6 5.5 6.4 5.5 9.2a5.5 5.5 0 0 1-11 0c0-2.8 2.3-5.6 5.5-9.2Z" />
    </svg>
  ),
  shieldCheck: (
    <svg {...base}>
      <path d="M12 2.8 4.8 5.7v6.1c0 4.4 3 8 7.2 9.4 4.2-1.4 7.2-5 7.2-9.4V5.7Z" />
      <path d="m9 12 2.1 2.1L15.3 9.6" />
    </svg>
  ),
  snowflake: (
    <svg {...base}>
      <path d="M12 2.5v19M3.75 7.25l16.5 9.5M20.25 7.25l-16.5 9.5" />
      <path d="M12 6.2 9.8 4M12 6.2 14.2 4M12 17.8 9.8 20M12 17.8l2.2 2.2" />
      <path d="m6.6 9.2-3-.5M6.6 9.2l.6-3M17.4 14.8l3 .5M17.4 14.8l-.6 3" />
      <path d="m6.6 14.8-3 .5M6.6 14.8l.6 3M17.4 9.2l3-.5M17.4 9.2l-.6-3" />
    </svg>
  ),
  info: (
    <svg {...base} strokeWidth={1.4}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  ),
} as const

export type BrandIconName = keyof typeof brandIcons

/** Options for a Payload `select` field — keep labels human, values stable. */
export const brandIconOptions: { label: string; value: BrandIconName }[] = [
  { label: 'Pregnancy', value: 'pregnancy' },
  { label: 'Toilet / Constipation', value: 'toilet' },
  { label: 'Sitting', value: 'sitting' },
  { label: 'Heavy Lifting', value: 'lifting' },
  { label: 'Fiber / Wheat', value: 'fiber' },
  { label: 'Tissue Change', value: 'tissueChange' },
  { label: 'Flask', value: 'flask' },
  { label: 'Support System', value: 'supportSystem' },
  { label: 'Stethoscope', value: 'stethoscope' },
  { label: 'Research', value: 'research' },
  { label: 'Made in USA', value: 'madeInUsa' },
  { label: 'Guarantee', value: 'guarantee' },
  { label: 'Clipboard Check', value: 'clipboardCheck' },
  { label: 'Clock', value: 'clock' },
  { label: 'Document Search', value: 'documentSearch' },
  { label: 'Package (locked)', value: 'packageLock' },
  { label: 'GMP', value: 'gmp' },
  { label: 'Package', value: 'packageBox' },
  { label: 'Truck / Shipping', value: 'truck' },
  { label: 'Calendar', value: 'calendar' },
  { label: 'Refund', value: 'refund' },
  { label: 'Cancel / Rotate', value: 'rotate' },
  { label: 'Award Badge', value: 'badgeAward' },
  { label: 'Leaf', value: 'leaf' },
  { label: 'Droplet', value: 'droplet' },
  { label: 'Shield Check', value: 'shieldCheck' },
  { label: 'Snowflake', value: 'snowflake' },
  { label: 'Info', value: 'info' },
]

export const BrandIcon: React.FC<{ className?: string; name?: string | null }> = ({
  className,
  name,
}) => {
  const icon = name && name in brandIcons ? brandIcons[name as BrandIconName] : null
  if (!icon) return null
  return <span className={className}>{icon}</span>
}

/* ------------------------------------------------------------------ */
/*  Social platform marks (filled, brand-shaped)                       */
/* ------------------------------------------------------------------ */

export const socialIcons = {
  facebook: (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  ),
  instagram: (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.26.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.26.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.98c-3.15 0-3.52.01-4.76.07-1.15.05-1.77.24-2.19.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.42-.35 1.04-.4 2.19-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.15.24 1.77.4 2.19.22.55.47.94.88 1.35.41.41.8.66 1.35.88.42.16 1.04.35 2.19.4 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.15-.05 1.77-.24 2.19-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.42.35-1.04.4-2.19.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.15-.24-1.77-.4-2.19a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.42-.16-1.04-.35-2.19-.4-1.24-.06-1.61-.07-4.76-.07Zm0 3.37a5.49 5.49 0 1 1 0 10.98 5.49 5.49 0 0 1 0-10.98Zm0 9.05a3.56 3.56 0 1 0 0-7.12 3.56 3.56 0 0 0 0 7.12Zm6.99-9.27a1.28 1.28 0 1 1-2.56 0 1.28 1.28 0 0 1 2.56 0Z" />
    </svg>
  ),
  youtube: (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.5 6.9a3 3 0 0 0-2.1-2.1C19.5 4.3 12 4.3 12 4.3s-7.5 0-9.4.5A3 3 0 0 0 .5 6.9C0 8.8 0 12 0 12s0 3.2.5 5.1a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.1.5-5.1s0-3.2-.5-5.1ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </svg>
  ),
  tiktok: (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06v-3.1a5.65 5.65 0 0 0-.77-.05 5.66 5.66 0 1 0 5.66 5.66V9.42a7.35 7.35 0 0 0 4.28 1.38V7.7a4.28 4.28 0 0 1-3.2-1.88Z" />
    </svg>
  ),
} as const

export type SocialIconName = keyof typeof socialIcons

export const socialIconOptions: { label: string; value: SocialIconName }[] = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'TikTok', value: 'tiktok' },
]

export const SocialIcon: React.FC<{ className?: string; name?: string | null }> = ({
  className,
  name,
}) => {
  const icon = name && name in socialIcons ? socialIcons[name as SocialIconName] : null
  if (!icon) return null
  return <span className={className}>{icon}</span>
}

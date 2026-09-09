import type { Field } from 'payload'

/**
 * Section background presets.
 *
 * The block stores the *key*, not the hex, so re-tuning a shade here restyles every
 * section using it. Keep this list short — it is the site's band palette, drawn from the
 * backgrounds the sections already ship with.
 */
export const backgroundColors = {
  white: { label: 'White', hex: '#ffffff' },
  offWhite: { label: 'Off White', hex: '#f5f5f5' },
  paleBlue: { label: 'Pale Blue', hex: '#f4f8ff' },
  lightBlue: { label: 'Light Blue', hex: '#e0ecfc' },
  skyBlue: { label: 'Sky Blue', hex: '#cfe0f7' },
  brand: { label: 'Brand Blue', hex: '#0023a3' },
  navy: { label: 'Navy', hex: '#192f7c' },
  deepNavy: { label: 'Deep Navy', hex: '#0d2050' },
} as const

export type BackgroundColorKey = keyof typeof backgroundColors

export const backgroundOptions = [
  ...Object.entries(backgroundColors).map(([value, { label }]) => ({ label, value })),
  { label: 'Custom…', value: 'custom' },
]

/** Accepts `#abc`, `#aabbcc`, `#aabbccdd`, or a plain CSS colour keyword / function. */
const looksLikeColor = (value: string) =>
  /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value) ||
  /^(rgb|hsl|oklch|color)a?\(/i.test(value) ||
  /^[a-z]+$/i.test(value)

/**
 * Adds the "Section Background" control to a block.
 *
 * Append it to the end of a block's `fields`. Leaving the select empty keeps whatever
 * background the section was designed with, so adding this to a block never changes how
 * existing pages look.
 */
export const backgroundField = (): Field => ({
  type: 'collapsible',
  label: 'Section Background',
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'bgColor',
          type: 'select',
          label: 'Background colour',
          options: backgroundOptions,
          admin: {
            description: "Leave empty to keep this section's designed default.",
            width: '50%',
          },
        },
        {
          name: 'bgColorCustom',
          type: 'text',
          label: 'Custom colour',
          admin: {
            condition: (_, siblingData) => siblingData?.bgColor === 'custom',
            description: 'Any CSS colour, e.g. #0d2050.',
            placeholder: '#0d2050',
            width: '50%',
          },
          validate: (value: string | null | undefined, { siblingData }: { siblingData?: any }) => {
            if (siblingData?.bgColor !== 'custom') return true
            const trimmed = value?.trim()
            if (!trimmed) return 'Enter a colour, or pick a preset instead.'
            return looksLikeColor(trimmed) || 'Use a hex value such as #0d2050.'
          },
        },
      ],
    },
  ],
})

/**
 * Resolves the stored value to an inline style for a section's root element.
 *
 * Returns `undefined` when nothing is set, so the section's own `bg-*` class stays in
 * charge; when a value *is* set the inline style outranks that class.
 */
export const backgroundStyle = (
  bgColor?: string | null,
  bgColorCustom?: string | null,
): { backgroundColor: string } | undefined => {
  if (!bgColor) return undefined

  if (bgColor === 'custom') {
    const custom = bgColorCustom?.trim()
    return custom ? { backgroundColor: custom } : undefined
  }

  const preset = backgroundColors[bgColor as BackgroundColorKey]
  return preset ? { backgroundColor: preset.hex } : undefined
}

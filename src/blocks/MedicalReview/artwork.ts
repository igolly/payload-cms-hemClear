/**
 * The medical-review strip's own glyphs — the three 58px circular icons exported from the
 * Figma section (6037:80) into `public/icons/medical-review/`.
 *
 * Chosen per highlight through an optional `artwork` select beside the older shared `icon`
 * field: set, the Figma glyph is drawn; unset, the row falls back to the `BrandIcon` it has
 * always used, so documents saved before this field existed render as they did.
 */
export const medicalReviewArtwork = {
  doctorFormulated: {
    label: 'Doctor formulated',
    src: '/icons/medical-review/doctor-formulated.svg',
  },
  recommended: {
    label: 'Recommended by professionals',
    src: '/icons/medical-review/recommended.svg',
  },
  research: { label: 'Research backed', src: '/icons/medical-review/research.svg' },
} as const

export type MedicalReviewArtwork = keyof typeof medicalReviewArtwork

export const medicalReviewArtworkOptions = (
  Object.keys(medicalReviewArtwork) as MedicalReviewArtwork[]
).map((value) => ({ label: medicalReviewArtwork[value].label, value }))

export const medicalReviewArtworkSrc = (value?: null | string): null | string =>
  value && value in medicalReviewArtwork
    ? medicalReviewArtwork[value as MedicalReviewArtwork].src
    : null

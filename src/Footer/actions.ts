'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export type SubscribeResult = { status: 'error' | 'invalid' | 'subscribed' }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** The form-builder form the footer's sign-ups are filed under, made on first use. */
const FORM_TITLE = 'Newsletter Sign-up'

const newsletterForm = async () => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'forms',
    depth: 0,
    limit: 1,
    where: { title: { equals: FORM_TITLE } },
  })
  if (docs[0]) return { form: docs[0], payload }

  const form = await payload.create({
    collection: 'forms',
    data: {
      confirmationType: 'message',
      // Required by the plugin; the footer shows its own success line instead.
      confirmationMessage: {
        root: {
          children: [
            {
              children: [{ text: "You're in!", type: 'text', version: 1 }],
              type: 'paragraph',
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      },
      fields: [{ blockType: 'email', label: 'Email', name: 'email', required: true }],
      submitButtonLabel: 'Join now',
      title: FORM_TITLE,
    },
  })
  return { form, payload }
}

/**
 * Files the footer's email address as a form submission, where the team can see and export
 * it from the admin. An address already on the list counts as a success, so a reader who
 * signs up twice is not told something went wrong.
 */
export async function subscribe(email: string): Promise<SubscribeResult> {
  const address = typeof email === 'string' ? email.trim().toLowerCase() : ''
  if (address.length > 254 || !EMAIL.test(address)) return { status: 'invalid' }

  try {
    const { form, payload } = await newsletterForm()

    const existing = await payload.find({
      collection: 'form-submissions',
      depth: 0,
      limit: 1,
      where: {
        and: [{ form: { equals: form.id } }, { 'submissionData.value': { equals: address } }],
      },
    })
    if (existing.totalDocs > 0) return { status: 'subscribed' }

    await payload.create({
      collection: 'form-submissions',
      data: { form: form.id, submissionData: [{ field: 'email', value: address }] },
    })
    return { status: 'subscribed' }
  } catch (error) {
    console.error('Newsletter sign-up failed', error)
    return { status: 'error' }
  }
}

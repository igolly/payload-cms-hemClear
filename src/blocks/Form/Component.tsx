'use client'
import type { FormFieldBlock, Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import type { Media as MediaType } from '@/payload-types'

import { ImageSlot } from '@/blocks/FAQ/ImagePlaceholder'
import { cn } from '@/utilities/ui'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'
import { marks } from '@/utilities/marks'

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  heading?: null | string
  image?: MediaType | null | number | string
  imagePosition?: 'left' | 'right' | null
  introContent?: DefaultTypedEditorState
  variant?: 'default' | 'split' | null
}

/*
 * Split layout: the form's own fields are shared with every other form on the site, so
 * this restyles them from the outside rather than forking the field components. The
 * selectors key off element types and `div:has(> label)` — the wrapper each field already
 * renders — so they hold whatever a field is built from.
 *
 * Each control becomes a tall pill with its label as a caption inside the top of it and the
 * required mark pushed to the right of that caption, which is the reference layout.
 */
const SPLIT_FIELDS = [
  // Tighter rhythm between fields than the default layout uses. The two wrappers are the
  // ones this component renders around each field, a few lines below.
  '[&_form>div>div]:mb-3',
  // The field wrapper, so the caption can be positioned against it.
  '[&_div:has(>label)]:relative',
  // Caption: small, uppercase, and spanning the pill so the required mark sits right.
  '[&_label]:pointer-events-none [&_label]:absolute [&_label]:inset-x-6 [&_label]:top-[11px]',
  '[&_label]:z-10 [&_label]:flex [&_label]:items-center [&_label]:justify-between',
  '[&_label]:font-inter [&_label]:text-[11px] [&_label]:font-semibold [&_label]:uppercase',
  '[&_label]:tracking-[0.08em] [&_label]:text-navy-900',
  // Controls: room at the top for that caption.
  '[&_input]:h-[62px] [&_input]:rounded-[14px] [&_input]:border [&_input]:border-navy/25',
  '[&_input]:bg-white [&_input]:px-6 [&_input]:pb-2 [&_input]:pt-7 [&_input]:text-base',
  '[&_input]:text-navy-900 [&_input]:shadow-none',
  '[&_textarea]:min-h-[140px] [&_textarea]:rounded-[14px] [&_textarea]:border',
  '[&_textarea]:border-navy/25 [&_textarea]:bg-white [&_textarea]:px-6 [&_textarea]:pb-3',
  '[&_textarea]:pt-7 [&_textarea]:text-base [&_textarea]:text-navy-900',
  // The select trigger is a button, and its own label sits above it rather than inside.
  '[&_[role=combobox]]:h-[62px] [&_[role=combobox]]:rounded-[14px]',
  '[&_[role=combobox]]:border-navy/25 [&_[role=combobox]]:bg-white [&_[role=combobox]]:px-6',
  '[&_[role=combobox]]:pt-7 [&_[role=combobox]]:text-base [&_[role=combobox]]:text-navy-900',
  // Submit: full width, as the reference sets it.
  '[&_button[type=submit]]:mt-1 [&_button[type=submit]]:h-[52px] [&_button[type=submit]]:w-full',
  '[&_button[type=submit]]:rounded-[14px] [&_button[type=submit]]:bg-brand',
  '[&_button[type=submit]]:text-sm [&_button[type=submit]]:font-bold',
  '[&_button[type=submit]]:uppercase [&_button[type=submit]]:tracking-[0.08em]',
  '[&_button[type=submit]]:hover:bg-brand-dark',
].join(' ')

export const FormBlock: React.FC<
  {
    id?: string
  } & FormBlockType
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    heading,
    image,
    imagePosition,
    introContent,
    variant,
  } = props
  const split = variant === 'split'

  const formMethods = useForm({
    defaultValues: formFromProps.fields,
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: FormFieldBlock[]) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect

            const redirectUrl = url

            if (redirectUrl) router.push(redirectUrl)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  const body = (
    <FormProvider {...formMethods}>
      {!isLoading && hasSubmitted && confirmationType === 'message' && (
        <RichText data={confirmationMessage} />
      )}
      {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
      {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
      {!hasSubmitted && (
        <form id={formID} onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 last:mb-0">
            {formFromProps &&
              formFromProps.fields &&
              formFromProps.fields?.map((field, index) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Field: React.FC<any> = fields?.[field.blockType as keyof typeof fields]
                if (Field) {
                  return (
                    <div className="mb-6 last:mb-0" key={index}>
                      <Field
                        form={formFromProps}
                        {...field}
                        {...formMethods}
                        control={control}
                        errors={errors}
                        register={register}
                      />
                    </div>
                  )
                }
                return null
              })}
          </div>

          <Button form={formID} type="submit" variant="default">
            {marks(submitButtonLabel)}
          </Button>
        </form>
      )}
    </FormProvider>
  )

  if (split) {
    return (
      <section className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Photo half. Full-bleed to the screen edge, as the reference has it. */}
          <div
            className={cn(
              'relative min-h-[380px] lg:min-h-[760px]',
              imagePosition === 'right' && 'lg:order-2',
            )}
          >
            <ImageSlot
              className="h-full w-full"
              hint="Upload in the CMS"
              imgClassName="h-full w-full object-cover"
              label="Contact photo"
              priority
              resource={image}
            />
          </div>

          {/* Form half. The tint pools in the corner nearest the photo and clears to white
              across the panel, so the two halves meet on colour rather than on an edge. */}
          <div
            className={cn(
              'flex items-center justify-center px-6 py-16 lg:px-16',
              imagePosition === 'right'
                ? 'bg-[radial-gradient(120%_90%_at_100%_0%,var(--color-tint-50)_0%,#fff_62%)] lg:order-1'
                : 'bg-[radial-gradient(120%_90%_at_0%_0%,var(--color-tint-50)_0%,#fff_62%)]',
            )}
          >
            <div className={cn('w-full max-w-[590px]', SPLIT_FIELDS)}>
              {heading && (
                <h1
                  className="mb-8 font-marcellus text-[32px] leading-tight text-navy-900 sm:text-[40px]"
                  data-payload-subpath="heading"
                >
                  {marks(heading)}
                </h1>
              )}
              {enableIntro && introContent && !hasSubmitted && (
                <RichText className="mb-6" data={introContent} enableGutter={false} />
              )}
              {body}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="container lg:max-w-[48rem]">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="p-4 lg:p-6 border border-border rounded-[0.8rem]">{body}</div>
    </div>
  )
}

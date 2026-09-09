import {
  DefaultNodeTypes,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import React from 'react'

import { cn } from '@/utilities/ui'
import { marksInHtml, marksInNode } from '@/utilities/marks'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { relationTo, value } = linkNode.fields.doc!

  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }

  // Pages live at the root; every other collection is namespaced by its slug.
  return relationTo === 'pages' ? `/${value.slug}` : `/${relationTo}/${value.slug}`
}

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
})

type Props = {
  /**
   * Lexical editor state, as written by the Payload admin, or rich text from the Puck
   * visual editor. Puck hands a component either the raw HTML string it stores or an
   * already-rendered React element, depending on where in its pipeline the value is read,
   * so all three shapes reach the same blocks and all three are rendered here.
   */
  data: DefaultTypedEditorState | string | React.ReactNode
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const richTextClassName = (
  className: string | undefined,
  enableGutter: boolean,
  enableProse: boolean,
) =>
  cn(
    'payload-richtext',
    {
      container: enableGutter,
      'max-w-none': !enableGutter,
      'mx-auto prose md:prose-md dark:prose-invert': enableProse,
    },
    className,
  )

export default function RichText(props: Props) {
  const { className, data, enableProse = true, enableGutter = true, ...rest } = props

  // Puck stores rich text as HTML. It is authored by the same authenticated editors that
  // author Lexical content, so it is rendered with the same trust and the same styling.
  if (typeof data === 'string') {
    return (
      <div
        className={richTextClassName(className, enableGutter, enableProse)}
        dangerouslySetInnerHTML={{ __html: marksInHtml(data) }}
        {...rest}
      />
    )
  }

  // Puck's renderer resolves a richtext prop to an element before the component sees it.
  if (React.isValidElement(data)) {
    return (
      <div className={richTextClassName(className, enableGutter, enableProse)} {...rest}>
        {marksInNode(data)}
      </div>
    )
  }

  return (
    <ConvertRichText
      className={richTextClassName(className, enableGutter, enableProse)}
      converters={jsxConverters}
      data={data as DefaultTypedEditorState}
      {...rest}
    />
  )
}

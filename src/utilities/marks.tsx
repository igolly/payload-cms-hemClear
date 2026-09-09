import React from 'react'

/**
 * Raises the registered and trademark symbols in CMS copy.
 *
 * Editors type "HemClear®" as plain text — the symbol is part of the string, not separate
 * markup — so the only place it can be lifted into a `<sup>` is at render. These helpers
 * do that for any block that prints a text field.
 *
 * Tailwind's Preflight already gives `sup` the standard treatment (75% size, `top: -0.5em`,
 * zero line-height so it does not open up the line), so no extra styling is needed here.
 */

/** Splits on the symbols while keeping them, so they can be wrapped individually. */
const SPLIT_ON_MARKS = /([®™])/g

const isMark = (part: string) => part === '®' || part === '™'

/**
 * A text field, with any ® or ™ raised.
 *
 * Deliberately total: anything that is not a string — a number, an element, null — is
 * handed straight back. Blocks print a mix of these, so accepting them all means every
 * text slot can be wrapped without first proving what type it holds.
 *
 * A string with nothing to raise is returned untouched, which keeps the common case free
 * of a pointless array of one.
 */
export const marks = (value: React.ReactNode): React.ReactNode => {
  if (typeof value !== 'string') return value
  if (!value.includes('®') && !value.includes('™')) return value

  return value
    .split(SPLIT_ON_MARKS)
    .map((part, i) => (isMark(part) ? <sup key={i}>{part}</sup> : part))
}

/**
 * A text field whose newlines are meaningful — the `textarea` fields blocks use to control
 * where a heading wraps — with the symbols raised too.
 *
 * Several blocks declared this line-splitting locally; they now share this one so a heading
 * and a paragraph treat the symbols the same way.
 */
export const multiline = (value: string): React.ReactNode =>
  value.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br />}
      {marks(line)}
    </React.Fragment>
  ))

/**
 * The same treatment for a rich-text HTML string.
 *
 * `RichText` hands Lexical content to the DOM as HTML, so the symbols inside it never pass
 * through `marks`. This raises them in the markup instead, stepping over tags so a `®`
 * that happens to sit inside an attribute — a `title`, an `alt`, a URL — is left alone.
 */
export const marksInHtml = (html: string): string =>
  html
    .split(/(<[^>]*>)/)
    .map((part) => (part.startsWith('<') ? part : part.replace(/([®™])/g, '<sup>$1</sup>')))
    .join('')

/**
 * The same treatment for content that arrives as an already-built React element.
 *
 * Puck resolves its rich-text prop to elements before a component sees it, so neither
 * `marks` nor `marksInHtml` gets a look at that copy. This walks the tree and raises the
 * symbols in its text nodes, leaving every element's own props — and so every attribute —
 * untouched.
 */
export const marksInNode = (node: React.ReactNode): React.ReactNode => {
  if (typeof node === 'string') return marks(node)

  if (Array.isArray(node)) {
    return node.map((child, i) => <React.Fragment key={i}>{marksInNode(child)}</React.Fragment>)
  }

  if (React.isValidElement(node)) {
    const { children } = node.props as { children?: React.ReactNode }
    if (children === undefined) return node
    return React.cloneElement(node, undefined, marksInNode(children))
  }

  return node
}

'use client'

/**
 * Explains, on the Content tab, that a page's blocks are no longer what the site renders.
 *
 * A page with Puck content renders *only* from `puckData` — `HybridPageRenderer` ignores
 * the `layout` blocks entirely. Without this notice an editor can rewrite a heading here,
 * save, and see nothing change on the site, with nothing on screen explaining why.
 *
 * The blocks are deliberately left visible and editable: they are the page's original
 * content and the thing it falls back to if the Puck canvas is emptied.
 */
import React from 'react'
import { useDocumentInfo, useFormFields } from '@payloadcms/ui'

export const PuckLayoutNotice: React.FC = () => {
  const editorVersion = useFormFields(([fields]) => fields?.editorVersion?.value)
  const { id } = useDocumentInfo()

  if (editorVersion !== 'puck') return null

  return (
    <div
      style={{
        background: '#fff8e6',
        border: '1px solid #e8c96b',
        borderRadius: 4,
        marginBottom: '1.5rem',
        padding: '1rem 1.25rem',
      }}
    >
      <strong style={{ display: 'block', marginBottom: '.35rem' }}>
        This page is rendered by the Visual Editor.
      </strong>
      <p style={{ margin: '0 0 .75rem', lineHeight: 1.5 }}>
        The sections below are kept as a backup and are <strong>not</strong> what visitors
        see. Edits made here will not appear on the site — make them in the Visual Editor
        instead.
      </p>
      {id && (
        <a href={`/admin/puck-editor/pages/${id}`} style={{ fontWeight: 600 }}>
          Open the Visual Editor →
        </a>
      )}
    </div>
  )
}

export default PuckLayoutNotice

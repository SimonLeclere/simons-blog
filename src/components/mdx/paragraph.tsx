import React, { type ComponentPropsWithoutRef } from 'react'

const BLOCK_TAGS = new Set(['div', 'figure', 'table', 'pre', 'blockquote', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

export default function Paragraph(props: ComponentPropsWithoutRef<'p'>) {
  const children = React.Children.toArray(props.children)

  const hasBlockChild = children.some((child: any) => {
    if (!child?.type) return false
    if (typeof child.type === 'string' && BLOCK_TAGS.has(child.type)) return true
    if (typeof child.type === 'function' || typeof child.type === 'object') return true
    return false
  })

  return hasBlockChild
    ? <div className="leading-relaxed mb-4 last:mb-0" {...props} />
    : <p className="leading-relaxed mb-4 last:mb-0" {...props} />
}

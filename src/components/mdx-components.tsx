import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Callout from './mdx/callout'
import Bookmark from './mdx/bookmark'
import Columns from './mdx/columns'
import Pre from './mdx/pre'

/** Convert <Figure src="..." caption="..." /> to ![caption](src) */
export const stripFigure = (s: string) =>
  s.replaceAll(/<Figure\s+[^>]*?src="([^"]*)"[^>]*?caption="([^"]*)"[^>]*?\/?\s*>/g, '![$2]($1)')
   .replaceAll(/<Figure\s+[^>]*?src="([^"]*)"[^>]*?\/?\s*>/g, '![]($1)')

const Figure = ({ src, caption, alt, className, width = "100%", align = "center" }: any) => (
  <figure className={["my-8 pt-1", align === 'left' ? 'mr-auto' : align === 'right' ? 'ml-auto' : 'mx-auto', className].filter(Boolean).join(' ')} style={{ width }}>
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800">
      <Image src={src} alt={alt || caption || ''} width={1200} height={630} className="w-full h-auto object-cover" loading="lazy" />
    </div>
    {caption && <figcaption className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400 italic">{caption}</figcaption>}
  </figure>
)

const Table = (props: any) => (
  <div className="my-0 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
    <table className="w-full text-left text-sm border-collapse m-0 border-hidden" {...props} />
  </div>
)

const Code = (props: any) => {
  if (props['data-language'] || props.className?.includes('language-')) return <code {...props} />
  return <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] text-blue-600 dark:bg-zinc-800 dark:text-blue-400" {...props} />
}

const CustomImage = (props: any) => props.title ? <Figure src={props.src} caption={props.title} alt={props.alt} /> : <div className="my-0 overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-800"><Image src={props.src} alt={props.alt || ''} width={1200} height={630} className="w-full h-auto" loading="lazy" /></div>

const P = (props: any) => {
  const children = React.Children.toArray(props.children)
  const blockTags = ['div', 'figure', 'table', 'pre', 'blockquote', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
  const blockComponents = [CustomImage, Figure, Pre, Table, Callout, Bookmark, Columns]

  const hasBlockChild = children.some((child: any) => {
    if (!child?.type) return false
    if (typeof child.type === 'string' && blockTags.includes(child.type)) return true
    if (blockComponents.includes(child.type)) return true
    return false
  })

  return hasBlockChild ? (
    <div className="leading-relaxed mb-4 last:mb-0" {...props} />
  ) : (
    <p className="leading-relaxed mb-4 last:mb-0" {...props} />
  )
}

export const components = {
  p: P,
  pre: Pre,
  code: Code,
  img: CustomImage,
  Figure,
  table: Table,
  thead: (props: any) => <thead className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900" {...props} />,
  th: (props: any) => <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100" {...props} />,
  td: (props: any) => <td className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800/50 last:border-0" {...props} />,
  Callout,
  Bookmark,
  Columns,
  a: ({ href, children, ...props }: any) => {
    const isInternal = href?.startsWith('/') || href?.startsWith('#')
    return isInternal ? <Link href={href} {...props}>{children}</Link> : <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
  }
}

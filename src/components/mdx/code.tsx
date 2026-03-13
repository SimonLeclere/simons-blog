import type { ComponentPropsWithoutRef } from 'react'

export default function Code(props: ComponentPropsWithoutRef<'code'> & { 'data-language'?: string }) {
  if (props['data-language'] || props.className?.includes('language-')) return <code {...props} />
  return <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] text-blue-600 dark:bg-zinc-800 dark:text-blue-400" {...props} />
}

import NextLink from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

export default function Link({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const isInternal = href?.startsWith('/') || href?.startsWith('#')
  return isInternal
    ? <NextLink href={href!} {...props}>{children}</NextLink>
    : <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
}

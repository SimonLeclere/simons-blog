import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const acceptHeader = request.headers.get('accept') || ''

  const isMarkdownPreferred = () => {
    if (acceptHeader.includes('text/markdown')) {
      const markdownIndex = acceptHeader.indexOf('text/markdown')
      const htmlIndex = acceptHeader.indexOf('text/html')
      return htmlIndex === -1 || markdownIndex < htmlIndex
    }
    return false
  }

  // Check if the request is for the blog root
  if (pathname === '/blog' || pathname === '/blog/' || pathname === '/blog.md') {
    if (pathname.endsWith('.md') || isMarkdownPreferred()) {
      return NextResponse.rewrite(new URL('/sitemap.md', request.url))
    }
  }

  // Check if the request is for a blog post
  if (pathname.startsWith('/blog/')) {
    // If the URL ends with .md, rewrite to the /md route
    if (pathname.endsWith('.md')) {
      const slug = pathname.replace('/blog/', '').replace('.md', '')
      if (slug) {
        return NextResponse.rewrite(new URL(`/blog/md/${slug}`, request.url))
      }
    }

    // If the Accept header prefers markdown, rewrite to the /md route
    if (isMarkdownPreferred()) {
      const slug = pathname.replace('/blog/', '')
      // Don't rewrite if it's already the /md route or other sub-routes
      if (slug && !slug.includes('/')) {
        return NextResponse.rewrite(new URL(`/blog/md/${slug}`, request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/blog', '/blog/:path*'],
}

import { describe, it, expect, vi } from 'vitest'

vi.mock('next/server', () => {
  return {
    NextResponse: {
      rewrite: (url: URL) => ({ type: 'rewrite', url: url.pathname }),
      next: () => ({ type: 'next' }),
    },
  }
})

const { proxy } = await import('@/proxy')

function makeRequest(path: string, headers: Record<string, string> = {}) {
  return {
    nextUrl: { pathname: path },
    headers: new Headers(headers),
    url: 'http://localhost:3000',
  } as any
}

describe('proxy', () => {
  describe('.md URL rewrite', () => {
    it('rewrites /blog/my-post.md to /blog/md/my-post', () => {
      const result = proxy(makeRequest('/blog/my-post.md'))
      expect(result).toEqual({ type: 'rewrite', url: '/blog/md/my-post' })
    })

    it('rewrites /blog.md to sitemap', () => {
      const result = proxy(makeRequest('/blog.md'))
      expect(result).toEqual({ type: 'rewrite', url: '/sitemap.md' })
    })
  })

  describe('Accept: text/markdown content negotiation', () => {
    it('rewrites when Accept prefers text/markdown', () => {
      const result = proxy(makeRequest('/blog/my-post', { accept: 'text/markdown' }))
      expect(result).toEqual({ type: 'rewrite', url: '/blog/md/my-post' })
    })

    it('rewrites when text/markdown appears before text/html', () => {
      const result = proxy(makeRequest('/blog/my-post', { accept: 'text/markdown, text/html' }))
      expect(result).toEqual({ type: 'rewrite', url: '/blog/md/my-post' })
    })

    it('does not rewrite when text/html appears before text/markdown', () => {
      const result = proxy(makeRequest('/blog/my-post', { accept: 'text/html, text/markdown' }))
      expect(result).toEqual({ type: 'next' })
    })
  })

  describe('passthrough', () => {
    it('does not rewrite normal blog post requests', () => {
      const result = proxy(makeRequest('/blog/my-post'))
      expect(result).toEqual({ type: 'next' })
    })

    it('does not rewrite the blog listing page', () => {
      const result = proxy(makeRequest('/blog'))
      expect(result).toEqual({ type: 'next' })
    })

    it('does not rewrite sub-routes like /blog/my-post/something', () => {
      const result = proxy(makeRequest('/blog/my-post/something', { accept: 'text/markdown' }))
      expect(result).toEqual({ type: 'next' })
    })
  })
})

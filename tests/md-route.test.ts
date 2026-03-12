import { describe, it, expect, vi } from 'vitest'
import path from 'node:path'

// Point to fixtures
const fixturesDir = path.join(__dirname, 'fixtures/posts')
vi.mock('node:path', async () => {
  const actual = await vi.importActual<typeof import('node:path')>('node:path')
  const originalJoin = actual.join
  return {
    ...actual,
    default: {
      ...actual,
      join: (...args: string[]) => {
        const result = originalJoin(...args)
        if (result.endsWith('src/content/posts')) {
          return fixturesDir
        }
        if (result.includes('src/content/posts/')) {
          return result.replace(
            /.*src\/content\/posts\//,
            fixturesDir + '/'
          )
        }
        return result
      },
    },
  }
})

vi.mock('next/navigation', () => ({
  notFound: () => { throw new Error('Not found') },
}))

const { GET } = await import('@/app/blog/[slug]/md/route')

describe('/blog/[slug]/md route', () => {
  it('returns markdown content for a valid post', async () => {
    const request = new Request('http://localhost:3000/blog/hello-world/md')
    const response = await GET(request, { params: Promise.resolve({ slug: 'hello-world' }) })
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8')

    const text = await response.text()
    expect(text).toContain('# Hello World')
    expect(text).toContain('Author: Simon Leclere')
    expect(text).toContain('Published:')
  })

  it('strips MDX components from content', async () => {
    const request = new Request('http://localhost:3000/blog/hello-world/md')
    const response = await GET(request, { params: Promise.resolve({ slug: 'hello-world' }) })
    const text = await response.text()
    // Figure should be converted to markdown image
    expect(text).not.toContain('<Figure')
    expect(text).toContain('![Test figure]')
  })

  it('throws not found for invalid slugs', async () => {
    const request = new Request('http://localhost:3000/blog/nonexistent/md')
    await expect(
      GET(request, { params: Promise.resolve({ slug: 'nonexistent' }) })
    ).rejects.toThrow()
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
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

// Mock next/navigation since feed route imports from posts which doesn't need it,
// but just in case
vi.mock('next/navigation', () => ({
  notFound: () => { throw new Error('Not found') },
}))

const { GET } = await import('@/app/feed.xml/route')

describe('RSS feed', () => {
  it('returns valid XML with correct content type', async () => {
    const response = await GET()
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toBe('application/xml')
  })

  it('contains feed metadata', async () => {
    const response = await GET()
    const xml = await response.text()
    expect(xml).toContain("<title>Simon's Blog</title>")
    expect(xml).toContain('<language>fr</language>')
  })

  it('includes visible posts', async () => {
    const response = await GET()
    const xml = await response.text()
    expect(xml).toContain('Hello World')
    expect(xml).toContain('Second Post')
    expect(xml).not.toContain('Draft Post')
  })

  it('strips MDX components from post content', async () => {
    const response = await GET()
    const xml = await response.text()
    // Figure should be converted, not raw JSX
    expect(xml).not.toContain('<Figure')
    expect(xml).not.toContain('<Callout')
    expect(xml).not.toContain('<Bookmark')
  })

  it('has cache control header', async () => {
    const response = await GET()
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=1200')
  })
})

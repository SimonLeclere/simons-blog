import { describe, it, expect, vi, beforeEach } from 'vitest'
import path from 'node:path'

// Point posts.ts to our fixtures directory
const fixturesDir = path.join(__dirname, 'fixtures/posts')
vi.stubGlobal('process', {
  ...process,
  cwd: () => path.join(__dirname, 'fixtures/posts/../../..'),
})

// We need to override the postsDirectory. Since it's computed at module load
// via process.cwd(), we re-map it by mocking the resolved path.
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
        // Also rewrite individual file paths within src/content/posts
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

// Must import after mocks
const { getAllPosts, getPostBySlug } = await import('@/lib/posts')

describe('getAllPosts', () => {
  it('returns only visible (non-draft) posts', () => {
    const posts = getAllPosts()
    const slugs = posts.map(p => p.slug)
    expect(slugs).toContain('hello-world')
    expect(slugs).toContain('second-post')
    expect(slugs).not.toContain('draft-post')
  })

  it('sorts posts by date descending (newest first)', () => {
    const posts = getAllPosts()
    expect(posts[0].slug).toBe('second-post')   // 2025-03-10
    expect(posts[1].slug).toBe('hello-world')    // 2025-01-15
  })

  it('parses frontmatter correctly', () => {
    const posts = getAllPosts()
    const hello = posts.find(p => p.slug === 'hello-world')!
    expect(hello.title).toBe('Hello World')
    expect(hello.date).toBe('2025-01-15')
    expect(hello.excerpt).toBe('A first test post')
    expect(hello.icon).toBe('/icons/hello.png')
    expect(hello.author).toBe('simonleclere')
    expect(hello.authorName).toBe('Simon Leclere')
    expect(hello.draft).toBe(false)
  })

  it('computes reading time', () => {
    const posts = getAllPosts()
    const hello = posts.find(p => p.slug === 'hello-world')!
    expect(hello.readingTime).toBeGreaterThanOrEqual(1)
  })

  it('formats date in French', () => {
    const posts = getAllPosts()
    const hello = posts.find(p => p.slug === 'hello-world')!
    expect(hello.formattedDate).toContain('janvier')
    expect(hello.formattedDate).toContain('2025')
  })
})

describe('getPostBySlug', () => {
  it('returns post data with content', () => {
    const post = getPostBySlug('hello-world')
    expect(post.title).toBe('Hello World')
    expect(post.content).toContain('simple test post')
  })

  it('rejects invalid slugs', () => {
    expect(() => getPostBySlug('../etc/passwd')).toThrow('Invalid slug')
    expect(() => getPostBySlug('UPPERCASE')).toThrow('Invalid slug')
    expect(() => getPostBySlug('has spaces')).toThrow('Invalid slug')
    expect(() => getPostBySlug('')).toThrow('Invalid slug')
  })

  it('throws for non-existent slugs', () => {
    expect(() => getPostBySlug('does-not-exist')).toThrow()
  })

  it('throws for draft posts', () => {
    expect(() => getPostBySlug('draft-post')).toThrow('not available')
  })
})

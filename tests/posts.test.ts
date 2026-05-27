import { describe, it, expect, vi } from 'vitest'
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
    expect(slugs).toContain('with-headings')
    expect(slugs).not.toContain('draft-post')
  })

  it('sorts posts by date descending (newest first)', () => {
    const posts = getAllPosts()
    expect(posts[0].slug).toBe('second-post')   // 2025-03-10
    expect(posts[1].slug).toBe('hello-world')    // 2025-01-15
    expect(posts[2].slug).toBe('with-headings') // 2024-12-01
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

describe('heading extraction', () => {
  it('returns headings collected from h1/h2/h3, ignoring deeper levels', () => {
    const post = getPostBySlug('with-headings')
    // Source has 2 h2 + 2 h3 + 1 h4. h4 is dropped (primary=h2, secondary=h3).
    expect(post.headings).toHaveLength(4)
  })

  it('normalizes levels: lowest depth → 1, next → 2', () => {
    const post = getPostBySlug('with-headings')
    const levels = post.headings.map((h) => h.level)
    expect(levels).toEqual([1, 2, 1, 2])
  })

  it('produces slugs that match rehype-slug output', () => {
    const post = getPostBySlug('with-headings')
    const ids = post.headings.map((h) => h.id)
    expect(ids).toEqual([
      'premier-titre',
      'sous-titre',
      'deuxième-titre',
      'code-dans-un-titre',
    ])
  })

  it('extracts inline code text inside headings', () => {
    const post = getPostBySlug('with-headings')
    const codeHeading = post.headings.find((h) => h.id === 'code-dans-un-titre')!
    expect(codeHeading.text).toBe('code() dans un titre')
  })

  it('returns an empty array when a post has no h1/h2/h3', () => {
    const post = getPostBySlug('second-post')
    expect(post.headings).toEqual([])
  })
})

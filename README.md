# Simon's Blog

A minimal blog using Next.js 16 and MDX.

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm test
```

## Features

- MDX posts with frontmatter — no CMS required
- Custom components: Callout, Bookmark, Figure, Columns, etc.
- Code blocks with syntax highlighting, copy button, highlighted lines, ...
- Post icons via Lucide, Simple Icons, image, or emoji
- Author card fetched from GitHub
- RSS feed at `/feed.xml`
- Posts served as raw Markdown at `/blog/:slug.md` or for requests with `Accept: text/markdown`
- Static generation, Vercel-ready
- Unit tests with Vitest

## Next steps

→ [How to write posts](docs/writing-posts.md)

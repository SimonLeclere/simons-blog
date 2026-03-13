# Simon's Static MDX Blog

A minimal blog using Next.js 16 and MDX. Posts live as `.mdx` files in the repo—no CMS required.

---

## Features

- Markdown/MDX posts with frontmatter
- Custom MDX components (Callout, Bookmark, Figure, Columns)
- Static generation and Vercel-friendly
- Built-in sitemap and RSS feed
- Content negotiation (HTML or Markdown based on Accept header, useful for agents)
- Post icons via Lucide, Simple Icons, images, or emoji
- Unit tests with Vitest

---

## Quick start

```bash
pnpm install
pnpm dev      # open http://localhost:3000
```

---

## Writing posts

Create `.mdx` files in `src/content/posts/` with frontmatter:

```md
---
title: "My Post"
date: "2026-02-14"
excerpt: "Short summary."
icon: "lucide:terminal"
author: "GitHubUsername"
authorName: "Display Name"
---
```

### Post icon formats

The `icon` field supports multiple formats:

| Format | Example | Description |
|---|---|---|
| Lucide | `"lucide:terminal"` | [Lucide](https://lucide.dev/icons) icon by name |
| Simple Icons | `"si:react"` | [Simple Icons](https://simpleicons.org) brand icon |
| Image path | `"/images/icon.png"` | Local image |
| URL | `"https://example.com/icon.png"` | Remote image |
| Emoji | `"🚀"` | Emoji (rendered as text) |

### MDX components

Use any component from `src/components/mdx/`:

```mdx
<Callout type="info">Important note</Callout>

<Bookmark url="https://example.com" title="Example" />

<Figure src="/images/pic.png" caption="A figure" />

<Columns count={2}>
  <div>Left</div>
  <div>Right</div>
</Columns>
```

---

## Testing

```bash
pnpm test         # run tests once
pnpm test:watch   # watch mode
```

---

## Images

Put assets in `public/images/` and reference them:

```md
![Alt](/images/pic.png)
```

External image hostnames are auto-detected from MDX posts at build time.

---

Happy writing!

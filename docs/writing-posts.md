# Writing posts

Posts are `.mdx` files in `src/content/posts/`. Create a file, add frontmatter, write content.

## Frontmatter

```yaml
---
title: "My Post"           # required — displayed as page title and in the listing
date: "2026-02-14"         # required — ISO format, used for sorting
excerpt: "Short summary."  # required — displayed in the listing and RSS feed
icon: "🚀"                 # optional — see Icon formats below
author: "GitHubUsername"   # optional — GitHub username, used to fetch avatar and bio
authorName: "Display Name" # optional — overrides the name fetched from GitHub
draft: true                # optional — hides the post everywhere (default: false, overrides devOnly)
devOnly: true              # optional — visible in dev, hidden in production (default: false)
---
```

## Icon formats

The `icon` field accepts several formats:

| Format | Example | Source |
|---|---|---|
| Lucide | `"lucide:terminal"` | [lucide.dev/icons](https://lucide.dev/icons) |
| Simple Icons | `"si:react"` | [simpleicons.org](https://simpleicons.org) |
| Local image | `"/images/icon.png"` | `public/` folder |
| Remote image | `"https://example.com/icon.png"` | Any URL |
| Emoji | `"🚀"` | Rendered as text |

## MDX components

Beyond standard Markdown, these components are available:

### Callout

```mdx
<Callout type="info">Informational note.</Callout>
<Callout type="warning">Watch out.</Callout>
<Callout type="success">All good.</Callout>
<Callout type="error">Something failed.</Callout>
```

`type` defaults to `"info"` if omitted.

### Bookmark

```mdx
<Bookmark
  url="https://example.com"
  title="Example Site"
  description="Optional description shown below the title."
/>
```

### Figure

```mdx
<Figure
  src="/images/my-post/diagram.png"
  caption="Optional caption displayed below the image."
  alt="Alt text for screen readers."
  width="80%"
  align="center"
/>
```

`width` defaults to `"100%"`. `align` accepts `"left"`, `"center"` (default), or `"right"`.

You can also use standard Markdown image syntax — if a `title` attribute is provided it becomes the caption:

```md
![Alt text](/images/my-post/diagram.png "This becomes the caption")
```

### Columns

```mdx
<Columns count={2}>
<div>

Left column content.

</div>
<div>

Right column content.

</div>
</Columns>
```

`count` accepts `1`, `2` (default), `3`, or `4`. Columns stack on mobile.

### Code blocks

Use standard fenced code blocks. You can add a `title` and highlight specific lines:

````md
```ts title="src/lib/example.ts" {3,5}
const a = 1
const b = 2
const c = a + b   // highlighted
const d = 4
const e = c + d   // highlighted
```
````

## Images

Put assets in `public/images/<post-slug>/` and reference them with an absolute path:

```md
![Alt text](/images/my-post/photo.jpg)
```

External hostnames used in posts are automatically allowed by Next.js Image at build time — no config needed.

## Serving posts as Markdown

Each post is also available as raw Markdown:

- `GET /blog/my-post.md` — direct URL
- `GET /blog/my-post` with `Accept: text/markdown` — content negotiation

Useful for LLMs and other programmatic consumers.

## Preview example

The post `exemple-de-post.mdx` (`devOnly: true`) shows every component in action. It's only visible in dev.

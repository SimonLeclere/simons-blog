import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'
import { siteURL } from '@/lib/site-url'

function stripMdxComponents(content: string): string {
  return content
    // Convert <Figure src="..." caption="..." /> to ![caption](src)
    .replace(/<Figure\s+[^>]*?src="([^"]*)"[^>]*?caption="([^"]*)"[^>]*?\/?\s*>/g, '![$2]($1)')
    .replace(/<Figure\s+[^>]*?src="([^"]*)"[^>]*?\/?\s*>/g, '![]($1)')
    // Convert <Bookmark url="..." title="..." /> to [title](url)
    .replace(/<Bookmark\s+[^>]*?url="([^"]*)"[^>]*?title="([^"]*)"[^>]*?\/?\s*>/g, '[$2]($1)')
    .replace(/<Bookmark\s+[^>]*?url="([^"]*)"[^>]*?\/?\s*>/g, '$1')
    // Convert <Callout ...>content</Callout> to > content
    .replace(/<Callout[^>]*>([\s\S]*?)<\/Callout>/g, (_m, inner: string) =>
      inner.trim().split('\n').map((l: string) => `> ${l}`).join('\n')
    )
    // Remove wrapper components like <Columns>...</Columns>
    .replace(/<\/?(Columns)[^>]*>/g, '')
    // Remove any remaining self-closing custom components
    .replace(/<[A-Z]\w+\s[^>]*\/>/g, '')
    // Remove any remaining opening/closing custom component tags
    .replace(/<\/?[A-Z]\w+[^>]*>/g, '')
    // Clean up excessive blank lines
    .replace(/\n{3,}/g, '\n\n')
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  try {
    const post = getPostBySlug(slug)

    const author = post.authorName || post.author
    const cleanContent = stripMdxComponents(post.content)

    const markdown = [
      `# ${post.title}`,
      '',
      `Published: ${post.formattedDate}`,
      author ? `Author: ${author}` : '',
      `Source: ${siteURL}/blog/${post.slug}`,
      '',
      cleanContent
    ].filter(Boolean).join('\n')

    return new Response(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
      },
    })
  } catch {
    notFound()
  }
}

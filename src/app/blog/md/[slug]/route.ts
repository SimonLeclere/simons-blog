import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'
import { siteURL } from '@/lib/site-url'
import { stripMdxComponents } from '@/lib/strip-mdx'

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

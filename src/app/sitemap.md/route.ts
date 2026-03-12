import { getAllPosts } from '@/lib/posts'
import { siteURL } from '@/lib/site-url'

export async function GET() {
  const posts = getAllPosts()

  const markdown = [
    '# Sitemap',
    '',
    '## Blog Posts',
    '',
    ...posts.map(post => {
      return [
        `### ${post.title}`,
        `- Published: ${post.formattedDate}`,
        `- HTML: ${siteURL}/blog/${post.slug}`,
        `- Markdown: ${siteURL}/blog/${post.slug}.md`,
        ''
      ].join('\n')
    })
  ].join('\n')

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}

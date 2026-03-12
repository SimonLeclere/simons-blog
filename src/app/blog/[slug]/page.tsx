import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Nav from '@/components/nav'
import CatSeparator from '@/components/cat-separator'
import { getAllPosts, getPostBySlug, mdxOptions } from '@/lib/posts'
import { components } from '@/components/mdx-components'
import type { Metadata } from 'next'

type Params = Promise<{ slug: string }>

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = getPostBySlug(slug)
    const char = post.icon || '🍺'
    const favicon = char.startsWith('http') || char.startsWith('/')
      ? char
      : `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${char}</text></svg>`
    return {
      title: post.title,
      description: post.excerpt,
      icons: { icon: favicon },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.date,
      },
      twitter: {
        card: 'summary',
        title: post.title,
        description: post.excerpt,
      },
    }
  } catch {
    return { title: 'Post not found' }
  }
}

async function fetchAuthor(authorLogin: string | null, authorName: string | null) {
  if (!authorLogin) return null
  try {
    const res = await fetch(`https://api.github.com/users/${authorLogin}`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = await res.json()
    return {
      name: authorName || data.name || data.login,
      avatar: data.avatar_url as string,
      bio: (data.bio || 'Développeur Passionné') as string,
    }
  } catch (e) {
    console.error('Author fetch failed', e)
    return null
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params

  let post
  try {
    post = getPostBySlug(slug)
  } catch {
    notFound()
  }

  const author = await fetchAuthor(post.author, post.authorName)

  return (
    <div>
      <Nav />

      <Link href="/blog" className="group mb-8 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Retour aux articles
      </Link>

      <article className="mt-8">
        <header className="mb-10 text-center">
          {post.icon && (
            <div className="mb-4 flex justify-center text-6xl">
              {post.icon.startsWith('http') || post.icon.startsWith('/')
                ? <img src={post.icon} alt="" className="w-20 h-20 object-contain" />
                : post.icon}
            </div>
          )}
          <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {post.title}
          </h1>
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={post.date}>{post.formattedDate}</time>
            <span className="flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
              {post.readingTime} min de lecture
            </span>
          </div>
        </header>

        <div className="prose prose-zinc mx-auto dark:prose-invert max-w-none 
          prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:tracking-tight 
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-pre:bg-transparent prose-pre:p-0 prose-img:my-0 prose-figure:my-0
          prose-table:m-0
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
          prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:my-2 dark:prose-a:text-blue-400">
          <MDXRemote
            source={post.content}
            components={components}
            options={{ mdxOptions: mdxOptions as any }}
          />
        </div>

        <CatSeparator className="mt-4"/>

        <div className="py-8 flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
          <Link href="/blog" className="group flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour aux articles
          </Link>

          {author && (
            <Link href={`https://github.com/${post.author}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full sm:w-auto sm:max-w-[60%] group/author">
              <div className="text-left sm:text-right min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover/author:text-blue-600 dark:group-hover/author:text-blue-400 transition-colors truncate">
                  {author.name}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{author.bio}</p>
              </div>
              <div className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 transition-transform">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          )}
        </div>
      </article>
    </div>
  )
}

import Link from 'next/link'
import Nav from '@/components/nav'
import PostIcon from '@/components/post-icon'
import { getAllPosts } from '@/lib/posts'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <div>
      <Nav />
      <div className="mt-16 space-y-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Articles</h1>
        {posts.length === 0 && <p className="text-gray-500">Aucun article pour le moment.</p>}
        <div className="grid gap-8">
          {posts.map((post) => (
            <article key={post.slug} className="group relative flex flex-col space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <Link href={`/blog/${post.slug}`} className="flex items-center gap-3">
                  <span className="absolute inset-0" />
                  {post.icon && (
                    <span className="text-2xl">
                      <PostIcon icon={post.icon} size={28} />
                    </span>
                  )}
                  <span>{post.title}</span>
                </Link>
              </h2>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 pl-2 border-l-2 border-gray-200 dark:border-zinc-700">
                <time dateTime={post.date}>{post.formattedDate}</time>
                <span className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                  {post.readingTime} min
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                Lire l&apos;article
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'
import { siteURL } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  const postEntries = posts.map((post) => ({
    url: `${siteURL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }))

  return [
    { url: siteURL, lastModified: new Date() },
    { url: `${siteURL}/blog`, lastModified: new Date() },
    { url: `${siteURL}/about`, lastModified: new Date() },
    ...postEntries,
  ]
}

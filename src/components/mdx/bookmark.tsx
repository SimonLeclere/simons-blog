import BookmarkCard from './bookmark-card'

const ENTITIES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'" }
const decodeEntities = (s: string) => s.replaceAll(/&(?:amp|lt|gt|quot|#39|apos);/g, (m) => ENTITIES[m])

async function fetchOgData(url: string) {
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'bot' },
    })
    if (!res.ok) return {}
    const html = await res.text()

    const getMetaContent = (property: string, attr = 'property') => {
      const propertyFirstMetaRegex = new RegExp(`<meta[^>]+${attr}=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i')
      const contentFirstMetaRegex = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${property}["']`, 'i')
      const match = propertyFirstMetaRegex.exec(html) || contentFirstMetaRegex.exec(html)
      return match?.[1] ? decodeEntities(match[1]) : undefined
    }

    const titleRegex = /<title[^>]*>([^<]*)<\/title>/i
    const title =
      getMetaContent('og:title') ||
      titleRegex.exec(html)?.[1]?.trim()

    const description =
      getMetaContent('og:description') ||
      getMetaContent('description', 'name')

    const image = getMetaContent('og:image')

    return {
      title: title ? decodeEntities(title) : undefined,
      description,
      image: image && !image.startsWith('http') ? new URL(image, url).href : image,
    }
  } catch {
    return {}
  }
}

interface BookmarkProps {
  url: string
  title?: string
  description?: string
  icon?: string
  image?: string
}

export default async function Bookmark({ url, title, description, icon, image }: Readonly<BookmarkProps>) {
  const og = await fetchOgData(url)

  return (
    <BookmarkCard
      url={url}
      title={title || og.title || url}
      description={description ?? og.description}
      icon={icon}
      image={image ?? og.image}
    />
  )
}

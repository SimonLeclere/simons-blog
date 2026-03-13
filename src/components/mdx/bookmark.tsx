import BookmarkCard from './bookmark-card'

const ENTITIES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'" }
const decodeEntities = (s: string) => s.replace(/&(?:amp|lt|gt|quot|#39|apos);/g, (m) => ENTITIES[m])

async function fetchOgData(url: string) {
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'bot' },
    })
    if (!res.ok) return {}
    const html = await res.text()

    const getMetaContent = (property: string, attr = 'property') => {
      const match =
        html.match(new RegExp(`<meta[^>]+${attr}=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${property}["']`, 'i'))
      return match?.[1] ? decodeEntities(match[1]) : undefined
    }

    const title =
      getMetaContent('og:title') ||
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim()

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

export default async function Bookmark({ url, title, description, icon, image }: BookmarkProps) {
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

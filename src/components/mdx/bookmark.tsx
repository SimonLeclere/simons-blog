import BookmarkCard from './bookmark-card'

async function fetchOgData(url: string) {
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'bot' },
    })
    if (!res.ok) return {}
    const html = await res.text()

    const getMetaContent = (property: string) => {
      // Handles both <meta property="og:X" content="Y"> and <meta content="Y" property="og:X">
      const match =
        html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i')) ||
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'))
      return match?.[1]
    }

    const title =
      getMetaContent('og:title') ||
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim()

    const image = getMetaContent('og:image')

    return {
      title,
      description: getMetaContent('og:description'),
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

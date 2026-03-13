'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

export default function BookmarkCard({ title, description, url, icon, image }: { title: string; description?: string; url: string; icon?: string; image?: string }) {
  const [imageError, setImageError] = useState(false)
  let hostname: string
  try { hostname = new URL(url).hostname } catch { hostname = url }
  const favicon = icon || `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="not-prose my-6 flex h-28 overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 no-underline group">
      <div className="flex flex-1 p-4 min-w-0">
        <div className="flex h-10 w-10 shrink-0 self-center items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800 mr-4">
          <img src={favicon} alt="" className="h-5 w-5 object-contain" onError={(e) => { (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🔗</text></svg>` }} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100 truncate m-0">{title}</h3>
          {description && <p className="text-xs text-gray-500 dark:text-zinc-400 line-clamp-2 leading-snug m-0 mt-1">{description}</p>}
          <div className="mt-auto pt-1 flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-zinc-500">
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">{hostname}</span>
          </div>
        </div>
      </div>
      {image && !imageError && (
        <div className="hidden sm:block w-32 md:w-44 shrink-0 border-l border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/30">
          <img src={image} alt="" className="h-full w-full object-cover" onError={() => setImageError(true)} />
        </div>
      )}
    </a>
  )
}

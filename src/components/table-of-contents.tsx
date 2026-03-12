'use client'

import { useEffect, useState, useRef } from 'react'
import { clsx } from 'clsx'

type Heading = {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll('article h2[id], article h3[id]')
    )
    const items = elements.map((el) => ({
      id: el.id,
      text: el.textContent || '',
      level: el.tagName === 'H2' ? 2 : 3,
    }))
    setHeadings(items)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    elements.forEach((el) => observerRef.current?.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  if (headings.length < 2) return null

  return (
    <nav
      className="hidden xl:block fixed left-[calc(50%+26rem)] top-32 w-56"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Table des matières"
    >
      <ul className="relative space-y-0.5">
        {headings.map((h) => {
          const isActive = activeId === h.id
          return (
            <li key={h.id} className="relative">
              {/* Thin bar indicator */}
              <div
                className={clsx(
                  'absolute left-0 top-0 bottom-0 w-[2px] rounded-full transition-colors duration-200',
                  isActive
                    ? 'bg-gray-900 dark:bg-gray-100'
                    : 'bg-gray-200 dark:bg-zinc-800'
                )}
              />
              <a
                href={`#${h.id}`}
                className={clsx(
                  'block truncate transition-all duration-200',
                  h.level === 3 ? 'pl-5' : 'pl-3',
                  isHovered ? 'py-1 text-xs' : 'py-0.5 text-[0px] leading-[0]',
                  isActive
                    ? 'text-gray-900 dark:text-gray-100 font-medium'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

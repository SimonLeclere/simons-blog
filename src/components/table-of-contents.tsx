'use client'

import { useEffect, useRef, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: 1 | 2
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [displayActiveIdx, setDisplayActiveIdx] = useState(-1)
  const [navWidth, setNavWidth] = useState(192)
  const targetIdxRef = useRef(-1)
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map())

  // Detect headings on mount
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('article h1[id], article h2[id], article h3[id]')
    )

    if (elements.length === 0) return

    const levels = [...new Set(elements.map((el) => Number.parseInt(el.tagName[1])))].sort(
      (a, b) => a - b
    )
    const primary = levels[0]
    const secondary = levels[1]

    const parsed: Heading[] = elements
      .filter((el) => {
        const level = Number.parseInt(el.tagName[1])
        return level === primary || level === secondary
      })
      .map((el) => ({
        id: el.id,
        text: el.textContent || '',
        level: Number.parseInt(el.tagName[1]) === primary ? 1 : 2,
      }))

    setHeadings(parsed)
  }, [])

  // Compute ideal nav width: fit content or cap at 192px (w-48)
  useEffect(() => {
    if (headings.length === 0) return
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.font = '500 10px system-ui, -apple-system, sans-serif'
    let maxWidth = 0
    for (const heading of headings) {
      const indent = heading.level === 2 ? 12 : 0
      const w = ctx.measureText(heading.text).width + indent
      maxWidth = Math.max(maxWidth, w)
    }

    const needed = Math.ceil(maxWidth) + 32 // 28px bar space + 4px buffer
    setNavWidth(Math.min(needed, 192))
  }, [headings])

  // Scroll handler — sets the target index immediately
  useEffect(() => {
    if (headings.length === 0) return

    const handleScroll = () => {
      let current = 0
      for (let i = 0; i < headings.length; i++) {
        const el = document.getElementById(headings[i].id)
        if (el && el.getBoundingClientRect().top <= 100) {
          current = i
        }
      }
      // If scrolled to bottom, activate the last heading
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 10) {
        current = headings.length - 1
      }
      if (current >= 0) targetIdxRef.current = current
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  // Animation stepper — walks displayActiveIdx toward targetIdx one step at a time
  useEffect(() => {
    if (headings.length === 0) return

    const interval = setInterval(() => {
      setDisplayActiveIdx((prev) => {
        const target = targetIdxRef.current
        if (target === -1) return prev
        if (prev === -1) return target
        if (prev === target) return prev
        return prev < target ? prev + 1 : prev - 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [headings])

  // Auto-scroll TOC to keep active item visible
  const activeHeadingId = displayActiveIdx >= 0 ? headings[displayActiveIdx]?.id : ''
  useEffect(() => {
    if (!activeHeadingId) return
    const li = itemRefs.current.get(activeHeadingId)
    if (li) {
      li.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [activeHeadingId])

  if (headings.length < 3) return null

  return (
    <div className="fixed right-0 top-0 h-screen hidden xl:block group/toc z-40 pointer-events-none">
      {/* Invisible hover strip along right edge */}
      <div className="absolute right-0 top-0 h-full w-48 pointer-events-auto" />

      <nav
        aria-label="Table des matières"
        className="absolute right-3 top-1/2 -translate-y-1/2
          pointer-events-none group-hover/toc:pointer-events-auto
          max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-none"
        style={{ width: `${navWidth}px` }}
      >
        <ul className="flex flex-col gap-0.5">
          {headings.map((heading, index) => {
            const isActive = displayActiveIdx === index
            const delay = `${index * 30}ms`

            return (
              <li
                key={heading.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(heading.id, el)
                  else itemRefs.current.delete(heading.id)
                }}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="relative block h-3 pr-7"
                >
                  {/* Text — absolute, no layout impact, truncated */}
                  <span
                    className={`
                      absolute left-0 top-0 right-7 truncate
                      text-[10px] leading-3 text-left
                      transition-opacity duration-300
                      opacity-0 group-hover/toc:opacity-100
                      ${heading.level === 2 ? 'pl-3' : ''}
                      ${isActive
                        ? 'text-gray-900 dark:text-gray-100 font-medium'
                        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}
                    `}
                    style={{ transitionDelay: delay }}
                  >
                    {heading.text}
                  </span>
                  {/* Bar — absolute right, vertically centered */}
                  <span
                    className={`
                      absolute right-0 top-1/2 -translate-y-1/2
                      h-0.5 rounded-full
                      group-hover/toc:w-0 group-hover/toc:opacity-0
                      ${heading.level === 1 ? 'w-5' : 'w-3'}
                      ${isActive
                        ? 'bg-gray-800 dark:bg-gray-200'
                        : 'bg-gray-300 dark:bg-zinc-700'}
                    `}
                    style={{
                      transition: `background-color 200ms, width 300ms ${delay}, opacity 300ms ${delay}`,
                    }}
                  />
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

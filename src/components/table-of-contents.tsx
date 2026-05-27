'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Heading } from '@/lib/posts'

type TableOfContentsProps = {
  headings: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [displayActiveIdx, setDisplayActiveIdx] = useState(-1)
  const targetIdxRef = useRef(-1)
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map())

  // Estimate ideal nav width from heading text (system-ui 10px 500 → ~5.5px/char).
  // Server- and client-safe (no DOM read), capped at the w-48 = 192px nav width.
  const navWidth = useMemo(() => {
    const maxChars = Math.max(
      0,
      ...headings.map((h) => h.text.length + (h.level === 2 ? 3 : 0))
    )
    const estimated = Math.ceil(maxChars * 5.5) + 32
    return Math.min(estimated, 192)
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
            const finalWidth = heading.level === 1 ? '1.25rem' : '0.75rem'

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
                    style={
                      {
                        // CSS var consumed by the @keyframes toc-bar-in (global.css)
                        '--toc-bar-w': finalWidth,
                        animation: `toc-bar-in 400ms ease-out calc(150ms + ${index} * 40ms) backwards`,
                        transition: `background-color 200ms, width 300ms ${delay}, opacity 300ms ${delay}`,
                      } as CSSProperties
                    }
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

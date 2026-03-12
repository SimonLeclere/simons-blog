'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import GitHubIcon from '@/components/icons/github'
import RssIcon from '@/components/icons/rss'

const navItems = [
  { label: 'Blog', path: '/blog' },
  { label: 'About', path: '/about' },
]

export default function Nav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav className="mb-8 border-b border-gray-100 dark:border-zinc-800 pb-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
          Simon&apos;s Blog
        </Link>

        {/* Hamburger button – visible on mobile only */}
        <button
          className="md:hidden p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="nav-menu"
          aria-label="Toggle navigation"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            {isOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>

        {/* Desktop links – always visible on md+ */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
            return (
              <li key={item.path} className="flex items-center">
                <Link
                  href={item.path}
                  className={clsx(
                    "text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-gray-100",
                    isActive ? "text-gray-900 dark:text-gray-100 font-semibold" : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
          <li className="flex items-center">
            <Link
              href="https://github.com/SimonLeclere/simons-blog"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="flex items-center text-gray-400 hover:text-gray-900 dark:text-zinc-500 dark:hover:text-gray-100 transition-colors"
            >
              <GitHubIcon />
              <span className="sr-only">GitHub</span>
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              href="/feed.xml"
              title="Flux RSS"
              className="flex items-center text-gray-400 hover:text-orange-500 dark:text-zinc-500 dark:hover:text-orange-400 transition-colors"
            >
              <RssIcon />
              <span className="sr-only">Flux RSS</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile menu – slides open below the header */}
      <ul
        id="nav-menu"
        className={clsx(
          "md:hidden flex flex-col gap-1 overflow-hidden transition-all duration-200 ease-in-out",
          isOpen ? "mt-4 max-h-60 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path))
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "block py-2 text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-gray-100",
                  isActive ? "text-gray-900 dark:text-gray-100 font-semibold" : "text-gray-500 dark:text-gray-400"
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
        <li>
          <Link
            href="https://github.com/SimonLeclere/simons-blog"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <GitHubIcon />
            GitHub
          </Link>
        </li>
        <li>
          <Link
            href="/feed.xml"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            <RssIcon />
            Flux RSS
          </Link>
        </li>
      </ul>
    </nav>
  )
}

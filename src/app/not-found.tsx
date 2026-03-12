import Link from 'next/link'
import Nav from '@/components/nav'

export default function NotFound() {
  return (
    <div>
      <Nav />
      <div className="mt-24 flex flex-col items-center text-center">
        <span className="text-7xl mb-6">404</span>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">
          Page introuvable
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Retour aux articles
        </Link>
      </div>
    </div>
  )
}

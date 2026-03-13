import '@/styles/global.css'
import { ReactNode } from 'react'

export const metadata = {
  title: {
    default: "Simon's Blog",
    template: "%s - Simon's Blog",
  },
  description: 'Technical blog about web development',
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
        <div className="relative min-h-screen">
          <div className="hidden sm:block fixed top-8 left-8 w-4 h-4 border-l border-t border-gray-300 dark:border-zinc-800 pointer-events-none" />
          <div className="hidden sm:block fixed top-8 right-8 w-4 h-4 border-r border-t border-gray-300 dark:border-zinc-800 pointer-events-none" />
          <div className="hidden sm:block fixed bottom-8 left-8 w-4 h-4 border-l border-b border-gray-300 dark:border-zinc-800 pointer-events-none" />
          <div className="hidden sm:block fixed bottom-8 right-8 w-4 h-4 border-r border-b border-gray-300 dark:border-zinc-800 pointer-events-none" />
          <main className="max-w-4xl mx-auto px-4 py-2 sm:px-8 sm:py-12 relative z-10 bg-white dark:bg-zinc-950 min-h-screen border-x border-dashed border-gray-100 dark:border-zinc-800">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

import Nav from '@/components/nav'
import PostIcon from '@/components/post-icon'
import DoctolibLogo from '@/components/doctolib-logo'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
}

const projects = [
  {
    name: 'Killer',
    description:
      'A real-life assassination game app for INSA campus. Players scan QR cards to discover targets and weapons. Built for 200+ students, available on both the App Store and Play Store.',
    url: 'https://github.com/Killer-INSA',
    icon: '🔪',
    tags: ['React Native', 'Rust'],
  },
  {
    name: 'SecoursPop Application',
    description:
      'Stock and family management app for a local Secours Populaire chapter.',
    url: 'https://github.com/SimonLeclere/secourspop',
    icon: 'lucide:heart-handshake',
    tags: ['Next.js', 'TypeScript'],
  },
  {
    name: "Simon's Blog",
    description:
      'The site you are currently reading. MDX articles, RSS feed, and pixel art cats.',
    url: 'https://github.com/SimonLeclere/simons-blog',
    icon: '/favicon.svg',
    tags: ['Next.js', 'MDX', 'Tailwind'],
  },
  {
    name: 'Council of Wisdom',
    description:
      'Summon a council of historical and fictional figures to debate your questions, powered by Mistral AI.',
    url: 'https://github.com/SimonLeclere/MistralAI-Council',
    icon: '🏛️',
    tags: ['Next.js', 'Mistral AI'],
  },
  {
    name: 'Insify',
    description:
      'A Notion-like collaborative editor for students to write and organize their coursework.',
    url: 'https://github.com/SimonLeclere/insify',
    icon: 'lucide:file-text',
    tags: ['Next.js', 'TypeScript'],
  },
]

export default function AboutPage() {
  return (
    <div>
      <Nav />

      {/* Hero */}
      <div className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <Image
          src="https://avatars.githubusercontent.com/SimonLeclere"
          alt="Simon's avatar"
          width={96}
          height={96}
          priority
          className="rounded-full border-2 border-gray-100 dark:border-zinc-800"
        />
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-center sm:text-left">
            Hi, I&apos;m Simon 👋
          </h1>
          <p className="mt-2 text-xl text-gray-600 dark:text-gray-400 text-center sm:text-left">
            Software Engineer at{' '}
            <DoctolibLogo className="inline-block h-5 align-middle relative -top-0.5" />{', '}
            passionate about building things on the web.
          </p>
          <div className="mt-4 flex gap-3 justify-center sm:justify-start">
            <Link
              href="https://github.com/SimonLeclere"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-zinc-700 pl-2.5 pr-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <img src="/icons/GitHub_Invertocat_Black.svg" alt="" className="h-5 w-5 shrink-0 dark:invert" aria-hidden="true" />{' '}
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/simonleclere/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-zinc-700 pl-2.5 pr-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <img src="/icons/linkedin.svg" alt="" className="h-5 w-5 shrink-0 dark:invert" aria-hidden="true" />{' '}
              LinkedIn
            </Link>
            <Link
              href="mailto:simon-leclere@orange.fr"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-zinc-700 pl-2.5 pr-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
              Email
            </Link>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-12 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>
          I&apos;m drawn to the intersection of clean code, good design, and
          tools that actually solve problems. I like understanding how things
          work under the hood, whether that&apos;s a framework, a security
          mechanism, or a language feature.
        </p>
        <p>
          This blog is where I write about things I build, learn, or find
          interesting. The source is on{' '}
          <Link
            href="https://github.com/SimonLeclere/simons-blog"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            GitHub
          </Link>, and articles live as MDX files, versioned alongside their images and
          components.
        </p>
      </div>

      {/* Projects */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight mb-4">A few projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-gray-100 dark:border-zinc-800 p-5 transition-colors hover:border-gray-300 dark:hover:border-zinc-600"
            >
              <div className="flex items-center gap-3 mb-2">
                <PostIcon
                  icon={project.icon}
                  size={20}
                  className="shrink-0 text-gray-500 dark:text-zinc-400"
                />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 dark:bg-zinc-800 px-2.5 py-0.5 text-xs text-gray-600 dark:text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

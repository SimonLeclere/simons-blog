import { ReactNode } from 'react'
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: any[]) => twMerge(clsx(inputs))

const icons = { info: Info, warning: AlertTriangle, success: CheckCircle, error: XCircle, default: Info }

const colors = {
  default: 'border-l-gray-300 bg-gray-50 text-gray-900 dark:bg-zinc-900/50 dark:text-zinc-200 dark:border-l-zinc-600',
  info: 'border-l-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-500/10 dark:text-blue-300 dark:border-l-blue-400',
  warning: 'border-l-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-500/10 dark:text-amber-300 dark:border-l-amber-400',
  success: 'border-l-green-500 bg-green-50 text-green-900 dark:bg-green-500/10 dark:text-green-300 dark:border-l-green-400',
  error: 'border-l-red-500 bg-red-50 text-red-900 dark:bg-red-500/10 dark:text-red-300 dark:border-l-red-400',
}

export default function Callout({ type = 'default', children }: { type?: keyof typeof icons; children: ReactNode }) {
  const Icon = icons[type] || icons.default
  return (
    <div className={cn("my-6 flex gap-3 rounded-lg border border-gray-200 dark:border-zinc-800/50 border-l-4 p-4", colors[type] || colors.default)}>
      <div className="shrink-0"><Icon className="h-5 w-5 opacity-90" /></div>
      <div className="mdx-callout-content text-sm [&>p]:leading-relaxed [&>p:last-child]:mb-0 [&>p:first-child]:mt-0">{children}</div>
    </div>
  )
}

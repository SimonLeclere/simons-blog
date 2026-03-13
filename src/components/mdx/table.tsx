import type { ComponentPropsWithoutRef } from 'react'

export function Table(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="my-0 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <table className="w-full text-left text-sm border-collapse m-0 border-hidden" {...props} />
    </div>
  )
}

export function Thead(props: ComponentPropsWithoutRef<'thead'>) {
  return <thead className="border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900" {...props} />
}

export function Th(props: ComponentPropsWithoutRef<'th'>) {
  return <th className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100" {...props} />
}

export function Td(props: ComponentPropsWithoutRef<'td'>) {
  return <td className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800/50 last:border-0" {...props} />
}

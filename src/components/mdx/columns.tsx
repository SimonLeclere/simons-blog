import type { ReactNode } from 'react'

type ColumnsProps = Readonly<{
  children: ReactNode
  count?: number
  gap?: string | number
  className?: string
}>

export default function Columns({ children, count = 2, gap = 4, className }: ColumnsProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  }[count as 1 | 2 | 3 | 4] || 'grid-cols-1 md:grid-cols-2'

  return <div className={`grid ${gridCols} my-8 items-start ${className || ''}`} style={{ gap: `${gap}rem` }}>{children}</div>
}

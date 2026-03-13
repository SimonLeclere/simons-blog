import { icons as lucideIcons } from 'lucide-react'
import * as simpleIcons from '@icons-pack/react-simple-icons'

type Props = {
  icon: string
  size?: number
  className?: string
}

/**
 * Renders a post icon from a frontmatter `icon` field.
 *
 * Supported formats:
 *   "lucide:terminal"     → Lucide icon
 *   "si:react"            → Simple Icons brand icon
 *   "/img/photo.png"      → local image
 *   "https://example.com" → remote image
 *   "🚀"                  → emoji
 */
export default function PostIcon({ icon, size = 32, className }: Readonly<Props>) {
  if (icon.startsWith('lucide:')) {
    const name = icon.slice(7) // e.g. "terminal"
    // Lucide keys are PascalCase: "terminal" → "Terminal", "arrow-right" → "ArrowRight"
    const pascalName = name
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('')
    const LucideIcon = lucideIcons[pascalName as keyof typeof lucideIcons]
    if (LucideIcon) {
      return <LucideIcon size={size} className={className} />
    }
    return null
  }

  if (icon.startsWith('si:')) {
    const name = icon.slice(3) // e.g. "react"
    // Simple Icons keys are "Si" + PascalCase: "react" → "SiReact"
    const pascalName = 'Si' + name
      .split('-')
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join('')
    const SiIcon = (simpleIcons as Record<string, any>)[pascalName]
    if (SiIcon) {
      return <SiIcon size={size} className={className} />
    }
    return null
  }

  if (icon.startsWith('http') || icon.startsWith('/')) {
    return <img src={icon} alt="" width={size} height={size} className={`object-contain ${className || ''}`} />
  }

  // Fallback: emoji
  return <span className={className}>{icon}</span>
}

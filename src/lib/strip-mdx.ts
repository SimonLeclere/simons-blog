import { stripFigure } from '@/components/mdx-components'
import { stripBookmark } from '@/components/mdx/bookmark'
import { stripCallout } from '@/components/mdx/callout'
import { stripColumns } from '@/components/mdx/columns'

/**
 * Strips custom MDX/JSX components from content and converts them
 * to standard markdown equivalents.
 */
export function stripMdxComponents(content: string): string {
  let result = content
  result = stripFigure(result)
  result = stripBookmark(result)
  result = stripCallout(result)
  result = stripColumns(result)
  // Remove any remaining custom components
  result = result.replaceAll(/<[A-Z]\w+\s[^>]*\/>/g, '')
  result = result.replaceAll(/<\/?[A-Z]\w+[^>]*>/g, '')
  // Clean up excessive blank lines
  result = result.replaceAll(/\n{3,}/g, '\n\n')
  return result
}

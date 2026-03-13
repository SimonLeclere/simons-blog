/**
 * Strips custom MDX/JSX components from content and converts them
 * to standard markdown equivalents.
 *
 * These functions are defined here (rather than imported from component files)
 * because component files may use 'use client' and cannot be called from
 * server-side route handlers.
 */

/** Convert <Figure src="..." caption="..." /> to ![caption](src) */
const stripFigure = (s: string) =>
  s.replaceAll(/<Figure\s+[^>]*?src="([^"]*)"[^>]*?caption="([^"]*)"[^>]*?\/?\s*>/g, '![$2]($1)')
   .replaceAll(/<Figure\s+[^>]*?src="([^"]*)"[^>]*?\/?\s*>/g, '![]($1)')

/** Convert <Bookmark url="..." title="..." /> to [title](url) or plain URL */
const stripBookmark = (s: string) =>
  s.replaceAll(/<Bookmark\s+[^>]*?url="([^"]*)"[^>]*?title="([^"]*)"[^>]*?\/?\s*>/g, '[$2]($1)')
   .replaceAll(/<Bookmark\s+[^>]*?url="([^"]*)"[^>]*?\/?\s*>/g, '$1')

/** Convert <Callout>content</Callout> to blockquote */
const stripCallout = (s: string) =>
  s.replaceAll(/<Callout[^>]*>([\s\S]*?)<\/Callout>/g, (_m, inner: string) =>
    inner.trim().split('\n').map((l: string) => `> ${l}`).join('\n')
  )

/** Remove <Columns> wrapper tags */
const stripColumns = (s: string) =>
  s.replaceAll(/<\/?(Columns)[^>]*>/g, '')

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

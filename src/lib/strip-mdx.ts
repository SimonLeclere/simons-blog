/**
 * Strips custom MDX/JSX components from content and converts them
 * to standard markdown equivalents.
 */
export function stripMdxComponents(content: string): string {
  return content
    // Convert <Figure src="..." caption="..." /> to ![caption](src)
    .replace(/<Figure\s+[^>]*?src="([^"]*)"[^>]*?caption="([^"]*)"[^>]*?\/?\s*>/g, '![$2]($1)')
    .replace(/<Figure\s+[^>]*?src="([^"]*)"[^>]*?\/?\s*>/g, '![]($1)')
    // Convert <Bookmark url="..." title="..." /> to [title](url)
    .replace(/<Bookmark\s+[^>]*?url="([^"]*)"[^>]*?title="([^"]*)"[^>]*?\/?\s*>/g, '[$2]($1)')
    .replace(/<Bookmark\s+[^>]*?url="([^"]*)"[^>]*?\/?\s*>/g, '$1')
    // Convert <Callout>content</Callout> to > content
    .replace(/<Callout[^>]*>([\s\S]*?)<\/Callout>/g, (_m, inner: string) =>
      inner.trim().split('\n').map((l: string) => `> ${l}`).join('\n')
    )
    // Remove wrapper components like <Columns>
    .replace(/<\/?(Columns)[^>]*>/g, '')
    // Remove any remaining custom components
    .replace(/<[A-Z]\w+\s[^>]*\/>/g, '')
    .replace(/<\/?[A-Z]\w+[^>]*>/g, '')
    // Clean up excessive blank lines
    .replace(/\n{3,}/g, '\n\n')
}

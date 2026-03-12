/**
 * Strips custom MDX/JSX components from content and converts them
 * to standard markdown equivalents.
 */
export function stripMdxComponents(content: string): string {
  return content
    // Convert <Figure src="..." caption="..." /> to ![caption](src)
    .replaceAll(/<Figure\s+[^>]*?src="([^"]*)"[^>]*?caption="([^"]*)"[^>]*?\/?\s*>/g, '![$2]($1)')
    .replaceAll(/<Figure\s+[^>]*?src="([^"]*)"[^>]*?\/?\s*>/g, '![]($1)')
    // Convert <Bookmark url="..." title="..." /> to [title](url)
    .replaceAll(/<Bookmark\s+[^>]*?url="([^"]*)"[^>]*?title="([^"]*)"[^>]*?\/?\s*>/g, '[$2]($1)')
    .replaceAll(/<Bookmark\s+[^>]*?url="([^"]*)"[^>]*?\/?\s*>/g, '$1')
    // Convert <Callout>content</Callout> to > content
    .replaceAll(/<Callout[^>]*>([\s\S]*?)<\/Callout>/g, (_m, inner: string) =>
      inner.trim().split('\n').map((l: string) => `> ${l}`).join('\n')
    )
    // Remove wrapper components like <Columns>
    .replaceAll(/<\/?(Columns)[^>]*>/g, '')
    // Remove any remaining custom components
    .replaceAll(/<[A-Z]\w+\s[^>]*\/>/g, '')
    .replaceAll(/<\/?[A-Z]\w+[^>]*>/g, '')
    // Clean up excessive blank lines
    .replaceAll(/\n{3,}/g, '\n\n')
}

import { describe, it, expect } from 'vitest'
import { stripMdxComponents } from '@/lib/strip-mdx'

describe('stripMdxComponents', () => {
  it('converts Figure with caption to markdown image', () => {
    const input = '<Figure src="https://example.com/img.png" caption="My image" />'
    expect(stripMdxComponents(input)).toBe('![My image](https://example.com/img.png)')
  })

  it('converts Figure without caption to markdown image', () => {
    const input = '<Figure src="/photo.jpg" />'
    expect(stripMdxComponents(input)).toBe('![](/photo.jpg)')
  })

  it('converts Bookmark with title to markdown link', () => {
    const input = '<Bookmark url="https://example.com" title="Example" />'
    expect(stripMdxComponents(input)).toBe('[Example](https://example.com)')
  })

  it('converts Bookmark without title to plain URL', () => {
    const input = '<Bookmark url="https://example.com" />'
    expect(stripMdxComponents(input)).toBe('https://example.com')
  })

  it('converts Callout to blockquote', () => {
    const input = '<Callout type="info">This is important.\nSecond line.</Callout>'
    expect(stripMdxComponents(input)).toBe('> This is important.\n> Second line.')
  })

  it('removes Columns wrapper', () => {
    const input = '<Columns>\nsome content\n</Columns>'
    expect(stripMdxComponents(input)).toContain('some content')
    expect(stripMdxComponents(input)).not.toContain('Columns')
  })

  it('removes unknown custom components', () => {
    const input = 'before\n<CustomWidget foo="bar" />\nafter'
    const result = stripMdxComponents(input)
    expect(result).not.toContain('CustomWidget')
    expect(result).toContain('before')
    expect(result).toContain('after')
  })

  it('collapses excessive blank lines', () => {
    const input = 'line1\n\n\n\n\nline2'
    expect(stripMdxComponents(input)).toBe('line1\n\nline2')
  })

  it('handles mixed content', () => {
    const input = [
      '# Title',
      '',
      '<Figure src="/img.png" caption="Photo" />',
      '',
      '<Callout>Note here</Callout>',
      '',
      'Regular paragraph.',
    ].join('\n')

    const result = stripMdxComponents(input)
    expect(result).toContain('# Title')
    expect(result).toContain('![Photo](/img.png)')
    expect(result).toContain('> Note here')
    expect(result).toContain('Regular paragraph.')
  })
})

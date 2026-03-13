import Image from 'next/image'

type FigureProps = Readonly<{
  src: string
  caption?: string
  alt?: string
  className?: string
  width?: string
  align?: 'left' | 'center' | 'right'
}>

export default function Figure({ src, caption, alt, className, width = "100%", align = "center" }: FigureProps) {
  let alignClass = 'mx-auto'
  if (align === 'left') {
    alignClass = 'mr-auto'
  } else if (align === 'right') {
    alignClass = 'ml-auto'
  }

  return (
    <figure className={["my-8 pt-1", alignClass, className].filter(Boolean).join(' ')} style={{ width }}>
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800">
        <Image src={src} alt={alt || caption || ''} width={1200} height={630} className="w-full h-auto object-cover" loading="lazy" />
      </div>
      {caption && <figcaption className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400 italic">{caption}</figcaption>}
    </figure>
  )
}

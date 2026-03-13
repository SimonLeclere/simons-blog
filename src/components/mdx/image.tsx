import Image from 'next/image'
import Figure from './figure'

export default function CustomImage(props: { src?: string; alt?: string; title?: string }) {
  if (props.title) {
    return <Figure src={props.src!} caption={props.title} alt={props.alt} />
  }

  return (
    <div className="my-0 overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-800">
      <Image src={props.src!} alt={props.alt || ''} width={1200} height={630} className="w-full h-auto" loading="lazy" />
    </div>
  )
}

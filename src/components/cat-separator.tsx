type Props = Readonly<{ className?: string }>;

export default function CatSeparator({ className }: Props) {
  return (
    <div className={`cat-separator ${className || ''}`}>
      <div className="cat-separator__line" />
      <div className="cat-separator__cat" />
    </div>
  )
}

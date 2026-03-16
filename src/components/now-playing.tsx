export default function NowPlaying() {
  return (
    <span className="inline-flex items-end gap-0.5 h-3" aria-label="Now playing">
      <span className="w-0.75 bg-green-500 rounded-full animate-eq-1" />
      <span className="w-0.75 bg-green-500 rounded-full animate-eq-2" />
      <span className="w-0.75 bg-green-500 rounded-full animate-eq-3" />
    </span>
  )
}

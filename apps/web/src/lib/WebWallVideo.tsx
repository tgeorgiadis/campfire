export function WebWallVideo({
  url,
  autoPlay,
  loop,
  muted = true,
}: {
  url: string
  autoPlay: boolean
  loop: boolean
  muted?: boolean
}) {
  return (
    <video
      src={url}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  )
}

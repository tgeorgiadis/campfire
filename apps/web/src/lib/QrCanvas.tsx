import { useEffect, useRef } from 'react'

export function QrCanvas({
  url,
  size = 200,
  borderColor = '#dbdbdb',
  canvasRef: externalRef,
}: {
  url: string
  size?: number
  borderColor?: string
  canvasRef?: (el: HTMLCanvasElement | null) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !url) {
      return
    }
    void import('qrcode').then((QRCode) =>
      QRCode.toCanvas(canvasRef.current!, url, { width: size, margin: 1 }),
    )
  }, [url, size])

  return (
    <canvas
      ref={(el) => {
        canvasRef.current = el
        externalRef?.(el)
      }}
      style={{ borderRadius: 8, border: `3px solid ${borderColor}` }}
    />
  )
}

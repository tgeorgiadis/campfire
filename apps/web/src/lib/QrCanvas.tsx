import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export function QrCanvas({ url, size = 200 }: { url: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !url) {
      return
    }
    void QRCode.toCanvas(canvasRef.current, url, { width: size, margin: 1 })
  }, [url, size])

  return (
    <canvas
      ref={canvasRef}
      style={{ borderRadius: 8, border: '1px solid #dbdbdb' }}
    />
  )
}

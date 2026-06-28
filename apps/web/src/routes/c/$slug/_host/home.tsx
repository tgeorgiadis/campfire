import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import {
  buildAlbumUrl,
  buildJoinUrl,
  buildWallUrl,
  getGuestToken,
} from '@campfire/app-core'
import { EventHomeContent } from '@campfire/ui'
import { QrCanvas } from '~/lib/QrCanvas'
import { copyToClipboard, downloadQrCanvas, openUrl } from '~/lib/eventWebUtils'
import { useEventManagerContext } from '~/lib/EventManagerLayout'

export const Route = createFileRoute('/c/$slug/_host/home')({
  ssr: false,
  component: EventHome,
})

function EventHome() {
  const { slug, dashboard } = useEventManagerContext()
  const qrRef = useRef<HTMLCanvasElement | null>(null)
  const [guestToken] = useState(() => getGuestToken(slug) ?? undefined)

  const joinUrl = guestToken
    ? buildJoinUrl(slug, guestToken)
    : buildAlbumUrl(slug)

  return (
    <EventHomeContent
      dashboard={dashboard}
      joinUrl={joinUrl}
      albumUrl={buildAlbumUrl(slug)}
      wallUrl={buildWallUrl(slug)}
      qrElement={
        <QrCanvas
          url={joinUrl}
          size={200}
          canvasRef={(el) => {
            qrRef.current = el
          }}
        />
      }
      onCopy={copyToClipboard}
      onOpenUrl={openUrl}
      onDownloadQr={() => {
        if (qrRef.current) {
          downloadQrCanvas(qrRef.current, `${slug}-qr.png`)
        }
      }}
    />
  )
}

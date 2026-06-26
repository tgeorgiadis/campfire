import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import {
  buildAlbumUrl,
  buildJoinUrl,
  buildWallUrl,
  getGuestToken,
} from '@campfire/app-core'
import { EventHomeScreen } from '@campfire/ui'
import { QrCanvas } from '~/lib/QrCanvas'
import { copyToClipboard, downloadQrCanvas, openUrl } from '~/lib/eventWebUtils'
import { EventManagerGate } from '~/lib/useEventManager'

export const Route = createFileRoute('/c/$slug/home')({
  ssr: false,
  component: EventHome,
})

function EventHome() {
  const { slug } = Route.useParams()
  const qrRef = useRef<HTMLCanvasElement | null>(null)
  const [guestToken] = useState(() => getGuestToken(slug) ?? undefined)

  return (
    <EventManagerGate slug={slug}>
      {(ctx) => {
        const joinUrl = guestToken
          ? buildJoinUrl(slug, guestToken)
          : buildAlbumUrl(slug)

        return (
          <EventHomeScreen
            slug={slug}
            campfires={ctx.campfires}
            dashboard={ctx.dashboard}
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
            activeTab="home"
            onNavigate={ctx.nav.onNavigate}
            onSwitchEvent={ctx.nav.onSwitchEvent}
            onSignOut={ctx.nav.onSignOut}
            onCreateCampfire={ctx.nav.onCreateCampfire}
            onViewAllEvents={ctx.nav.onViewAllEvents}
            onCopy={copyToClipboard}
            onOpenUrl={openUrl}
            onDownloadQr={() => {
              if (qrRef.current) {
                downloadQrCanvas(qrRef.current, `${slug}-qr.png`)
              }
            }}
            eventSwitcher={ctx.eventSwitcher}
          />
        )
      }}
    </EventManagerGate>
  )
}

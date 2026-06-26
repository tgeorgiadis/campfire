import { useMutation } from 'convex/react'
import { useCallback, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { api } from '@campfire/backend/convex/_generated/api'
import { PhotoWallScreen } from '@campfire/ui'
import type { Id } from '@campfire/backend/convex/_generated/dataModel'
import type { CampfireSettings, PhotoItem } from '@campfire/app-core'
import type { WallSettingsPatch } from '~/lib/WebWallSettingsPanel'
import { WebWallImage } from '~/lib/WebWallImage'
import { WebWallQrWidget } from '~/lib/WebWallQrWidget'
import { WebWallSettingsPanel } from '~/lib/WebWallSettingsPanel'
import { WebWallTopBar } from '~/lib/WebWallTopBar'
import { WebWallVideo } from '~/lib/WebWallVideo'

type PublicWallContext = {
  _id: Id<'campfires'>
  slug: string
  settings: CampfireSettings
  role: 'owner' | 'member' | null
  wallBackgroundUrl: string | null
}

export function WebWallExperience({
  publicSettings,
  photos,
  joinUrl,
}: {
  publicSettings: PublicWallContext
  photos: Array<PhotoItem>
  joinUrl: string
}) {
  const navigate = useNavigate()
  const updateWall = useMutation(api.campfires.updateWallSettings)

  const [panelOpen, setPanelOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)

  const isOwner = publicSettings.role === 'owner'

  const saveWallSettings = useCallback(
    async (patch: WallSettingsPatch) => {
      await updateWall({
        campfireId: publicSettings._id,
        ...patch,
      })
    },
    [publicSettings._id, updateWall],
  )

  return (
    <>
      {publicSettings.wallBackgroundUrl ? (
        <img
          src={publicSettings.wallBackgroundUrl}
          alt=""
          aria-hidden
          className="fixed inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0"
        />
      ) : null}

      <PhotoWallScreen
        photos={photos}
        settings={publicSettings.settings}
        qrElement={<WebWallQrWidget url={joinUrl} />}
        renderImage={(url) => <WebWallImage url={url} />}
        renderVideo={(url, loop) => (
          <WebWallVideo
            url={url}
            autoPlay
            loop={loop}
            muted={!soundEnabled}
          />
        )}
      />

      <WebWallTopBar
        isOwner={isOwner}
        soundEnabled={soundEnabled}
        onSoundChange={setSoundEnabled}
        onOpenSettings={() => setPanelOpen(true)}
      />

      {isOwner ? (
        <WebWallSettingsPanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          campfireId={publicSettings._id}
          settings={publicSettings.settings}
          onSave={saveWallSettings}
          onOpenEventSettings={() => {
            void navigate({
              to: '/c/$slug/settings',
              params: { slug: publicSettings.slug },
              search: { tab: 'photo-wall' },
            })
          }}
        />
      ) : null}
    </>
  )
}

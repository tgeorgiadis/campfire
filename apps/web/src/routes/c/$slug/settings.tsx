import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useEffect, useState } from 'react'
import { api } from '@campfire/backend/convex/_generated/api'
import { EventSettingsScreen } from '@campfire/ui'
import type { SettingsTab } from '@campfire/app-core'
import type { EventManagerContext } from '~/lib/eventContext'
import { EventManagerGate } from '~/lib/useEventManager'

export const Route = createFileRoute('/c/$slug/settings')({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    tab:
      typeof search.tab === 'string'
        ? (search.tab as SettingsTab)
        : ('general' as SettingsTab),
  }),
  component: EventSettings,
})

function EventSettings() {
  const { slug } = Route.useParams()
  const { tab } = Route.useSearch()
  const navigate = useNavigate()

  return (
    <EventManagerGate slug={slug}>
      {(ctx) => (
        <SettingsContent
          slug={slug}
          ctx={ctx}
          settingsTab={tab}
          onSettingsTabChange={(next) => {
            void navigate({
              to: '/c/$slug/settings',
              params: { slug },
              search: { tab: next },
            })
          }}
        />
      )}
    </EventManagerGate>
  )
}

function SettingsContent({
  slug,
  ctx,
  settingsTab,
  onSettingsTabChange,
}: {
  slug: string
  ctx: EventManagerContext
  settingsTab: SettingsTab
  onSettingsTabChange: (tab: SettingsTab) => void
}) {
  const members = useQuery(api.campfires.listMembers, {
    campfireId: ctx.dashboard._id,
  })

  const updateGeneral = useMutation(api.campfires.updateGeneral)
  const updateSlug = useMutation(api.campfires.updateSlug)
  const updateAppearance = useMutation(api.campfires.updateAppearance)
  const updateWall = useMutation(api.campfires.updateWallSettings)
  const updateModeration = useMutation(api.campfires.updateModeration)
  const generateUploadUrl = useMutation(api.campfires.generateSettingsUploadUrl)
  const inviteMember = useMutation(api.campfires.inviteMember)
  const removeMember = useMutation(api.campfires.removeMember)

  const s = ctx.dashboard.settings

  const [generalForm, setGeneralForm] = useState({
    name: ctx.dashboard.name,
    eventDate: s.eventDate
      ? new Date(s.eventDate).toISOString().slice(0, 10)
      : '',
    eventType: s.eventType,
    customSlug: ctx.dashboard.slug,
  })

  const [appearanceForm, setAppearanceForm] = useState({
    themeColor: s.themeColor,
    displayLanguage: s.displayLanguage,
    welcomeScreenEnabled: s.welcomeScreenEnabled,
    welcomeScreenTitle: s.welcomeScreenTitle ?? '',
    welcomeScreenMessage: s.welcomeScreenMessage ?? '',
    removeBranding: s.removeBranding,
    captionTheme: s.captionTheme,
  })

  const [wallForm, setWallForm] = useState({
    imageDurationSec: String(s.imageDurationSec),
    videoDurationSec: String(s.videoDurationSec),
    textDurationSec: String(s.textDurationSec),
    autoVideoDuration: s.autoVideoDuration,
    hideSideImages: s.hideSideImages,
    hideWallQr: s.hideWallQr,
    hideWallCaption: s.hideWallCaption,
    hideWallLikes: s.hideWallLikes,
  })

  const [moderationForm, setModerationForm] = useState({
    requireApproval: s.requireApproval,
    contentFilterEnabled: s.contentFilterEnabled,
    allowedPhotos: s.allowedPhotos,
    allowedVideos: s.allowedVideos,
    allowedText: s.allowedText,
    albumPermission: s.albumPermission,
    disableGuestDownload: s.disableGuestDownload,
    disableLikes: s.disableLikes,
  })

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState<string | null>(null)

  useEffect(() => {
    setGeneralForm({
      name: ctx.dashboard.name,
      eventDate: s.eventDate
        ? new Date(s.eventDate).toISOString().slice(0, 10)
        : '',
      eventType: s.eventType,
      customSlug: ctx.dashboard.slug,
    })
  }, [ctx.dashboard])

  const uploadAsset = (kind: 'logo' | 'albumBg' | 'wallBg') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) {
        return
      }
      const uploadUrl = await generateUploadUrl({
        campfireId: ctx.dashboard._id,
      })
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!res.ok) {
        return
      }
      const { storageId } = (await res.json()) as { storageId: string }
      if (kind === 'logo') {
        await updateAppearance({
          campfireId: ctx.dashboard._id,
          logoStorageId: storageId as never,
        })
      } else if (kind === 'albumBg') {
        await updateAppearance({
          campfireId: ctx.dashboard._id,
          albumBackgroundStorageId: storageId as never,
        })
      } else {
        await updateWall({
          campfireId: ctx.dashboard._id,
          wallBackgroundStorageId: storageId as never,
        })
      }
    }
    input.click()
  }

  if (members === undefined) {
    return null
  }

  return (
    <EventSettingsScreen
      slug={slug}
      campfires={ctx.campfires}
      dashboard={ctx.dashboard}
      members={members}
      activeTab="settings"
      settingsTab={settingsTab}
      onSettingsTabChange={onSettingsTabChange}
      onNavigate={ctx.nav.onNavigate}
      onSwitchEvent={ctx.nav.onSwitchEvent}
      onSignOut={ctx.nav.onSignOut}
      onCreateCampfire={ctx.nav.onCreateCampfire}
      onViewAllEvents={ctx.nav.onViewAllEvents}
      eventSwitcher={ctx.eventSwitcher}
      generalForm={generalForm}
      onGeneralFormChange={(patch) =>
        setGeneralForm((prev) => ({ ...prev, ...patch }))
      }
      appearanceForm={appearanceForm}
      onAppearanceFormChange={(patch) =>
        setAppearanceForm((prev) => ({ ...prev, ...patch }))
      }
      wallForm={wallForm}
      onWallFormChange={(patch) => setWallForm((prev) => ({ ...prev, ...patch }))}
      moderationForm={moderationForm}
      onModerationFormChange={(patch) =>
        setModerationForm((prev) => ({ ...prev, ...patch }))
      }
      inviteEmail={inviteEmail}
      onInviteEmailChange={setInviteEmail}
      inviteError={inviteError}
      onSaveGeneral={() => {
        void updateGeneral({
          campfireId: ctx.dashboard._id,
          name: generalForm.name,
          eventDate: generalForm.eventDate
            ? new Date(generalForm.eventDate).getTime()
            : null,
          eventType: generalForm.eventType,
        }).then(() => {
          if (generalForm.customSlug !== ctx.dashboard.slug) {
            void updateSlug({
              campfireId: ctx.dashboard._id,
              slug: generalForm.customSlug,
            })
          }
        })
      }}
      onSaveAppearance={() => {
        void updateAppearance({
          campfireId: ctx.dashboard._id,
          themeColor: appearanceForm.themeColor,
          displayLanguage: appearanceForm.displayLanguage,
          welcomeScreenEnabled: appearanceForm.welcomeScreenEnabled,
          welcomeScreenTitle: appearanceForm.welcomeScreenTitle || null,
          welcomeScreenMessage: appearanceForm.welcomeScreenMessage || null,
          removeBranding: appearanceForm.removeBranding,
          captionTheme: appearanceForm.captionTheme,
        })
      }}
      onSaveWall={() => {
        void updateWall({
          campfireId: ctx.dashboard._id,
          imageDurationSec: Number(wallForm.imageDurationSec) || 8,
          videoDurationSec: Number(wallForm.videoDurationSec) || 12,
          textDurationSec: Number(wallForm.textDurationSec) || 10,
          autoVideoDuration: wallForm.autoVideoDuration,
          hideSideImages: wallForm.hideSideImages,
          hideWallQr: wallForm.hideWallQr,
          hideWallCaption: wallForm.hideWallCaption,
          hideWallLikes: wallForm.hideWallLikes,
        })
      }}
      onSaveModeration={() => {
        void updateModeration({
          campfireId: ctx.dashboard._id,
          ...moderationForm,
        })
      }}
      onInvite={() => {
        setInviteError(null)
        void inviteMember({
          campfireId: ctx.dashboard._id,
          email: inviteEmail,
        })
          .then(() => setInviteEmail(''))
          .catch((err: unknown) => {
            setInviteError(err instanceof Error ? err.message : 'Invite failed')
          })
      }}
      onRemoveMember={(memberId) => {
        void removeMember({
          campfireId: ctx.dashboard._id,
          memberId,
        })
      }}
      onUploadAsset={(kind) => {
        void uploadAsset(kind)
      }}
    />
  )
}

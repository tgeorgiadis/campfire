import { useMutation } from 'convex/react'
import { useEffect, useState } from 'react'
import { api } from '@campfire/backend/convex/_generated/api'
import { PrimaryButton, SettingsRow, ToggleSwitch } from '@campfire/ui'
import type { Id } from '@campfire/backend/convex/_generated/dataModel'
import type { CampfireSettings } from '@campfire/app-core'

export type WallSettingsPatch = {
  imageDurationSec?: number
  videoDurationSec?: number
  textDurationSec?: number
  autoVideoDuration?: boolean
  hideSideImages?: boolean
  hideWallQr?: boolean
  hideWallCaption?: boolean
  hideWallLikes?: boolean
  wallBackgroundStorageId?: Id<'_storage'>
}

export function WebWallSettingsPanel({
  open,
  onClose,
  campfireId,
  settings,
  onSave,
  onOpenEventSettings,
}: {
  open: boolean
  onClose: () => void
  campfireId: Id<'campfires'>
  settings: CampfireSettings
  onSave: (patch: WallSettingsPatch) => Promise<void>
  onOpenEventSettings: () => void
}) {
  const generateUploadUrl = useMutation(api.campfires.generateSettingsUploadUrl)

  const [imageDurationSec, setImageDurationSec] = useState(String(settings.imageDurationSec))
  const [videoDurationSec, setVideoDurationSec] = useState(String(settings.videoDurationSec))
  const [textDurationSec, setTextDurationSec] = useState(String(settings.textDurationSec))
  const [autoVideoDuration, setAutoVideoDuration] = useState(settings.autoVideoDuration)
  const [hideSideImages, setHideSideImages] = useState(settings.hideSideImages)
  const [hideWallQr, setHideWallQr] = useState(settings.hideWallQr)
  const [hideWallCaption, setHideWallCaption] = useState(settings.hideWallCaption)
  const [hideWallLikes, setHideWallLikes] = useState(settings.hideWallLikes)

  useEffect(() => {
    if (!open) {
      return
    }
    setImageDurationSec(String(settings.imageDurationSec))
    setVideoDurationSec(String(settings.videoDurationSec))
    setTextDurationSec(String(settings.textDurationSec))
    setAutoVideoDuration(settings.autoVideoDuration)
    setHideSideImages(settings.hideSideImages)
    setHideWallQr(settings.hideWallQr)
    setHideWallCaption(settings.hideWallCaption)
    setHideWallLikes(settings.hideWallLikes)
  }, [open, settings])

  if (!open) {
    return null
  }

  const saveDuration = async (
    field: 'imageDurationSec' | 'videoDurationSec' | 'textDurationSec',
    value: string,
  ) => {
    const parsed = Number(value)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return
    }
    await onSave({ [field]: parsed })
  }

  const uploadBackground = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) {
        return
      }
      const uploadUrl = await generateUploadUrl({ campfireId })
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!res.ok) {
        return
      }
      const { storageId } = (await res.json()) as { storageId: Id<'_storage'> }
      await onSave({ wallBackgroundStorageId: storageId })
    }
    input.click()
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close settings panel"
        className="fixed inset-0 bg-black/40 z-[70]"
        onClick={onClose}
      />
      <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-ig-surface shadow-xl z-[71] overflow-y-auto">
        <div className="p-6 gap-6 flex flex-col">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-ig-muted hover:text-ig-text text-xl leading-none p-1"
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex-1 gap-2">
              <h2 className="text-xl font-semibold text-ig-text">
                Photo Wall Customization
              </h2>
              <p className="text-sm text-ig-muted leading-relaxed">
                Go to your{' '}
                <button
                  type="button"
                  onClick={onOpenEventSettings}
                  className="text-cf-accent font-semibold hover:underline"
                >
                  Event Settings
                </button>{' '}
                to view all available settings.
              </p>
            </div>
          </div>

          <section className="gap-3">
            <div>
              <h3 className="text-base font-semibold text-ig-text">Media Duration</h3>
              <p className="text-sm text-ig-muted mt-1">
                Adjust how long each media is displayed.
              </p>
            </div>
            <div className="flex gap-3">
              <DurationField
                label="Image"
                value={imageDurationSec}
                onChange={setImageDurationSec}
                onBlur={() => void saveDuration('imageDurationSec', imageDurationSec)}
              />
              <DurationField
                label="Video"
                value={videoDurationSec}
                onChange={setVideoDurationSec}
                onBlur={() => void saveDuration('videoDurationSec', videoDurationSec)}
              />
              <DurationField
                label="Text Post"
                value={textDurationSec}
                onChange={setTextDurationSec}
                onBlur={() => void saveDuration('textDurationSec', textDurationSec)}
              />
            </div>
          </section>

          <div className="border border-ig-border rounded-lg p-4">
            <SettingsRow
              title="Automatic Video Duration"
              description="Play videos for their full length."
              control={
                <ToggleSwitch
                  value={autoVideoDuration}
                  onChange={(value) => {
                    setAutoVideoDuration(value)
                    void onSave({ autoVideoDuration: value })
                  }}
                />
              }
            />
          </div>

          <SettingsRow
            title="Background"
            description="Customize the background."
            control={
              <PrimaryButton
                label="Upload"
                variant="secondary"
                onPress={uploadBackground}
              />
            }
          />

          <SettingsRow
            title="Hide Side Images"
            description="Turn on to hide the moving images from the sides."
            control={
              <ToggleSwitch
                value={hideSideImages}
                onChange={(value) => {
                  setHideSideImages(value)
                  void onSave({ hideSideImages: value })
                }}
              />
            }
          />

          <SettingsRow
            title="Hide QR Code"
            description="Turn on to remove the QR code."
            control={
              <ToggleSwitch
                value={hideWallQr}
                onChange={(value) => {
                  setHideWallQr(value)
                  void onSave({ hideWallQr: value })
                }}
              />
            }
          />

          <SettingsRow
            title="Hide Caption"
            description="Toggle this option to hide media captions from appearing."
            control={
              <ToggleSwitch
                value={hideWallCaption}
                onChange={(value) => {
                  setHideWallCaption(value)
                  void onSave({ hideWallCaption: value })
                }}
              />
            }
          />

          <SettingsRow
            title="Hide likes"
            description="Toggle this option to hide like counts from appearing in the slideshow."
            control={
              <ToggleSwitch
                value={hideWallLikes}
                onChange={(value) => {
                  setHideWallLikes(value)
                  void onSave({ hideWallLikes: value })
                }}
              />
            }
          />
        </div>
      </aside>
    </>
  )
}

function DurationField({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
}) {
  return (
    <label className="flex-1 flex flex-col items-center gap-1 border border-ig-border rounded-lg bg-ig-page px-3 py-3">
      <span className="text-xs font-medium text-ig-muted">{label}</span>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="w-full text-center text-lg font-semibold text-ig-text bg-transparent outline-none"
      />
      <span className="text-xs text-ig-muted">seconds</span>
    </label>
  )
}

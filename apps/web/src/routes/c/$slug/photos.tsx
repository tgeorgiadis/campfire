import { createFileRoute } from '@tanstack/react-router'
import { useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { useRef, useState } from 'react'
import { api } from '@campfire/backend/convex/_generated/api'
import { EventPhotosScreen } from '@campfire/ui'
import { uploadPhoto } from '@campfire/app-core'
import type { PhotoStatus } from '@campfire/app-core'
import type { EventManagerContext } from '~/lib/eventContext'
import { EventManagerGate } from '~/lib/useEventManager'

export const Route = createFileRoute('/c/$slug/photos')({
  ssr: false,
  component: EventPhotos,
})

function EventPhotos() {
  const { slug } = Route.useParams()

  return (
    <EventManagerGate slug={slug}>
      {(ctx) => <EventPhotosContent slug={slug} ctx={ctx} />}
    </EventManagerGate>
  )
}

function EventPhotosContent({
  slug,
  ctx,
}: {
  slug: string
  ctx: EventManagerContext
}) {
  const [photoTab, setPhotoTab] = useState<PhotoStatus>('published')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const generateUploadUrl = useMutation(api.photos.generateUploadUrl)
  const createPhoto = useMutation(api.photos.create)
  const createTextPost = useMutation(api.photos.createTextPost)
  const setPhotoStatus = useMutation(api.photos.setStatus)
  const removePhoto = useMutation(api.photos.remove)

  const downloads = useQuery(api.photos.listDownloadUrls, {
    campfireId: ctx.dashboard._id,
  })

  const { results } = usePaginatedQuery(
    api.photos.listByCampfire,
    {
      campfireId: ctx.dashboard._id,
      status: photoTab,
    },
    { initialNumItems: 48 },
  )

  const runUpload = async () => {
    if (!selectedFile) {
      inputRef.current?.click()
      return
    }
    setUploadError(null)
    setUploading(true)
    try {
      await uploadPhoto({
        file: { blob: selectedFile, mimeType: selectedFile.type },
        campfireId: ctx.dashboard._id,
        generateUploadUrl,
        createPhoto,
      })
      setSelectedFile(null)
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null
          setSelectedFile(file)
          e.target.value = ''
        }}
      />
      <EventPhotosScreen
        slug={slug}
        campfires={ctx.campfires}
        dashboard={ctx.dashboard}
        photos={results}
        photoTab={photoTab}
        onPhotoTabChange={setPhotoTab}
        activeTab="photos"
        onNavigate={ctx.nav.onNavigate}
        onSwitchEvent={ctx.nav.onSwitchEvent}
        onSignOut={ctx.nav.onSignOut}
        onCreateCampfire={ctx.nav.onCreateCampfire}
        onViewAllEvents={ctx.nav.onViewAllEvents}
        eventSwitcher={ctx.eventSwitcher}
        uploading={uploading}
        uploadError={uploadError}
        fileInput={null}
        onUpload={() => {
          if (selectedFile) {
            void runUpload()
          } else {
            inputRef.current?.click()
          }
        }}
        onDownloadAll={() => {
          if (!downloads) {
            return
          }
          for (const item of downloads) {
            window.open(item.url, '_blank')
          }
        }}
        onApprove={(photo) => {
          void setPhotoStatus({ photoId: photo._id, status: 'published' })
        }}
        onHide={(photo) => {
          void setPhotoStatus({ photoId: photo._id, status: 'hidden' })
        }}
        onDelete={(photo) => {
          void removePhoto({ photoId: photo._id })
        }}
        onCreateTextPost={(body, background) => {
          void createTextPost({
            campfireId: ctx.dashboard._id,
            textBody: body,
            textBackground: background,
          })
        }}
      />
    </>
  )
}

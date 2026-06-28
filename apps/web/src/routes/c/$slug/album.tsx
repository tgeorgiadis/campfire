import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useConvexAuth, useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { useEffect, useState } from 'react'
import { api } from '@campfire/backend/convex/_generated/api'
import {
  AccessDeniedScreen,
  DigitalAlbumScreen,
  DigitalAlbumSkeleton,
} from '@campfire/ui'
import {
  getGuestToken,
  setGuestToken,
  uploadPhoto,
} from '@campfire/app-core'
import type { PhotoItem } from '@campfire/app-core'
import type { PublicCampfireSettings } from '~/lib/eventContext'
import { WebFileInput } from '~/lib/WebFileInput'
import {
  getGuestLikeKey,
  hasSeenWelcome,
  markWelcomeSeen,
} from '~/lib/eventWebUtils'

import { publicSettingsQuery } from '~/lib/eventQueries'

export const Route = createFileRoute('/c/$slug/album')({
  ssr: false,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(publicSettingsQuery(params.slug))
  },
  component: DigitalAlbum,
})

function DigitalAlbum() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useConvexAuth()
  const stateToken = location.state.guestToken

  useEffect(() => {
    if (stateToken) {
      setGuestToken(slug, stateToken)
    }
  }, [slug, stateToken])

  const guestToken = stateToken ?? getGuestToken(slug) ?? undefined

  const publicSettings = useQuery(api.campfires.getPublicSettings, {
    slug,
    guestToken,
  })

  if (publicSettings === undefined) {
    return <DigitalAlbumSkeleton />
  }

  if (publicSettings === null) {
    return <AccessDeniedScreen onHome={() => void navigate({ to: '/' })} />
  }

  return (
    <DigitalAlbumContent
      slug={slug}
      guestToken={guestToken}
      publicSettings={publicSettings}
      isAuthenticated={isAuthenticated}
      onSignIn={() => void navigate({ to: '/sign-in' })}
    />
  )
}

function DigitalAlbumContent({
  slug,
  guestToken,
  publicSettings,
  isAuthenticated,
  onSignIn,
}: {
  slug: string
  guestToken: string | undefined
  publicSettings: PublicCampfireSettings
  isAuthenticated: boolean
  onSignIn: () => void
}) {
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl)
  const createPhoto = useMutation(api.photos.create)
  const createComment = useMutation(api.comments.create)
  const toggleLike = useMutation(api.photos.toggleLike)

  const { results, status, loadMore } = usePaginatedQuery(
    api.photos.listByCampfire,
    publicSettings.canView
      ? {
          campfireId: publicSettings._id,
          guestToken,
          status: 'published' as const,
        }
      : 'skip',
    { initialNumItems: 12 },
  )

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [guestName, setGuestName] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null)
  const [commentBody, setCommentBody] = useState('')
  const [commentError, setCommentError] = useState<string | null>(null)
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [showWelcome, setShowWelcome] = useState(
    publicSettings.settings.welcomeScreenEnabled && !hasSeenWelcome(slug),
  )

  const comments = useQuery(
    api.comments.listByPhoto,
    selectedPhoto
      ? { photoId: selectedPhoto._id, guestToken }
      : 'skip',
  )

  const campfireView = {
    _id: publicSettings._id,
    name: publicSettings.name,
    slug: publicSettings.slug,
    visibility: 'private' as const,
    role: publicSettings.role,
    canView: publicSettings.canView,
    canUpload: publicSettings.canUpload,
    canComment: publicSettings.canComment,
    canManage: publicSettings.role !== null,
    isGuest: publicSettings.isGuest,
    photoCount: results.length,
    settings: publicSettings.settings,
  }

  return (
    <DigitalAlbumScreen
      campfire={campfireView}
      photos={results}
      canLoadMore={status === 'CanLoadMore'}
      onLoadMore={() => loadMore(12)}
      onSignIn={onSignIn}
      isAuthenticated={isAuthenticated}
      onUpload={async () => {
        if (!selectedFile) {
          setUploadError('Choose a photo to upload')
          throw new Error('No file')
        }
        setUploadError(null)
        setUploading(true)
        try {
          await uploadPhoto({
            file: { blob: selectedFile, mimeType: selectedFile.type },
            campfireId: publicSettings._id,
            guestToken,
            caption,
            guestName,
            generateUploadUrl,
            createPhoto,
          })
          setCaption('')
          setGuestName('')
          setSelectedFile(null)
        } catch (err: unknown) {
          setUploadError(err instanceof Error ? err.message : 'Upload failed')
          throw err
        } finally {
          setUploading(false)
        }
      }}
      uploadCaption={caption}
      onUploadCaptionChange={setCaption}
      uploadGuestName={guestName}
      onUploadGuestNameChange={setGuestName}
      uploading={uploading}
      uploadError={uploadError}
      fileInput={<WebFileInput accept="image/*,video/*" onFileSelected={setSelectedFile} />}
      selectedPhoto={selectedPhoto}
      onPhotoPress={setSelectedPhoto}
      onPhotoClose={() => {
        setSelectedPhoto(null)
        setCommentBody('')
        setCommentError(null)
      }}
      comments={comments}
      commentBody={commentBody}
      onCommentBodyChange={setCommentBody}
      commentSubmitting={commentSubmitting}
      commentError={commentError}
      onSubmitComment={() => {
        if (!selectedPhoto) {
          return
        }
        setCommentError(null)
        setCommentSubmitting(true)
        void createComment({
          photoId: selectedPhoto._id,
          body: commentBody,
          guestToken,
          guestName:
            publicSettings.isGuest && !isAuthenticated ? guestName : undefined,
        })
          .then(() => setCommentBody(''))
          .catch((err: unknown) => {
            setCommentError(err instanceof Error ? err.message : 'Comment failed')
          })
          .finally(() => setCommentSubmitting(false))
      }}
      onLike={(photo) => {
        void toggleLike({
          photoId: photo._id,
          guestToken,
          guestKey: getGuestLikeKey(slug),
        })
      }}
      showWelcome={showWelcome}
      welcomeTitle={
        publicSettings.settings.welcomeScreenTitle ?? `Welcome to ${publicSettings.name}`
      }
      welcomeMessage={
        publicSettings.settings.welcomeScreenMessage ??
        'Share your photos and memories from this event.'
      }
      onWelcomeDismiss={() => {
        markWelcomeSeen(slug)
        setShowWelcome(false)
      }}
      showBranding={!publicSettings.settings.removeBranding}
    />
  )
}

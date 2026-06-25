import { createFileRoute, useLocation, useNavigate } from '@tanstack/react-router'
import { useConvexAuth, useMutation, usePaginatedQuery, useQuery } from 'convex/react'
import { useEffect, useState } from 'react'
import { api } from '@campfire/backend/convex/_generated/api'
import {
  buildJoinUrl,
  getGuestToken,
  setGuestToken,
  uploadPhoto,
} from '@campfire/app-core'
import {
  AccessDeniedScreen,
  CampfireBoardScreen,
  LoadingScreen,
} from '@campfire/ui'
import type { CampfireView, PhotoItem } from '@campfire/app-core'
import { QrCanvas } from '~/lib/QrCanvas'
import { WebFileInput } from '~/lib/WebFileInput'

export const Route = createFileRoute('/c/$slug/')({
  ssr: false,
  component: CampfireBoard,
})

function CampfireBoard() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const stateToken = location.state.guestToken

  useEffect(() => {
    if (stateToken) {
      setGuestToken(slug, stateToken)
    }
  }, [slug, stateToken])

  const guestToken = stateToken ?? getGuestToken(slug) ?? undefined

  const campfire = useQuery(api.campfires.getBySlug, {
    slug,
    guestToken,
  })

  if (campfire === undefined) {
    return <LoadingScreen />
  }

  if (campfire === null) {
    return <AccessDeniedScreen onHome={() => void navigate({ to: '/' })} />
  }

  return (
    <CampfireBoardContainer slug={slug} guestToken={guestToken} campfire={campfire} />
  )
}

function CampfireBoardContainer({
  slug,
  guestToken,
  campfire,
}: {
  slug: string
  guestToken: string | undefined
  campfire: CampfireView
}) {
  const navigate = useNavigate()
  const { isAuthenticated } = useConvexAuth()
  const inviteMember = useMutation(api.campfires.inviteMember)
  const rotateGuestToken = useMutation(api.campfires.rotateGuestToken)
  const generateUploadUrl = useMutation(api.photos.generateUploadUrl)
  const createPhoto = useMutation(api.photos.create)
  const createComment = useMutation(api.comments.create)

  const { results, status, loadMore } = usePaginatedQuery(
    api.photos.listByCampfire,
    { campfireId: campfire._id, guestToken },
    { initialNumItems: 12 },
  )

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [guestName, setGuestName] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [settingsJoinUrl, setSettingsJoinUrl] = useState<string | undefined>()
  const [shareJoinUrl, setShareJoinUrl] = useState<string>('')
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null)
  const [commentBody, setCommentBody] = useState('')
  const [commentError, setCommentError] = useState<string | null>(null)
  const [commentSubmitting, setCommentSubmitting] = useState(false)

  const comments = useQuery(
    api.comments.listByPhoto,
    selectedPhoto
      ? { photoId: selectedPhoto._id, guestToken }
      : 'skip',
  )

  useEffect(() => {
    if (guestToken) {
      setShareJoinUrl(buildJoinUrl(slug, guestToken))
    }
  }, [slug, guestToken])

  return (
    <CampfireBoardScreen
      campfire={campfire}
      photos={results}
      canLoadMore={status === 'CanLoadMore'}
      onLoadMore={() => loadMore(12)}
      onHome={() => void navigate({ to: '/' })}
      onCreate={() => void navigate({ to: '/campfires/new' })}
      onProfile={() => void navigate({ to: '/profile' })}
      onSignIn={() => void navigate({ to: '/sign-in' })}
      isAuthenticated={isAuthenticated}
      joinUrl={shareJoinUrl}
      onInvite={() => {
        setInviteError(null)
        void inviteMember({ campfireId: campfire._id, email: inviteEmail })
          .then(() => setInviteEmail(''))
          .catch((err: unknown) => {
            setInviteError(err instanceof Error ? err.message : 'Invite failed')
          })
      }}
      onRotateToken={() => {
        void rotateGuestToken({ campfireId: campfire._id }).then((result) => {
          setGuestToken(slug, result.guestToken)
          const url = buildJoinUrl(slug, result.guestToken)
          setSettingsJoinUrl(url)
          setShareJoinUrl(url)
        })
      }}
      inviteEmail={inviteEmail}
      onInviteEmailChange={setInviteEmail}
      inviteError={inviteError}
      uploadCaption={caption}
      onUploadCaptionChange={setCaption}
      uploadGuestName={guestName}
      onUploadGuestNameChange={setGuestName}
      uploading={uploading}
      uploadError={uploadError}
      shareQrElement={
        shareJoinUrl ? <QrCanvas url={shareJoinUrl} size={200} /> : undefined
      }
      settingsQrElement={
        settingsJoinUrl ? <QrCanvas url={settingsJoinUrl} size={200} /> : undefined
      }
      settingsJoinUrl={settingsJoinUrl}
      fileInput={<WebFileInput onFileSelected={setSelectedFile} />}
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
          guestName: campfire.isGuest && !isAuthenticated ? guestName : undefined,
        })
          .then(() => setCommentBody(''))
          .catch((err: unknown) => {
            setCommentError(err instanceof Error ? err.message : 'Comment failed')
          })
          .finally(() => setCommentSubmitting(false))
      }}
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
            campfireId: campfire._id,
            guestToken,
            caption,
            guestName: campfire.isGuest ? guestName : undefined,
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
    />
  )
}

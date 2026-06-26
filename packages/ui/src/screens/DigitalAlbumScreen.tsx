import type { CampfireView, PhotoComment, PhotoItem } from '@campfire/app-core'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { WelcomeScreenModal } from '../components/EventComponents'
import { PhotoGrid } from '../components/PhotoGrid'
import { PhotoLightbox } from '../components/PhotoLightbox'
import { PrimaryButton } from '../components/PrimaryButton'
import { TextButton } from '../components/PrimaryButton'
import { UploadModal } from '../components/UploadModal'

export function DigitalAlbumScreen({
  campfire,
  photos,
  canLoadMore,
  onLoadMore,
  onSignIn,
  isAuthenticated,
  onUpload,
  uploadCaption,
  onUploadCaptionChange,
  uploadGuestName,
  onUploadGuestNameChange,
  uploading,
  uploadError,
  fileInput,
  selectedPhoto,
  onPhotoPress,
  onPhotoClose,
  comments,
  commentBody,
  onCommentBodyChange,
  commentSubmitting,
  commentError,
  onSubmitComment,
  onLike,
  showWelcome,
  welcomeTitle,
  welcomeMessage,
  onWelcomeDismiss,
  logoElement,
  showBranding,
}: {
  campfire: CampfireView
  photos: PhotoItem[]
  canLoadMore: boolean
  onLoadMore: () => void
  onSignIn: () => void
  isAuthenticated: boolean
  joinUrl?: string
  onUpload: () => Promise<void>
  uploadCaption: string
  onUploadCaptionChange: (value: string) => void
  uploadGuestName: string
  onUploadGuestNameChange: (value: string) => void
  uploading: boolean
  uploadError: string | null
  fileInput: ReactNode
  selectedPhoto: PhotoItem | null
  onPhotoPress: (photo: PhotoItem) => void
  onPhotoClose: () => void
  comments: PhotoComment[] | undefined
  commentBody: string
  onCommentBodyChange: (value: string) => void
  commentSubmitting: boolean
  commentError: string | null
  onSubmitComment: () => void
  onLike?: (photo: PhotoItem) => void
  showWelcome: boolean
  welcomeTitle: string
  welcomeMessage: string
  onWelcomeDismiss: () => void
  logoElement?: ReactNode
  showBranding: boolean
}) {
  const [uploadOpen, setUploadOpen] = useState(false)
  const themeColor = campfire.settings.themeColor

  return (
    <View className="min-h-screen bg-ig-page">
      <WelcomeScreenModal
        visible={showWelcome}
        title={welcomeTitle}
        message={welcomeMessage}
        onContinue={onWelcomeDismiss}
      />

      <View className="border-b border-ig-border bg-ig-surface px-4 py-4">
        <View className="max-w-[900px] w-full flex-row items-center justify-between gap-4">
          <View className="flex-row items-center gap-3">
            {logoElement}
            <Text className="text-xl font-bold text-ig-text">{campfire.name}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            {!isAuthenticated && !campfire.isGuest ? (
              <TextButton label="Sign in" onPress={onSignIn} />
            ) : null}
            {campfire.canUpload ? (
              <PrimaryButton label="Add photos" onPress={() => setUploadOpen(true)} />
            ) : null}
          </View>
        </View>
      </View>

      <View className="max-w-[900px] w-full px-4 py-6">
        {campfire.canView ? (
          <>
            <PhotoGrid photos={photos} onPhotoPress={onPhotoPress} />
            {canLoadMore && onLoadMore ? (
              <View className="py-4 items-center">
                <TextButton label="Load more" onPress={onLoadMore} />
              </View>
            ) : null}
          </>
        ) : (
          <View className="py-16 items-center gap-2">
            <Text className="text-lg text-ig-text">Upload-only access</Text>
            <Text className="text-sm text-ig-muted text-center">
              You can upload photos but not view the album.
            </Text>
            {campfire.canUpload ? (
              <PrimaryButton label="Upload photos" onPress={() => setUploadOpen(true)} />
            ) : null}
          </View>
        )}
      </View>

      {showBranding ? (
        <View className="py-4 items-center">
          <Text className="text-xs text-ig-muted" style={{ color: themeColor }}>
            Powered by Campfire
          </Text>
        </View>
      ) : null}

      <PhotoLightbox
        photo={selectedPhoto}
        onClose={onPhotoClose}
        comments={comments}
        canComment={campfire.canComment}
        showGuestName={campfire.isGuest && !isAuthenticated}
        commentGuestName={uploadGuestName}
        onCommentGuestNameChange={onUploadGuestNameChange}
        commentBody={commentBody}
        onCommentBodyChange={onCommentBodyChange}
        commentSubmitting={commentSubmitting}
        commentError={commentError}
        onSubmitComment={onSubmitComment}
        likeCount={selectedPhoto?.likeCount}
        onLike={
          onLike && selectedPhoto && !campfire.settings.disableLikes
            ? () => onLike(selectedPhoto)
            : undefined
        }
        disableDownload={campfire.settings.disableGuestDownload}
      />

      <UploadModal
        visible={uploadOpen}
        onClose={() => setUploadOpen(false)}
        caption={uploadCaption}
        onCaptionChange={onUploadCaptionChange}
        guestName={uploadGuestName}
        onGuestNameChange={onUploadGuestNameChange}
        showGuestName={campfire.isGuest && !isAuthenticated}
        uploading={uploading}
        error={uploadError}
        onSubmit={() => {
          void onUpload().then(() => setUploadOpen(false))
        }}
        fileInput={fileInput}
      />
    </View>
  )
}

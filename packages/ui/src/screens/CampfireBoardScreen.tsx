import type { CampfireView, PhotoComment, PhotoItem } from '@campfire/app-core'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { View } from 'react-native'
import { AppShell } from '../components/AppShell'
import { PhotoGrid } from '../components/PhotoGrid'
import { PhotoLightbox } from '../components/PhotoLightbox'
import { TextButton } from '../components/PrimaryButton'
import { ProfileHeader } from '../components/ProfileHeader'
import { SettingsModal } from '../components/SettingsModal'
import { ShareModal } from '../components/ShareModal'
import { UploadModal } from '../components/UploadModal'

export function CampfireBoardScreen({
  campfire,
  photos,
  canLoadMore,
  onLoadMore,
  onHome,
  onCreate,
  onProfile,
  onSignIn,
  isAuthenticated,
  joinUrl,
  onInvite,
  onRotateToken,
  onUpload,
  inviteEmail,
  onInviteEmailChange,
  inviteError,
  uploadCaption,
  onUploadCaptionChange,
  uploadGuestName,
  onUploadGuestNameChange,
  uploading,
  uploadError,
  shareQrElement,
  settingsQrElement,
  settingsJoinUrl,
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
}: {
  campfire: CampfireView
  photos: PhotoItem[]
  canLoadMore: boolean
  onLoadMore: () => void
  onHome: () => void
  onCreate: () => void
  onProfile: () => void
  onSignIn: () => void
  isAuthenticated: boolean
  joinUrl: string
  onInvite: () => void
  onRotateToken: () => void
  onUpload: () => Promise<void>
  inviteEmail: string
  onInviteEmailChange: (value: string) => void
  inviteError: string | null
  uploadCaption: string
  onUploadCaptionChange: (value: string) => void
  uploadGuestName: string
  onUploadGuestNameChange: (value: string) => void
  uploading: boolean
  uploadError: string | null
  shareQrElement?: ReactNode
  settingsQrElement?: ReactNode
  settingsJoinUrl?: string
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
}) {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const roleLabel = campfire.role
    ? campfire.role
    : campfire.isGuest
      ? 'guest'
      : 'viewer'

  return (
    <AppShell activeTab="home" onHome={onHome} onCreate={onCreate} onProfile={onProfile}>
      <ProfileHeader
        name={campfire.name}
        photoCount={campfire.photoCount}
        visibility={campfire.visibility}
        roleLabel={roleLabel}
        canUpload={campfire.canUpload}
        isOwner={campfire.role === 'owner'}
        onUpload={() => setUploadOpen(true)}
        onShare={() => setShareOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        showSignIn={!isAuthenticated && !campfire.isGuest}
        onSignIn={onSignIn}
      />
      <PhotoGrid photos={photos} onPhotoPress={onPhotoPress} />
      {canLoadMore ? (
        <View className="py-4 items-center">
          <TextButton label="Load more" onPress={onLoadMore} />
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

      <ShareModal
        visible={shareOpen}
        onClose={() => setShareOpen(false)}
        joinUrl={joinUrl}
        qrElement={shareQrElement}
      />

      {campfire.role === 'owner' ? (
        <SettingsModal
          visible={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          inviteEmail={inviteEmail}
          onInviteEmailChange={onInviteEmailChange}
          inviteError={inviteError}
          onInvite={onInvite}
          onRotateToken={onRotateToken}
          qrElement={settingsQrElement}
          joinUrl={settingsJoinUrl}
        />
      ) : null}
    </AppShell>
  )
}

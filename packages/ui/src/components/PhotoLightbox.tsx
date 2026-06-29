import type { PhotoComment, PhotoItem } from '@campfire/app-core'
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { focusRing, linkHover, pressableBase } from './motion/motionClasses'
import { PrimaryButton } from './PrimaryButton'
import { TextField } from './TextField'

function formatCommentTime(createdAt: number): string {
  const date = new Date(createdAt)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function PhotoLightbox({
  photo,
  onClose,
  comments,
  canComment,
  showGuestName,
  commentGuestName,
  onCommentGuestNameChange,
  commentBody,
  onCommentBodyChange,
  commentSubmitting,
  commentError,
  onSubmitComment,
  likeCount,
  onLike,
  disableDownload,
}: {
  photo: PhotoItem | null
  onClose: () => void
  comments: PhotoComment[] | undefined
  canComment: boolean
  showGuestName: boolean
  commentGuestName: string
  onCommentGuestNameChange: (value: string) => void
  commentBody: string
  onCommentBodyChange: (value: string) => void
  commentSubmitting: boolean
  commentError: string | null
  onSubmitComment: () => void
  likeCount?: number
  onLike?: () => void
  disableDownload?: boolean
}) {
  return (
    <Modal
      visible={photo !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/90 items-center justify-center p-4"
        onPress={onClose}
      >
        {photo ? (
          <Pressable
            className="w-full max-w-lg max-h-[90vh] rounded-sm overflow-hidden bg-black/40"
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView className="max-h-[90vh]" keyboardShouldPersistTaps="handled">
              <View className="gap-4 p-4">
                {photo.url ? (
                  <Image
                    source={{ uri: photo.url }}
                    className="w-full aspect-square rounded-sm"
                    resizeMode="contain"
                    accessibilityLabel={photo.caption ?? 'Campfire photo'}
                  />
                ) : null}
                {photo.caption ? (
                  <Text className="text-white text-sm text-center">{photo.caption}</Text>
                ) : null}
                <View className="flex-row items-center justify-center gap-4">
                  {likeCount !== undefined && likeCount > 0 ? (
                    <Text className="text-white/80 text-sm">{likeCount} likes</Text>
                  ) : null}
                  {onLike ? (
                    <Pressable
                      onPress={onLike}
                      className={`rounded px-2 py-1 ${pressableBase} ${focusRing} ${linkHover}`}
                    >
                      <Text className="text-cf-accent text-sm font-semibold">Like</Text>
                    </Pressable>
                  ) : null}
                  {!disableDownload && photo.url ? (
                    <Pressable
                      onPress={() => {
                        if (photo.url) {
                          window.open(photo.url, '_blank')
                        }
                      }}
                      className={`rounded px-2 py-1 ${pressableBase} ${focusRing} hover:opacity-80 active:opacity-70`}
                    >
                      <Text className="text-white text-sm underline">Download</Text>
                    </Pressable>
                  ) : null}
                </View>
                {photo.uploaderGuestName ? (
                  <Text className="text-white/70 text-xs text-center">
                    by {photo.uploaderGuestName}
                  </Text>
                ) : null}

                <View className="gap-3 border-t border-white/20 pt-4">
                  <Text className="text-white text-sm font-semibold">Comments</Text>
                  {comments === undefined ? (
                    <Text className="text-white/60 text-sm">Loading comments…</Text>
                  ) : comments.length === 0 ? (
                    <Text className="text-white/60 text-sm">No comments yet.</Text>
                  ) : (
                    comments.map((comment) => (
                      <View key={comment._id} className="gap-0.5">
                        <View className="flex-row items-baseline gap-2">
                          <Text className="text-white text-sm font-semibold">
                            {comment.authorName}
                          </Text>
                          <Text className="text-white/50 text-xs">
                            {formatCommentTime(comment.createdAt)}
                          </Text>
                        </View>
                        <Text className="text-white/90 text-sm">{comment.body}</Text>
                      </View>
                    ))
                  )}

                  {canComment ? (
                    <View className="gap-3 pt-2">
                      {showGuestName ? (
                        <TextField
                          label="Your name"
                          value={commentGuestName}
                          onChangeText={onCommentGuestNameChange}
                          placeholder="Guest name"
                          autoCapitalize="words"
                        />
                      ) : null}
                      <TextField
                        label="Add a comment"
                        value={commentBody}
                        onChangeText={onCommentBodyChange}
                        placeholder="Write a comment..."
                        autoCapitalize="sentences"
                      />
                      {commentError ? (
                        <Text className="text-sm text-ig-red">{commentError}</Text>
                      ) : null}
                      <PrimaryButton
                        label={commentSubmitting ? 'Posting…' : 'Post comment'}
                        onPress={onSubmitComment}
                        disabled={commentSubmitting}
                      />
                    </View>
                  ) : (
                    <Text className="text-white/50 text-xs pt-1">
                      Sign in or scan the QR code to comment.
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </Pressable>
        ) : null}
        <Pressable
          onPress={onClose}
          className={`absolute top-8 right-8 rounded-full px-3 py-1 ${pressableBase} ${focusRing} hover:bg-white/10 active:bg-white/20`}
        >
          <Text className="text-white text-3xl leading-none">×</Text>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

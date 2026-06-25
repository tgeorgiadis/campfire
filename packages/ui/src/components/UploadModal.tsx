import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { ModalFrame } from './ModalFrame'
import { PrimaryButton } from './PrimaryButton'
import { TextField } from './TextField'

export function UploadModal({
  visible,
  onClose,
  caption,
  onCaptionChange,
  guestName,
  onGuestNameChange,
  showGuestName,
  uploading,
  error,
  onSubmit,
  fileInput,
}: {
  visible: boolean
  onClose: () => void
  caption: string
  onCaptionChange: (value: string) => void
  guestName: string
  onGuestNameChange: (value: string) => void
  showGuestName: boolean
  uploading: boolean
  error: string | null
  onSubmit: () => void
  fileInput: ReactNode
}) {
  return (
    <ModalFrame visible={visible} onClose={onClose} title="New post">
      <View className="gap-3">
        {showGuestName ? (
          <TextField
            label="Your name (optional)"
            value={guestName}
            onChangeText={onGuestNameChange}
            placeholder="Guest name"
          />
        ) : null}
        <TextField
          label="Caption (optional)"
          value={caption}
          onChangeText={onCaptionChange}
          placeholder="Write a caption..."
        />
        <View className="gap-1">
          <Text className="text-xs text-ig-muted font-medium">Photo</Text>
          {fileInput}
        </View>
        {error ? <Text className="text-sm text-ig-red">{error}</Text> : null}
        <PrimaryButton
          label={uploading ? 'Uploading…' : 'Share'}
          onPress={onSubmit}
          disabled={uploading}
        />
      </View>
    </ModalFrame>
  )
}

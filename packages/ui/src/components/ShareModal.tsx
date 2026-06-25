import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { ModalFrame } from './ModalFrame'
import { PrimaryButton } from './PrimaryButton'
import { TextField } from './TextField'

export function ShareModal({
  visible,
  onClose,
  joinUrl,
  qrElement,
}: {
  visible: boolean
  onClose: () => void
  joinUrl: string
  qrElement?: ReactNode
}) {
  return (
    <ModalFrame visible={visible} onClose={onClose} title="Share campfire">
      <View className="gap-4 items-center">
        <Text className="text-sm text-ig-muted text-center">
          {joinUrl
            ? 'Share this QR code or link so guests can view and upload photos.'
            : 'Generate a guest QR code in Settings to share access.'}
        </Text>
        {joinUrl ? qrElement : null}
        {joinUrl ? (
          <TextField value={joinUrl} onChangeText={() => {}} editable={false} />
        ) : null}
        <PrimaryButton label="Done" onPress={onClose} />
      </View>
    </ModalFrame>
  )
}

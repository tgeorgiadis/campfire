import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { ModalFrame } from './ModalFrame'
import { PrimaryButton, TextButton } from './PrimaryButton'
import { TextField } from './TextField'

export function SettingsModal({
  visible,
  onClose,
  inviteEmail,
  onInviteEmailChange,
  inviteError,
  onInvite,
  onRotateToken,
  qrElement,
  joinUrl,
}: {
  visible: boolean
  onClose: () => void
  inviteEmail: string
  onInviteEmailChange: (value: string) => void
  inviteError: string | null
  onInvite: () => void
  onRotateToken: () => void
  qrElement?: ReactNode
  joinUrl?: string
}) {
  return (
    <ModalFrame visible={visible} onClose={onClose} title="Campfire settings">
      <View className="gap-4">
        <View className="gap-2">
          <Text className="text-sm font-semibold text-ig-text">Invite member</Text>
          <TextField
            value={inviteEmail}
            onChangeText={onInviteEmailChange}
            placeholder="Email address"
            autoCapitalize="none"
          />
          {inviteError ? <Text className="text-sm text-ig-red">{inviteError}</Text> : null}
          <PrimaryButton label="Send invite" onPress={onInvite} variant="secondary" />
        </View>
        <View className="gap-2 border-t border-ig-border pt-4">
          <Text className="text-sm font-semibold text-ig-text">Guest access</Text>
          <TextButton label="Generate new QR code" onPress={onRotateToken} />
          {qrElement}
          {joinUrl ? (
            <TextField value={joinUrl} onChangeText={() => {}} editable={false} />
          ) : null}
        </View>
      </View>
    </ModalFrame>
  )
}

import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { AppShell } from '../components/AppShell'
import { CampfireLogo } from '../components/CampfireLogo'
import { PrimaryButton, TextButton } from '../components/PrimaryButton'
import { SelectablePill } from '../components/SelectablePill'
import { TextField } from '../components/TextField'

export function CreateCampfireScreen({
  name,
  onNameChange,
  visibility,
  onVisibilityChange,
  error,
  onSubmit,
  onHome,
  onCreate,
  onProfile,
  created,
  joinUrl,
  qrElement,
  onOpenBoard,
}: {
  name: string
  onNameChange: (value: string) => void
  visibility: 'public' | 'private'
  onVisibilityChange: (value: 'public' | 'private') => void
  error: string | null
  onSubmit: () => void
  onHome: () => void
  onCreate: () => void
  onProfile: () => void
  created: boolean
  joinUrl: string
  qrElement?: ReactNode
  onOpenBoard: () => void
}) {
  if (created) {
    return (
      <AppShell activeTab="create" onHome={onHome} onCreate={onCreate} onProfile={onProfile}>
        <View className="px-4 py-8 gap-6 max-w-[350px] w-full items-center">
          <CampfireLogo size="md" layout="stacked" />
          <Text className="text-2xl font-semibold text-ig-text text-center">
            Campfire created
          </Text>
          <Text className="text-sm text-ig-muted text-center">
            Share this QR code or link so guests can view and upload photos.
          </Text>
          {qrElement}
          <View className="w-full">
            <TextField value={joinUrl} onChangeText={() => {}} editable={false} />
          </View>
          <PrimaryButton label="Open campfire" onPress={onOpenBoard} />
        </View>
      </AppShell>
    )
  }

  return (
    <AppShell activeTab="create" onHome={onHome} onCreate={onCreate} onProfile={onProfile}>
      <View className="px-4 py-8 gap-6 max-w-[350px] w-full">
        <Text className="text-2xl font-semibold text-ig-text">Create campfire</Text>
        <TextField
          label="Name"
          value={name}
          onChangeText={onNameChange}
          placeholder="Summer BBQ 2026"
        />
        <View className="gap-2">
          <Text className="text-xs text-ig-muted font-medium">Visibility</Text>
          <View className="flex-row gap-2">
            <SelectablePill
              label="Private"
              selected={visibility === 'private'}
              onPress={() => onVisibilityChange('private')}
              className="flex-1 items-center"
            />
            <SelectablePill
              label="Public"
              selected={visibility === 'public'}
              onPress={() => onVisibilityChange('public')}
              className="flex-1 items-center"
            />
          </View>
        </View>
        {error ? <Text className="text-sm text-ig-red">{error}</Text> : null}
        <PrimaryButton label="Create" onPress={onSubmit} />
        <TextButton label="← Back to home" onPress={onHome} />
      </View>
    </AppShell>
  )
}

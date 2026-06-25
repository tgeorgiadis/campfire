import { Pressable, Text, View } from 'react-native'
import { AppShell } from '../components/AppShell'
import { PrimaryButton, TextButton } from '../components/PrimaryButton'
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
        <View className="px-4 py-8 gap-6 max-w-[350px] mx-auto w-full items-center">
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
          <PrimaryButton label="View board" onPress={onOpenBoard} />
        </View>
      </AppShell>
    )
  }

  return (
    <AppShell activeTab="create" onHome={onHome} onCreate={onCreate} onProfile={onProfile}>
      <View className="px-4 py-8 gap-6 max-w-[350px] mx-auto w-full">
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
            <VisibilityPill
              label="Private"
              selected={visibility === 'private'}
              onPress={() => onVisibilityChange('private')}
            />
            <VisibilityPill
              label="Public"
              selected={visibility === 'public'}
              onPress={() => onVisibilityChange('public')}
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

function VisibilityPill({
  label,
  selected,
  onPress,
}: {
  label: string
  selected: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 py-2 rounded-lg border items-center ${
        selected ? 'border-ig-text bg-ig-text' : 'border-ig-border bg-ig-surface'
      }`}
    >
      <Text
        className={`text-sm font-semibold ${selected ? 'text-white' : 'text-ig-text'}`}
      >
        {label}
      </Text>
    </Pressable>
  )
}

import type { ReactNode } from 'react'
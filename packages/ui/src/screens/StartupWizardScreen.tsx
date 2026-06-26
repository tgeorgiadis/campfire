import { Pressable, Text, View } from 'react-native'
import { CampfireLogo } from '../components/CampfireLogo'
import { PrimaryButton } from '../components/PrimaryButton'
import { TextField } from '../components/TextField'

export function StartupWizardScreen({
  name,
  onNameChange,
  visibility,
  onVisibilityChange,
  error,
  submitting,
  onSubmit,
}: {
  name: string
  onNameChange: (value: string) => void
  visibility: 'public' | 'private'
  onVisibilityChange: (value: 'public' | 'private') => void
  error: string | null
  submitting?: boolean
  onSubmit: () => void
}) {
  return (
    <View className="min-h-screen bg-ig-page items-start p-6 pt-12">
      <View className="w-full max-w-[420px] gap-6 border border-ig-border bg-ig-surface rounded-xl p-8">
        <View className="items-center gap-3">
          <CampfireLogo size="lg" />
          <Text className="text-2xl font-semibold text-ig-text text-center">
            Create your first campfire
          </Text>
          <Text className="text-sm text-ig-muted text-center">
            Name your event to get a shareable album and photo wall for guests.
          </Text>
        </View>

        <TextField
          label="Event name"
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

        <PrimaryButton
          label={submitting ? 'Creating…' : 'Create campfire'}
          onPress={onSubmit}
        />
      </View>
    </View>
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

import { Text, View } from 'react-native'
import { SelectablePill } from '../components/SelectablePill'
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
          <CampfireLogo size="lg" layout="stacked" />
          <Text className="text-2xl font-semibold text-ig-text text-center">
            Create your first campfire
          </Text>
          <Text className="text-sm text-ig-muted text-center">
            Name your gathering — we&apos;ll give you a link and QR so everyone can add photos.
          </Text>
        </View>

        <TextField
          label="Campfire name"
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

        <PrimaryButton
          label={submitting ? 'Creating…' : 'Create campfire'}
          onPress={onSubmit}
        />
      </View>
    </View>
  )
}

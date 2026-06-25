import { Text, View } from 'react-native'
import { AppShell } from '../components/AppShell'
import { PrimaryButton } from '../components/PrimaryButton'

export function ProfileScreen({
  onHome,
  onCreate,
  onSignOut,
}: {
  onHome: () => void
  onCreate: () => void
  onSignOut: () => void
}) {
  return (
    <AppShell
      activeTab="profile"
      onHome={onHome}
      onCreate={onCreate}
      onProfile={() => {}}
    >
      <View className="px-4 py-6 gap-6">
        <Text className="text-2xl font-semibold text-ig-text">Profile</Text>
        <View className="border border-ig-border rounded-lg bg-ig-surface p-4 gap-4">
          <Text className="text-sm text-ig-muted">
            Manage your Campfire account.
          </Text>
          <PrimaryButton label="Log out" onPress={onSignOut} variant="secondary" />
        </View>
      </View>
    </AppShell>
  )
}

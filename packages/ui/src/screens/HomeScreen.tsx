import type { CampfireSummary } from '@campfire/app-core'
import { Pressable, Text, View } from 'react-native'
import { AppShell } from '../components/AppShell'
import { PrimaryButton } from '../components/PrimaryButton'

export function HomeLoggedOutScreen({
  onSignIn,
}: {
  onSignIn: () => void
}) {
  return (
    <View className="min-h-screen bg-ig-page items-center justify-center p-8 gap-6">
      <Text className="text-5xl font-bold text-ig-text tracking-tight">Campfire</Text>
      <Text className="text-base text-ig-muted text-center max-w-sm">
        Shared photo boards for events. Sign in to create a campfire or open a board from a
        guest link.
      </Text>
      <PrimaryButton label="Sign in" onPress={onSignIn} />
    </View>
  )
}

export function HomeScreen({
  campfires,
  onOpenCampfire,
  onCreate,
  onHome,
  onProfile,
}: {
  campfires: CampfireSummary[]
  onOpenCampfire: (slug: string) => void
  onCreate: () => void
  onHome: () => void
  onProfile: () => void
}) {
  return (
    <AppShell activeTab="home" onHome={onHome} onCreate={onCreate} onProfile={onProfile}>
      <View className="px-4 py-6 gap-6">
        <Text className="text-2xl font-semibold text-ig-text">Your campfires</Text>
        {campfires.length === 0 ? (
          <View className="py-12 items-center gap-3 border border-ig-border rounded-lg bg-ig-surface">
            <Text className="text-xl font-light text-ig-text">No campfires yet</Text>
            <Text className="text-sm text-ig-muted text-center px-6">
              Create one to get a shareable QR code for guests.
            </Text>
            <PrimaryButton label="Create campfire" onPress={onCreate} />
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {campfires.map((campfire) => (
              <Pressable
                key={campfire._id}
                onPress={() => onOpenCampfire(campfire.slug)}
                className="w-full md:w-[calc(50%-6px)] border border-ig-border rounded-lg bg-ig-surface p-4 gap-2"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-ig-text">{campfire.name}</Text>
                  <Text className="text-xs uppercase text-ig-muted tracking-wide">
                    {campfire.visibility}
                  </Text>
                </View>
                <Text className="text-sm text-ig-muted">/{campfire.slug} · {campfire.role}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </AppShell>
  )
}

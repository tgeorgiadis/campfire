import { Text, View } from 'react-native'
import { CampfireLogo } from '../components/CampfireLogo'
import { PrimaryButton } from '../components/PrimaryButton'

export function NotFoundScreen({
  onHome,
}: {
  onHome: () => void
}) {
  return (
    <View className="min-h-screen bg-ig-page items-center justify-center p-8 gap-6 font-sans">
      <CampfireLogo size="lg" />
      <View className="items-center gap-2 max-w-sm">
        <Text className="text-2xl font-bold text-ig-text text-center">Page not found</Text>
        <Text className="text-sm text-ig-muted text-center">
          This page doesn&apos;t exist. Head back home or open a campfire from your guest link.
        </Text>
      </View>
      <PrimaryButton label="Back to home" onPress={onHome} />
    </View>
  )
}

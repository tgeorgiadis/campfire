import { Text, View } from 'react-native'
import { CampfireLogo } from '../components/CampfireLogo'
import { PrimaryButton } from '../components/PrimaryButton'

export function HomeLoggedOutScreen({
  onSignIn,
}: {
  onSignIn: () => void
}) {
  return (
    <View className="min-h-screen bg-ig-page items-center justify-center p-8 gap-6">
      <CampfireLogo size="lg" />
      <Text className="text-base text-ig-muted text-center max-w-sm">
        Shared photo boards for events. Sign in to create a campfire or open a board from a
        guest link.
      </Text>
      <PrimaryButton label="Sign in" onPress={onSignIn} />
    </View>
  )
}

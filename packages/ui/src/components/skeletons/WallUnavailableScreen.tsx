import { Text, View } from 'react-native'
import { PrimaryButton } from '../PrimaryButton'

export function WallUnavailableScreen({
  onHome,
}: {
  onHome?: () => void
}) {
  return (
    <View className="min-h-screen bg-black items-center justify-center p-8 gap-4">
      <Text className="text-xl font-semibold text-white text-center">
        Photo wall unavailable
      </Text>
      <Text className="text-sm text-white/70 text-center max-w-sm">
        This campfire could not be loaded. Check the link or ask the host for access.
      </Text>
      {onHome ? (
        <PrimaryButton label="Back to home" onPress={onHome} />
      ) : null}
    </View>
  )
}

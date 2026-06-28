import { View } from 'react-native'
import { SkeletonBlock } from './SkeletonBlock'

export function PhotoWallSkeleton() {
  return (
    <View className="min-h-screen bg-black items-center justify-center p-8">
      <View className="w-full max-w-4xl aspect-video items-center justify-center gap-6">
        <SkeletonBlock className="w-full h-full max-h-[70vh] rounded-lg bg-cf-charcoal opacity-60" />
        <SkeletonBlock className="h-4 w-48 bg-cf-charcoal opacity-60" />
      </View>
    </View>
  )
}

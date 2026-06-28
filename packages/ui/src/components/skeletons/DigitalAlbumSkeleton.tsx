import { View } from 'react-native'
import { SkeletonBlock } from './SkeletonBlock'

export function DigitalAlbumSkeleton() {
  return (
    <View className="min-h-screen bg-ig-page">
      <View className="border-b border-ig-border bg-ig-surface px-4 py-4">
        <View className="max-w-[900px] w-full flex-row items-center justify-between gap-4">
          <View className="flex-row items-center gap-3 flex-1">
            <SkeletonBlock className="w-10 h-10 rounded-full" />
            <SkeletonBlock className="h-6 w-40" />
          </View>
          <SkeletonBlock className="h-9 w-28 rounded-lg" />
        </View>
      </View>

      <View className="max-w-[900px] w-full px-4 py-6">
        <View className="flex-row flex-wrap">
          {Array.from({ length: 9 }).map((_, index) => (
            <View
              key={index}
              className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 p-[0.5px]"
            >
              <SkeletonBlock className="w-full aspect-square" />
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

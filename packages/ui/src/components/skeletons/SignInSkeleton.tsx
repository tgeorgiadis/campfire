import { View } from 'react-native'
import { CampfireLogo } from '../CampfireLogo'
import { SkeletonBlock } from './SkeletonBlock'

function FlameGridVisual() {
  return (
    <View className="gap-4 items-center">
      <View className="flex-row flex-wrap w-64 gap-1">
        {Array.from({ length: 9 }).map((_, index) => (
          <View
            key={index}
            className="w-[84px] h-[84px] bg-cf-flame-orange rounded-sm opacity-80"
          />
        ))}
      </View>
      <SkeletonBlock className="h-6 w-48" />
      <SkeletonBlock className="h-4 w-36" />
    </View>
  )
}

export function SignInSkeleton() {
  return (
    <View className="min-h-screen bg-ig-page flex-row font-sans">
      <View className="hidden lg:flex flex-1 items-center justify-center bg-ig-surface border-r border-ig-border">
        <FlameGridVisual />
      </View>

      <View className="flex-1 items-center justify-center p-8">
        <View className="w-full max-w-[350px] gap-6">
          <View className="items-center gap-2 mb-2">
            <CampfireLogo size="lg" />
            <SkeletonBlock className="h-4 w-52" />
          </View>
          <View className="border border-ig-border bg-ig-surface rounded-lg p-8 gap-4">
            <SkeletonBlock className="h-6 w-24 self-center" />
            <View className="gap-2">
              <SkeletonBlock className="h-3 w-12" />
              <SkeletonBlock className="h-10 w-full rounded-lg" />
            </View>
            <View className="gap-2">
              <SkeletonBlock className="h-3 w-16" />
              <SkeletonBlock className="h-10 w-full rounded-lg" />
            </View>
            <SkeletonBlock className="h-10 w-full rounded-lg" />
          </View>
        </View>
      </View>
    </View>
  )
}

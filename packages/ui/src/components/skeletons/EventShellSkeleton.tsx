import type { ReactNode } from 'react'
import { View } from 'react-native'
import { CampfireLogo } from '../CampfireLogo'
import { SkeletonBlock } from './SkeletonBlock'

export function EventShellSkeleton({
  contentSkeleton,
}: {
  contentSkeleton?: ReactNode
}) {
  return (
    <View className="flex-1 min-h-screen bg-ig-page font-sans">
      <View className="flex-1 flex-row w-full">
        <View className="hidden md:flex w-[260px] shrink-0 border-r border-ig-border bg-ig-surface px-4 py-6 fixed left-0 top-0 bottom-0 z-10">
          <View className="px-2 mb-6">
            <CampfireLogo size="sm" />
          </View>
          <View className="px-2 mb-4 gap-2">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-10 w-full" />
          </View>
          <View className="gap-2 flex-1 px-2">
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-full" />
            <SkeletonBlock className="h-10 w-full" />
          </View>
          <View className="border-t border-ig-border pt-4 px-2 gap-2">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonBlock className="h-3 w-32" />
          </View>
        </View>

        <View className="flex-1 w-full md:ml-[260px] pb-16 md:pb-0">
          <View className="md:hidden border-b border-ig-border bg-ig-surface px-4 py-3 gap-2">
            <CampfireLogo size="sm" />
            <SkeletonBlock className="h-10 w-full" />
          </View>
          <View className="max-w-[1100px] w-full px-4 py-6">
            {contentSkeleton ?? <EventHomeContentSkeleton />}
          </View>
        </View>
      </View>

      <View className="md:hidden fixed bottom-0 left-0 right-0 h-[52px] border-t border-ig-border bg-ig-surface flex-row items-center justify-around z-20">
        <SkeletonBlock className="h-4 w-12" />
        <SkeletonBlock className="h-4 w-12" />
        <SkeletonBlock className="h-4 w-16" />
      </View>
    </View>
  )
}

export function EventHomeContentSkeleton() {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <SkeletonBlock className="h-9 w-64" />
        <SkeletonBlock className="h-4 w-full max-w-md" />
      </View>
      <SkeletonBlock className="h-48 w-full" />
      <SkeletonBlock className="h-40 w-full" />
    </View>
  )
}

export function EventPhotosContentSkeleton() {
  return (
    <View className="gap-6">
      <SkeletonBlock className="h-44 w-full" />
      <View className="flex-row gap-2">
        <SkeletonBlock className="h-8 w-28" />
        <SkeletonBlock className="h-8 w-24" />
        <SkeletonBlock className="h-8 w-20" />
      </View>
      <View className="flex-row flex-wrap gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonBlock key={i} className="w-[120px] h-[120px]" />
        ))}
      </View>
    </View>
  )
}

export function EventSettingsContentSkeleton() {
  return (
    <View className="gap-6">
      <View className="flex-row flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-8 w-24" />
        ))}
      </View>
      <View className="gap-4 max-w-xl">
        <SkeletonBlock className="h-10 w-full" />
        <SkeletonBlock className="h-10 w-full" />
        <SkeletonBlock className="h-10 w-32" />
      </View>
    </View>
  )
}

export function EventListContentSkeleton() {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <SkeletonBlock className="h-9 w-40" />
        <SkeletonBlock className="h-4 w-72" />
      </View>
      <SkeletonBlock className="h-10 w-48" />
      <View className="flex-row flex-wrap gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-36 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]" />
        ))}
      </View>
    </View>
  )
}

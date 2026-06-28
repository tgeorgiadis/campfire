import { View } from 'react-native'

export function SkeletonBlock({
  className,
}: {
  className?: string
}) {
  return <View className={`bg-ig-border rounded-lg opacity-60 ${className ?? ''}`} />
}

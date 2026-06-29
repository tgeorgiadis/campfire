import { View } from 'react-native'

/** Legacy 3×3 tile grid used in auth promo (gradient) and marketing (flat). */
export function LegacyFlameGrid({
  variant = 'gradient',
  compact,
}: {
  variant?: 'gradient' | 'flat'
  compact?: boolean
}) {
  const tileClass =
    variant === 'gradient'
      ? 'bg-gradient-to-br from-cf-flame-yellow via-cf-flame-orange to-cf-flame-red rounded-sm opacity-80'
      : 'bg-cf-flame-orange rounded-sm opacity-80'
  const tileSize = compact ? 'w-10 h-10' : 'w-[84px] h-[84px]'
  const gridWidth = compact ? 'w-32' : 'w-64'

  return (
    <View className={`flex-row flex-wrap ${gridWidth} gap-1`}>
      {Array.from({ length: 9 }).map((_, index) => (
        <View key={index} className={`${tileSize} ${tileClass}`} />
      ))}
    </View>
  )
}

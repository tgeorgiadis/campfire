import { Text, View } from 'react-native'
import { CampfireMark, type CampfireMarkSize } from './brand/CampfireMark'

export type CampfireLogoTheme = 'light' | 'dark'
export type CampfireLogoSize = 'sm' | 'md' | 'lg'
export type CampfireLogoLayout = 'horizontal' | 'stacked' | 'wordmark' | 'mark'

const TEXT = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
} as const

const MARK_SIZE: Record<CampfireLogoSize, CampfireMarkSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

export function CampfireLogo({
  theme = 'light',
  size = 'md',
  layout = 'horizontal',
}: {
  theme?: CampfireLogoTheme
  size?: CampfireLogoSize
  layout?: CampfireLogoLayout
}) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-ig-text'
  const textClass = `${TEXT[size]} font-bold ${textColor} tracking-tight`

  if (layout === 'mark') {
    return <CampfireMark size={MARK_SIZE[size]} />
  }

  if (layout === 'wordmark') {
    return (
      <Text className={textClass} accessibilityRole="header">
        Campfire
      </Text>
    )
  }

  const mark = <CampfireMark size={MARK_SIZE[size]} />

  if (layout === 'stacked') {
    return (
      <View className="items-center gap-1.5" accessibilityRole="header">
        {mark}
        <Text className={textClass}>Campfire</Text>
      </View>
    )
  }

  return (
    <View className="flex-row items-center gap-2" accessibilityRole="header">
      {mark}
      <Text className={textClass}>Campfire</Text>
    </View>
  )
}

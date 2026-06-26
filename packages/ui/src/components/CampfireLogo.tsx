import { Text } from 'react-native'

export type CampfireLogoTheme = 'light' | 'dark'
export type CampfireLogoSize = 'sm' | 'md' | 'lg'

const TEXT = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-4xl',
} as const

export function CampfireLogo({
  theme = 'light',
  size = 'md',
}: {
  theme?: CampfireLogoTheme
  size?: CampfireLogoSize
}) {
  const textColor = theme === 'dark' ? 'text-white' : 'text-ig-text'
  const textClass = `${TEXT[size]} font-bold ${textColor} tracking-tight`

  return (
    <Text className={textClass} accessibilityRole="header">
      Campfire
    </Text>
  )
}

import { Text, View } from 'react-native'
import {
  CampfireLogo,
  type CampfireLogoLayout,
  type CampfireLogoSize,
  type CampfireLogoTheme,
} from '../CampfireLogo'

export type CampfireLogoLockupVariant = 'wordmark' | 'horizontal' | 'stacked' | 'badge'

const VARIANT_LABELS: Record<CampfireLogoLockupVariant, string> = {
  wordmark: 'Wordmark only',
  horizontal: 'Mark + wordmark',
  stacked: 'Stacked lockup',
  badge: 'Circle badge',
}

const LAYOUT: Record<CampfireLogoLockupVariant, CampfireLogoLayout> = {
  wordmark: 'wordmark',
  horizontal: 'horizontal',
  stacked: 'stacked',
  badge: 'horizontal',
}

export function CampfireLogoLockup({
  variant = 'horizontal',
  theme = 'light',
  size = 'md',
  showLabel,
}: {
  variant?: CampfireLogoLockupVariant
  theme?: CampfireLogoTheme
  size?: CampfireLogoSize
  showLabel?: boolean
}) {
  const mutedColor = theme === 'dark' ? 'text-white/70' : 'text-ig-muted'

  if (variant === 'badge') {
    const badgeSize = size === 'lg' ? 56 : size === 'sm' ? 36 : 44
    return (
      <View className="gap-2 items-start">
        <View className="flex-row items-center gap-3">
          <View
            className={`items-center justify-center rounded-full border ${
              theme === 'dark'
                ? 'border-white/20 bg-white/10'
                : 'border-cf-card-border bg-cf-accent-light'
            }`}
            style={{ width: badgeSize, height: badgeSize }}
          >
            <CampfireLogo theme={theme} size={size} layout="mark" />
          </View>
          <CampfireLogo theme={theme} size={size} layout="wordmark" />
        </View>
        {showLabel ? (
          <Text className={`text-xs ${mutedColor}`}>{VARIANT_LABELS[variant]}</Text>
        ) : null}
      </View>
    )
  }

  return (
    <View className="gap-2 items-start">
      <CampfireLogo theme={theme} size={size} layout={LAYOUT[variant]} />
      {showLabel ? (
        <Text className={`text-xs ${mutedColor}`}>{VARIANT_LABELS[variant]}</Text>
      ) : null}
    </View>
  )
}

export function CampfireLogoLockupGrid({
  theme = 'light',
  size = 'md',
}: {
  theme?: CampfireLogoTheme
  size?: CampfireLogoSize
}) {
  const variants: CampfireLogoLockupVariant[] = [
    'horizontal',
    'stacked',
    'badge',
    'wordmark',
  ]

  return (
    <View className="flex-row flex-wrap gap-8">
      {variants.map((variant) => (
        <CampfireLogoLockup
          key={variant}
          variant={variant}
          theme={theme}
          size={size}
          showLabel
        />
      ))}
    </View>
  )
}

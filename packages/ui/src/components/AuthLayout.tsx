import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { PrimaryButton } from './PrimaryButton'
import { CampfireLogo } from './CampfireLogo'

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  promo,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  promo?: ReactNode
}) {
  return (
    <View className="min-h-screen bg-ig-page flex-row">
      <View className="hidden lg:flex flex-1 items-center justify-center bg-ig-surface border-r border-ig-border">
        {promo ?? <DefaultPromo />}
      </View>
      <View className="flex-1 items-center justify-center p-8">
        <View className="w-full max-w-[350px] gap-6">
          <View className="items-center gap-2 mb-2">
            <CampfireLogo size="lg" />
            {subtitle ? (
              <Text className="text-sm text-ig-muted text-center">{subtitle}</Text>
            ) : null}
          </View>
          <View className="border border-ig-border bg-ig-surface rounded-lg p-8 gap-4">
            <Text className="text-lg font-semibold text-ig-text text-center">{title}</Text>
            {children}
          </View>
          {footer}
        </View>
      </View>
    </View>
  )
}

function DefaultPromo() {
  return (
    <View className="gap-4 items-center px-12">
      <View className="flex-row flex-wrap w-64 gap-1">
        {Array.from({ length: 9 }).map((_, index) => (
          <View
            key={index}
            className="w-[84px] h-[84px] bg-gradient-to-br from-cf-flame-yellow via-cf-flame-orange to-cf-flame-red rounded-sm opacity-80"
          />
        ))}
      </View>
      <Text className="text-2xl font-light text-ig-text max-w-xs text-center">
        Share event photos with everyone around the campfire.
      </Text>
    </View>
  )
}

export function LoadingScreen({ message = 'Loading…' }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center p-8 min-h-[200px]">
      <Text className="text-sm text-ig-muted">{message}</Text>
    </View>
  )
}

export function AccessDeniedScreen({
  onHome,
}: {
  onHome: () => void
}) {
  return (
    <View className="flex-1 items-center justify-center p-8 gap-4 min-h-[300px]">
      <Text className="text-2xl font-semibold text-ig-text">Access denied</Text>
      <Text className="text-sm text-ig-muted text-center max-w-sm">
        This campfire is private. Scan the host&apos;s QR code or ask for a guest link to join.
      </Text>
      <PrimaryButton label="Back to home" onPress={onHome} />
    </View>
  )
}

import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'

export function DashboardCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <View className="border border-cf-card-border rounded-xl bg-cf-card p-6 gap-4">
      <View className="gap-1">
        <Text className="text-xl font-semibold text-ig-text">{title}</Text>
        <Text className="text-sm text-ig-muted">{description}</Text>
      </View>
      {children}
    </View>
  )
}

export function CopyField({
  value,
  onCopy,
  onOpen,
}: {
  value: string
  onCopy: () => void
  onOpen?: () => void
}) {
  return (
    <View className="flex-row items-center gap-2 border border-ig-border rounded-lg bg-ig-surface px-3 py-2">
      <Text className="flex-1 text-sm text-ig-text truncate" numberOfLines={1}>
        {value}
      </Text>
      <Pressable onPress={onCopy} className="px-2 py-1">
        <Text className="text-sm text-cf-accent font-medium">Copy</Text>
      </Pressable>
      {onOpen ? (
        <Pressable
          onPress={onOpen}
          className="bg-cf-accent rounded-lg px-3 py-1.5"
        >
          <Text className="text-sm text-white font-medium">Open</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

export function SettingsTabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <View className="flex-row flex-wrap gap-4 border-b border-ig-border mb-6">
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          onPress={() => onChange(tab.id)}
          className={`pb-3 border-b-2 ${
            active === tab.id ? 'border-cf-accent' : 'border-transparent'
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              active === tab.id ? 'text-cf-accent' : 'text-ig-muted'
            }`}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

export function SettingsRow({
  title,
  description,
  control,
}: {
  title: string
  description?: string
  control: ReactNode
}) {
  return (
    <View className="flex-row items-start justify-between gap-4 py-4 border-b border-ig-border">
      <View className="flex-1 gap-1 max-w-lg">
        <Text className="text-sm font-semibold text-ig-text">{title}</Text>
        {description ? (
          <Text className="text-sm text-ig-muted">{description}</Text>
        ) : null}
      </View>
      <View className="shrink-0">{control}</View>
    </View>
  )
}

export function ToggleSwitch({
  value,
  onChange,
}: {
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      className={`w-11 h-6 rounded-full px-0.5 justify-center ${
        value ? 'bg-cf-accent' : 'bg-ig-border'
      }`}
    >
      <View
        className={`w-5 h-5 rounded-full bg-white ${value ? 'self-end' : 'self-start'}`}
      />
    </Pressable>
  )
}

export function PhoneMockup({ children }: { children?: ReactNode }) {
  return (
    <View className="w-[140px] h-[280px] rounded-[24px] border-4 border-ig-text bg-ig-surface overflow-hidden items-center justify-end p-2">
      <View className="absolute top-2 w-12 h-1 rounded bg-ig-border" />
      {children ?? (
        <View className="w-full flex-1 mt-6 bg-gradient-to-br from-orange-200 to-pink-300 rounded-lg mb-2" />
      )}
      <View className="w-full bg-cf-accent rounded-lg py-2 items-center mb-1">
        <Text className="text-[10px] text-white font-bold">ADD PHOTOS</Text>
      </View>
    </View>
  )
}

export function MonitorMockup({ qrUrl }: { qrUrl?: string }) {
  return (
    <View className="w-full max-w-md aspect-video rounded-lg border-4 border-ig-text bg-black overflow-hidden relative">
      <View className="flex-1 items-center justify-center">
        <View className="w-3/4 h-3/4 bg-gradient-to-br from-orange-300 to-pink-400 rounded" />
      </View>
      {qrUrl ? (
        <View className="absolute bottom-3 left-3 bg-white/90 rounded p-2 gap-1">
          <View className="w-14 h-14 bg-ig-border rounded" />
          <Text className="text-[8px] text-ig-text">Scan to view or add photos!</Text>
        </View>
      ) : null}
    </View>
  )
}

export function WelcomeScreenModal({
  visible,
  title,
  message,
  onContinue,
}: {
  visible: boolean
  title: string
  message: string
  onContinue: () => void
}) {
  if (!visible) {
    return null
  }
  return (
    <View className="fixed inset-0 z-50 items-center justify-center bg-black/50 p-6">
      <View className="bg-ig-surface rounded-xl p-8 max-w-md w-full gap-4 items-center">
        <Text className="text-2xl font-bold text-ig-text text-center">{title}</Text>
        <Text className="text-sm text-ig-muted text-center">{message}</Text>
        <Pressable
          onPress={onContinue}
          className="bg-cf-accent rounded-lg px-6 py-3 mt-2"
        >
          <Text className="text-white font-semibold">Continue</Text>
        </Pressable>
      </View>
    </View>
  )
}

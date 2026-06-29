import { Pressable, Text, View } from 'react-native'
import { focusRing, navItemHover, pressableBase } from './motion/motionClasses'

export function CampfireAvatar({
  name,
  size = 'lg',
}: {
  name: string
  size?: 'sm' | 'lg'
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
  const sizeClass = size === 'lg' ? 'w-[88px] h-[88px]' : 'w-10 h-10'
  const textClass = size === 'lg' ? 'text-2xl' : 'text-sm'

  return (
    <View
      className={`${sizeClass} rounded-full border border-ig-border bg-gradient-to-br from-cf-flame-yellow via-cf-flame-orange to-cf-flame-red items-center justify-center`}
    >
      <Text className={`${textClass} font-semibold text-white`}>{initials || '?'}</Text>
    </View>
  )
}

export function NavIcon({
  label,
  active,
  onPress,
}: {
  label: string
  active?: boolean
  onPress: () => void
}) {
  return (
    <Pressable onPress={onPress} className={`items-center gap-1 py-2 px-4 ${pressableBase} ${focusRing} hover:opacity-100 active:opacity-80`}>
      <Text className={`text-2xl ${active ? 'opacity-100' : 'opacity-60'}`}>
        {label}
      </Text>
    </Pressable>
  )
}

export function SidebarNavItem({
  icon,
  label,
  active,
  onPress,
  onIntent,
  accent,
}: {
  icon: string
  label: string
  active?: boolean
  onPress: () => void
  onIntent?: () => void
  accent?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={onIntent}
      onFocus={onIntent}
      className={`flex-row items-center gap-3 py-2.5 px-3 rounded-lg ${pressableBase} ${focusRing} ${
        active && accent ? 'bg-cf-accent-light' : active ? '' : navItemHover
      }`}
    >
      <Text className="text-lg">{icon}</Text>
      <Text
        className={`text-sm ${
          active && accent
            ? 'font-semibold text-cf-accent'
            : active
              ? 'font-bold text-ig-text'
              : 'text-ig-text'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  )
}

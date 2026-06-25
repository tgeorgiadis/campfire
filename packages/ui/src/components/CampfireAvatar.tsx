import { Pressable, Text, View } from 'react-native'

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
      className={`${sizeClass} rounded-full border border-ig-border bg-gradient-to-br from-orange-400 to-pink-500 items-center justify-center`}
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
    <Pressable onPress={onPress} className="items-center gap-1 py-2 px-4">
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
}: {
  icon: string
  label: string
  active?: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-4 py-3 px-3 rounded-lg ${active ? 'font-bold' : ''}`}
    >
      <Text className="text-2xl">{icon}</Text>
      <Text
        className={`text-base ${active ? 'font-bold text-ig-text' : 'text-ig-text'}`}
      >
        {label}
      </Text>
    </Pressable>
  )
}

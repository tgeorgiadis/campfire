import { Pressable, Text } from 'react-native'
import { focusRing, pillSelected, pillUnselected, pressableBase } from './motion/motionClasses'

export function SelectablePill({
  label,
  selected,
  onPress,
  emoji,
  className = '',
}: {
  label: string
  selected: boolean
  onPress: () => void
  emoji?: string
  className?: string
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3 py-2 rounded-lg border ${pressableBase} ${focusRing} active:scale-[0.98] ${
        selected
          ? pillSelected
          : `border-ig-border bg-ig-surface ${pillUnselected}`
      } ${className}`}
    >
      <Text className="text-sm text-ig-text">
        {emoji ? `${emoji} ` : ''}
        {label}
      </Text>
    </Pressable>
  )
}

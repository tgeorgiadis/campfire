import { Pressable, Text } from 'react-native'
import {
  focusRing,
  pressableBase,
  pressablePrimary,
  pressableSecondary,
} from './motion/motionClasses'

export function PrimaryButton({
  label,
  onPress,
  disabled,
  variant = 'primary',
}: {
  label: string
  onPress: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}) {
  const isPrimary = variant === 'primary'
  const motion = disabled
    ? 'opacity-50'
    : `${pressableBase} ${focusRing} ${isPrimary ? pressablePrimary : pressableSecondary}`

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-lg py-2.5 px-4 items-center ${motion} ${
        isPrimary ? 'bg-cf-accent' : 'border border-ig-border bg-ig-surface'
      }`}
    >
      <Text
        className={`text-sm font-semibold ${isPrimary ? 'text-white' : 'text-ig-text'}`}
      >
        {label}
      </Text>
    </Pressable>
  )
}

export function TextButton({
  label,
  onPress,
  disabled,
}: {
  label: string
  onPress: () => void
  disabled?: boolean
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`${pressableBase} ${focusRing} ${disabled ? 'opacity-50' : 'hover:opacity-80 active:opacity-70'}`}
    >
      <Text className="text-sm text-cf-accent font-semibold hover:underline">{label}</Text>
    </Pressable>
  )
}

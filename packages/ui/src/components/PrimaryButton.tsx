import { Pressable, Text } from 'react-native'

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
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-lg py-2.5 px-4 items-center ${disabled ? 'opacity-50' : ''} ${
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
}: {
  label: string
  onPress: () => void
}) {
  return (
    <Pressable onPress={onPress}>
      <Text className="text-sm text-cf-accent font-semibold">{label}</Text>
    </Pressable>
  )
}

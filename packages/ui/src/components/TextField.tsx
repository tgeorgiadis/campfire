import { TextInput, View, Text } from 'react-native'
import { fieldFocus } from './motion/motionClasses'

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  autoCapitalize = 'none',
  editable = true,
}: {
  label?: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  secureTextEntry?: boolean
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  editable?: boolean
}) {
  return (
    <View className="gap-1">
      {label ? (
        <Text className="text-xs text-ig-muted font-medium">{label}</Text>
      ) : null}
      <View className={`border border-ig-border rounded-lg bg-ig-surface px-3 py-2.5 ${fieldFocus}`}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#49505A"
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          editable={editable}
          className="text-sm text-ig-text font-sans"
          style={{ outlineStyle: 'none' } as object}
        />
      </View>
    </View>
  )
}

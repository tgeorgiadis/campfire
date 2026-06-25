import type { ReactNode } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'

export function ModalFrame({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 bg-black/50 items-center justify-center p-4"
        onPress={onClose}
      >
        <Pressable
          className="bg-ig-surface rounded-xl w-full max-w-md p-5 gap-4 border border-ig-border"
          onPress={(event) => event.stopPropagation()}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-ig-text">{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text className="text-ig-muted text-2xl leading-none">×</Text>
            </Pressable>
          </View>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

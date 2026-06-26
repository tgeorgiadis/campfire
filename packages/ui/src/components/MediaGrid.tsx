import type { PhotoItem } from '@campfire/app-core'
import { Image, Pressable, Text, View } from 'react-native'

export function MediaGrid({
  photos,
  onPhotoPress,
  onApprove,
  onHide,
  onDelete,
  showActions,
}: {
  photos: PhotoItem[]
  onPhotoPress: (photo: PhotoItem) => void
  onApprove?: (photo: PhotoItem) => void
  onHide?: (photo: PhotoItem) => void
  onDelete?: (photo: PhotoItem) => void
  showActions?: boolean
}) {
  if (photos.length === 0) {
    return (
      <View className="py-16 items-center">
        <Text className="text-sm text-ig-muted">No media yet</Text>
      </View>
    )
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      {photos.map((photo) => (
        <View key={photo._id} className="w-[calc(33.333%-6px)] min-w-[100px] aspect-square relative">
          <Pressable onPress={() => onPhotoPress(photo)} className="w-full h-full">
            {photo.mediaType === 'text' ? (
              <View
                className={`w-full h-full rounded items-center justify-center p-2 ${textBgClass(photo.textBackground)}`}
              >
                <Text className="text-xs text-white text-center" numberOfLines={4}>
                  {photo.textBody}
                </Text>
              </View>
            ) : photo.url ? (
              <Image
                source={{ uri: photo.url }}
                className="w-full h-full rounded object-cover"
              />
            ) : (
              <View className="w-full h-full rounded bg-ig-border" />
            )}
          </Pressable>
          {photo.status === 'pending' ? (
            <View className="absolute top-1 left-1 bg-yellow-500 rounded px-1">
              <Text className="text-[10px] text-white font-bold">Pending</Text>
            </View>
          ) : null}
          {showActions ? (
            <View className="absolute bottom-1 right-1 flex-row gap-1">
              {onApprove && photo.status === 'pending' ? (
                <ActionChip label="✓" onPress={() => onApprove(photo)} />
              ) : null}
              {onHide && photo.status === 'published' ? (
                <ActionChip label="Hide" onPress={() => onHide(photo)} />
              ) : null}
              {onApprove && photo.status === 'hidden' ? (
                <ActionChip label="Show" onPress={() => onApprove(photo)} />
              ) : null}
              {onDelete ? (
                <ActionChip label="Del" onPress={() => onDelete(photo)} />
              ) : null}
            </View>
          ) : null}
        </View>
      ))}
    </View>
  )
}

function ActionChip({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-black/70 rounded px-1.5 py-0.5"
    >
      <Text className="text-[10px] text-white">{label}</Text>
    </Pressable>
  )
}

function textBgClass(bg?: string): string {
  switch (bg) {
    case 'gradient-blue':
      return 'bg-gradient-to-br from-blue-400 to-cyan-400'
    case 'gradient-green':
      return 'bg-gradient-to-br from-green-400 to-teal-400'
    case 'gradient-orange':
      return 'bg-gradient-to-br from-orange-400 to-red-400'
    case 'solid-dark':
      return 'bg-gray-800'
    case 'solid-light':
      return 'bg-gray-200'
    default:
      return 'bg-gradient-to-br from-pink-400 to-purple-500'
  }
}

import type { PhotoItem } from '@campfire/app-core'
import { Image, Pressable, Text, View } from 'react-native'

export function PhotoGrid({
  photos,
  onPhotoPress,
}: {
  photos: PhotoItem[]
  onPhotoPress: (photo: PhotoItem) => void
}) {
  if (photos.length === 0) {
    return (
      <View className="py-16 items-center px-4">
        <Text className="text-3xl mb-2">📷</Text>
        <Text className="text-xl font-light text-ig-text">No photos yet</Text>
        <Text className="text-sm text-ig-muted mt-1 text-center">
          Be the first to add yours.
        </Text>
      </View>
    )
  }

  return (
    <View className="flex-row flex-wrap">
      {photos.map((photo) => (
        <Pressable
          key={photo._id}
          onPress={() => onPhotoPress(photo)}
          className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 p-[0.5px] bg-ig-border"
        >
          <View className="w-full aspect-square bg-ig-surface">
            {photo.url ? (
              <Image
                source={{ uri: photo.url }}
                className="w-full h-full"
                resizeMode="cover"
                accessibilityLabel={photo.caption ?? 'Campfire photo'}
              />
            ) : (
              <View className="w-full h-full bg-ig-page" />
            )}
          </View>
        </Pressable>
      ))}
    </View>
  )
}

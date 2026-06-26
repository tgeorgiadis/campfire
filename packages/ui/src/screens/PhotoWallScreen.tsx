import type { CampfireSettings, PhotoItem } from '@campfire/app-core'
import { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'

export function PhotoWallScreen({
  photos,
  settings,
  qrElement,
  renderImage,
  renderVideo,
}: {
  photos: PhotoItem[]
  settings: CampfireSettings
  qrElement?: React.ReactNode
  renderImage?: (url: string) => React.ReactNode
  renderVideo?: (url: string, loop: boolean) => React.ReactNode
}) {
  const [index, setIndex] = useState(0)

  const current = photos.length > 0 ? photos[index % photos.length] : null

  useEffect(() => {
    setIndex(0)
  }, [photos.length, photos[0]?._id])

  useEffect(() => {
    if (photos.length === 0 || !current) {
      return
    }
    let durationSec = settings.imageDurationSec
    if (current.mediaType === 'video') {
      durationSec = settings.autoVideoDuration
        ? settings.videoDurationSec * 3
        : settings.videoDurationSec
    } else if (current.mediaType === 'text') {
      durationSec = settings.textDurationSec
    }
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % photos.length)
    }, durationSec * 1000)
    return () => clearTimeout(timer)
  }, [index, photos.length, current, settings])

  const showQr = !settings.hideWallQr && qrElement
  const isPhotoSlide =
    current?.url != null &&
    current.mediaType !== 'video' &&
    current.mediaType !== 'text'

  return (
    <View
      className={`fixed inset-0 overflow-hidden min-h-screen ${
        isPhotoSlide ? 'bg-black' : 'bg-neutral-900'
      }`}
    >
      <View className="absolute inset-0 items-center justify-center">
        {current ? (
          <>
            {current.mediaType === 'text' ? (
              <View
                className={`absolute inset-0 items-center justify-center p-12 ${textBgClass(current.textBackground)}`}
              >
                <Text className="text-5xl md:text-6xl text-white text-center font-bold">
                  {current.textBody}
                </Text>
              </View>
            ) : current.url ? (
              current.mediaType === 'video' && renderVideo ? (
                <View className="absolute inset-0 w-full h-full bg-neutral-900 p-[2vh]">
                  {renderVideo(current.url, settings.autoVideoDuration)}
                </View>
              ) : (
                <View className="absolute inset-0 w-full h-full p-[2vh]">
                  {renderImage ? (
                    renderImage(current.url)
                  ) : (
                    <Image
                      source={{ uri: current.url }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  )}
                </View>
              )
            ) : null}

            {!settings.hideWallCaption && current.caption ? (
              <View className="absolute bottom-8 left-8 right-8 bg-black/60 rounded-lg px-5 py-3">
                <Text className="text-xl text-white">{current.caption}</Text>
              </View>
            ) : null}

            {!settings.hideWallLikes && current.likeCount > 0 ? (
              <View className="absolute top-8 right-8 bg-black/50 rounded-full px-4 py-2">
                <Text className="text-white text-base">{current.likeCount} likes</Text>
              </View>
            ) : null}
          </>
        ) : (
          <Text className="text-white text-2xl">Waiting for photos…</Text>
        )}
      </View>

      {showQr ? qrElement : null}
    </View>
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
      return 'bg-gradient-to-br from-cf-flame-orange to-cf-flame-red'
  }
}

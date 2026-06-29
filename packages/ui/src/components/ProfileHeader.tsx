import { Pressable, Text, View } from 'react-native'
import { CampfireAvatar } from './CampfireAvatar'
import {
  focusRing,
  linkHover,
  pressableBase,
  pressableSecondary,
} from './motion/motionClasses'
import { PrimaryButton } from './PrimaryButton'

export function ProfileHeader({
  name,
  photoCount,
  visibility,
  roleLabel,
  canUpload,
  isOwner,
  onUpload,
  onShare,
  onSettings,
  onSignIn,
  showSignIn,
}: {
  name: string
  photoCount: number
  visibility: string
  roleLabel: string
  canUpload: boolean
  isOwner: boolean
  onUpload: () => void
  onShare: () => void
  onSettings: () => void
  onSignIn?: () => void
  showSignIn?: boolean
}) {
  const photoLabel = photoCount === 1 ? '1 photo' : `${photoCount} photos`

  return (
    <View className="px-4 py-6 border-b border-ig-border bg-ig-surface gap-4">
      <View className="flex-row items-center gap-6 md:gap-8">
        <CampfireAvatar name={name} size="lg" />
        <View className="flex-1 gap-3">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-xl font-normal text-ig-text">{name}</Text>
            {isOwner ? (
              <Pressable
                onPress={onSettings}
                className={`border border-ig-border rounded-lg px-3 py-1 ${pressableBase} ${focusRing} ${pressableSecondary}`}
              >
                <Text className="text-xs font-semibold text-ig-text">Settings</Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={onShare}
              className={`border border-ig-border rounded-lg px-3 py-1 ${pressableBase} ${focusRing} ${pressableSecondary}`}
            >
              <Text className="text-xs font-semibold text-ig-text">Share</Text>
            </Pressable>
          </View>
          <View className="flex-row gap-6">
            <Text className="text-base text-ig-text">
              <Text className="font-semibold">{photoCount}</Text> photos
            </Text>
            <Text className="text-sm text-ig-muted capitalize">
              {visibility} · {roleLabel}
            </Text>
          </View>
          <Text className="text-sm text-ig-text">{photoLabel}</Text>
          {canUpload ? (
            <PrimaryButton label="Upload photo" onPress={onUpload} />
          ) : showSignIn && onSignIn ? (
            <TextButtonLink label="Sign in to upload" onPress={onSignIn} />
          ) : null}
        </View>
      </View>
    </View>
  )
}

function TextButtonLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`self-start ${pressableBase} ${focusRing} ${linkHover}`}
    >
      <Text className="text-sm text-cf-accent font-semibold">{label}</Text>
    </Pressable>
  )
}

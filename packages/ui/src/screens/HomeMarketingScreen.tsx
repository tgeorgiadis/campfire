import { Text, View } from 'react-native'
import { CampfireLogo } from '../components/CampfireLogo'
import { ElevatedSurface } from '../components/brand/ElevatedSurface'
import { PrimaryButton } from '../components/PrimaryButton'

const PILLARS = [
  {
    title: 'Gather',
    description: 'QR codes and links for everyone who came.',
    emoji: '🔗',
  },
  {
    title: 'Share',
    description: 'Guests add photos in seconds — no account needed.',
    emoji: '📸',
  },
  {
    title: 'Relive',
    description: 'Browse the album or watch memories on the photo wall.',
    emoji: '✨',
  },
] as const

export function HomeMarketingScreen({
  onSignIn,
}: {
  onSignIn: () => void
}) {
  return (
    <View className="min-h-screen bg-ig-page flex-row font-sans">
      <View className="hidden lg:flex flex-1 items-center justify-center bg-ig-surface border-r border-ig-border px-12">
        <MarketingHeroVisual />
      </View>

      <View className="flex-1 items-center justify-center px-6 py-12">
        <View className="w-full max-w-[520px] gap-8">
          <View className="items-center lg:items-start gap-3">
            <CampfireLogo size="lg" layout="stacked" />
            <Text className="text-3xl font-bold text-ig-text text-center lg:text-left">
              Gather. Share. Relive.
            </Text>
            <Text className="text-xl text-ig-muted text-center lg:text-left">
              The album you build together.
            </Text>
            <Text className="text-sm text-ig-muted text-center lg:text-left max-w-md">
              Shared albums for the people who were there. Sign in to start a campfire or open
              one from a guest link.
            </Text>
          </View>

          <View className="lg:hidden items-center">
            <MarketingHeroVisual compact />
          </View>

          <View className="gap-4">
            {PILLARS.map((pillar) => (
              <ElevatedSurface
                key={pillar.title}
                className="flex-row gap-4 border border-ig-border rounded-xl bg-ig-surface p-4 items-start"
              >
                <Text className="text-2xl">{pillar.emoji}</Text>
                <View className="flex-1 gap-1">
                  <Text className="text-base font-semibold text-ig-text">{pillar.title}</Text>
                  <Text className="text-sm text-ig-muted">{pillar.description}</Text>
                </View>
              </ElevatedSurface>
            ))}
          </View>

          <View className="gap-4 items-center lg:items-start">
            <PrimaryButton label="Sign in" onPress={onSignIn} />
            <Text className="text-sm text-ig-muted text-center lg:text-left max-w-sm">
              Have a guest link? Open it directly — no account required.
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

function MarketingHeroVisual({ compact }: { compact?: boolean }) {
  return (
    <View className="gap-4 items-center">
      <CampfireLogo size={compact ? 'md' : 'lg'} layout="stacked" />
      {!compact ? (
        <Text className="text-lg font-light text-ig-text max-w-xs text-center">
          Everyone who was there can add to the story.
        </Text>
      ) : null}
    </View>
  )
}

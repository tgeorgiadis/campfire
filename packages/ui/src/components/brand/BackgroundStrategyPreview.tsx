import { Text, View } from 'react-native'
import { CampfireEventCard, STORYBOARD_EVENT_CARDS } from './CampfireEventCard'
import { ElevatedSurface } from './ElevatedSurface'

export type BackgroundStrategy = 'warm-cream' | 'neutral' | 'deep-cream'

const STRATEGIES: Record<
  BackgroundStrategy,
  {
    label: string
    description: string
    pageClass: string
    hex: string
    token: string
  }
> = {
  'warm-cream': {
    label: 'Warm cream + white cards',
    description: 'Keep today’s firelight cream page; cards lift to white with shadow.',
    pageClass: 'bg-cf-page-current',
    hex: '#FFF7EC',
    token: 'cf-page-current',
  },
  neutral: {
    label: 'Neutral page + white cards',
    description: 'Softer warm white page for more contrast without losing warmth.',
    pageClass: 'bg-cf-page-neutral',
    hex: '#FAFAF8',
    token: 'cf-page-neutral',
  },
  'deep-cream': {
    label: 'Deep cream + white cards',
    description: 'Richer page tone so elevated surfaces read clearly at a glance.',
    pageClass: 'bg-cf-page-deep',
    hex: '#F5EDE3',
    token: 'cf-page-deep',
  },
}

export function BackgroundStrategyPreview({
  strategy,
}: {
  strategy: BackgroundStrategy
}) {
  const config = STRATEGIES[strategy]

  return (
    <View className="flex-1 min-w-[280px] gap-3">
      <View className="gap-1">
        <Text className="text-sm font-semibold text-ig-text">{config.label}</Text>
        <Text className="text-xs text-ig-muted">{config.description}</Text>
        <Text className="text-xs font-mono text-ig-muted">
          {config.token} · {config.hex}
        </Text>
      </View>

      <View className={`rounded-xl border border-ig-border overflow-hidden ${config.pageClass}`}>
        <View className="flex-row min-h-[220px]">
          <View className="w-16 border-r border-ig-border bg-ig-surface p-2 gap-2">
            <View className="h-2 w-8 rounded bg-cf-accent" />
            <View className="h-2 w-full rounded bg-ig-border" />
            <View className="h-2 w-full rounded bg-ig-border" />
            <View className="h-2 w-full rounded bg-cf-accent-light" />
          </View>

          <View className="flex-1 p-3 gap-3">
            <View className="gap-1">
              <Text className="text-xs font-bold text-ig-text">My Events</Text>
              <Text className="text-[10px] text-ig-muted">Preview layout</Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {STORYBOARD_EVENT_CARDS.map((event) => (
                <View key={event.name} className="w-[calc(50%-4px)]">
                  <CampfireEventCard event={event} style="elevated" compact />
                </View>
              ))}
            </View>

            <ElevatedSurface className="rounded-lg border border-ig-border bg-ig-surface p-3 gap-1">
              <Text className="text-xs font-semibold text-ig-text">Share album</Text>
              <Text className="text-[10px] text-ig-muted">
                Dashboard card on elevated white surface
              </Text>
            </ElevatedSurface>
          </View>
        </View>
      </View>
    </View>
  )
}

export function BackgroundStrategyComparison() {
  const strategies: BackgroundStrategy[] = ['warm-cream', 'neutral', 'deep-cream']

  return (
    <View className="flex-row flex-wrap gap-6">
      {strategies.map((strategy) => (
        <BackgroundStrategyPreview key={strategy} strategy={strategy} />
      ))}
    </View>
  )
}

export { STRATEGIES as BACKGROUND_STRATEGIES }

import type { CampfireListItem } from '@campfire/app-core'
import type { EventType } from '@campfire/app-core'
import { Pressable, Text, View } from 'react-native'
import { EVENT_TYPE_OPTIONS } from '../../lib/eventTypes'
import { cardInteractive, focusRing, pressableBase } from '../motion/motionClasses'
import { ElevatedSurface } from './ElevatedSurface'

export type CampfireEventCardStyle = 'elevated' | 'warm-header' | 'legacy'

export type CampfireEventCardData = {
  name: string
  eventType: EventType
  eventDate?: string
  createdDate: string
  uploadCount: number
  isCurrent?: boolean
  themeColor?: string
}

function eventEmoji(eventType: EventType): string {
  return EVENT_TYPE_OPTIONS.find((option) => option.id === eventType)?.emoji ?? '🔥'
}

function uploadLabel(count: number): string {
  return `${count} upload${count === 1 ? '' : 's'}`
}

function CurrentEventBadge() {
  return (
    <View className="self-start rounded-full bg-cf-accent-light px-2.5 py-1">
      <Text className="text-xs font-semibold text-cf-accent">Current Event</Text>
    </View>
  )
}

function LegacyEventCardBody({
  event,
}: {
  event: CampfireEventCardData
}) {
  return (
    <>
      <View className="p-4 gap-3">
        <Text className="text-lg font-semibold text-ig-text">{event.name}</Text>
        <View className="gap-1">
          <Text className="text-sm text-ig-muted">{uploadLabel(event.uploadCount)}</Text>
          <Text className="text-sm text-ig-muted">Created on {event.createdDate}</Text>
        </View>
      </View>
      {event.isCurrent ? (
        <View className="border-t border-ig-border bg-ig-page py-2 items-center">
          <Text className="text-sm font-semibold text-ig-text">Current Event</Text>
        </View>
      ) : null}
    </>
  )
}

export function CampfireEventCard({
  event,
  style = 'warm-header',
  onPress,
  className = '',
  compact,
}: {
  event: CampfireEventCardData
  style?: CampfireEventCardStyle
  onPress?: () => void
  className?: string
  compact?: boolean
}) {
  const emoji = eventEmoji(event.eventType)
  const widthClass = compact
    ? 'w-full'
    : 'w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]'

  if (style === 'legacy') {
    const card = (
      <View
        className={`border border-cf-card-border rounded-xl bg-cf-card overflow-hidden ${className}`}
      >
        <LegacyEventCardBody event={event} />
      </View>
    )
    return (
      <View className={widthClass}>
        {onPress ? <Pressable onPress={onPress}>{card}</Pressable> : card}
      </View>
    )
  }

  const cardInner =
    style === 'warm-header' ? (
      <ElevatedSurface className="overflow-hidden rounded-xl border border-ig-border bg-ig-surface">
        {event.themeColor ? (
          <View style={{ height: 3, backgroundColor: event.themeColor }} />
        ) : null}
        <View className="bg-cf-accent-light px-4 py-3 flex-row items-center gap-2">
          <Text className="text-lg">{emoji}</Text>
          <Text className="text-lg font-semibold text-ig-text flex-1" numberOfLines={1}>
            {event.name}
          </Text>
          {event.isCurrent ? <CurrentEventBadge /> : null}
        </View>
        <View className="p-4 gap-2">
          {event.eventDate ? (
            <Text className="text-sm font-medium text-ig-text">{event.eventDate}</Text>
          ) : null}
          <Text className="text-sm text-ig-muted">{uploadLabel(event.uploadCount)}</Text>
          <Text className="text-sm text-ig-muted">Created {event.createdDate}</Text>
        </View>
      </ElevatedSurface>
    ) : (
      <ElevatedSurface
        className={`overflow-hidden rounded-xl border border-ig-border bg-ig-surface ${className}`}
      >
        {event.themeColor ? (
          <View style={{ height: 3, backgroundColor: event.themeColor }} />
        ) : null}
        <View className="p-4 gap-3">
          <View className="flex-row items-start gap-2">
            <Text className="text-xl">{emoji}</Text>
            <View className="flex-1 gap-2">
              <Text className="text-lg font-semibold text-ig-text">{event.name}</Text>
              {event.isCurrent ? <CurrentEventBadge /> : null}
            </View>
          </View>
          <View className="gap-1">
            {event.eventDate ? (
              <Text className="text-sm font-medium text-ig-text">{event.eventDate}</Text>
            ) : null}
            <Text className="text-sm text-ig-muted">{uploadLabel(event.uploadCount)}</Text>
            <Text className="text-sm text-ig-muted">Created {event.createdDate}</Text>
          </View>
        </View>
      </ElevatedSurface>
    )

  const pressableMotion = onPress
    ? `${pressableBase} ${focusRing} ${cardInteractive} cursor-pointer`
    : ''

  return (
    <View className={widthClass}>
      {onPress ? (
        <Pressable onPress={onPress} className={pressableMotion}>
          {cardInner}
        </Pressable>
      ) : (
        cardInner
      )}
    </View>
  )
}

export const STORYBOARD_EVENT_CARDS: CampfireEventCardData[] = [
  {
    name: 'Tom bec wedding',
    eventType: 'wedding',
    eventDate: 'Sat 26 Jun 2026',
    createdDate: '26 Jun 2026',
    uploadCount: 1,
    isCurrent: true,
    themeColor: '#E5634D',
  },
  {
    name: "bobby's bbq1",
    eventType: 'party',
    eventDate: 'Fri 25 Jun 2026',
    createdDate: '25 Jun 2026',
    uploadCount: 4,
    themeColor: '#FF8A3D',
  },
]

function formatEventDate(timestamp: number | undefined): string | undefined {
  if (timestamp === undefined) {
    return undefined
  }
  return new Date(timestamp).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatCreatedDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function toEventCardData(
  event: CampfireListItem,
  currentSlug: string,
): CampfireEventCardData {
  return {
    name: event.name,
    eventType: event.eventType,
    eventDate: formatEventDate(event.eventDate),
    createdDate: formatCreatedDate(event.createdAt),
    uploadCount: event.uploadCount,
    isCurrent: event.slug === currentSlug,
    themeColor: event.themeColor,
  }
}

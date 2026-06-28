import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import type { CampfireSummary } from '@campfire/app-core'
import { SidebarNavItem } from './CampfireAvatar'
import { CampfireLogo } from './CampfireLogo'

export type EventNavTab = 'home' | 'photos' | 'settings' | 'events'

export function EventShell({
  slug,
  campfires,
  activeTab,
  userEmail,
  onNavigate,
  onSignOut,
  onViewAllEvents,
  onCreateCampfire,
  eventSwitcher,
  onNavIntent,
  contentDimmed,
  children,
}: {
  slug: string
  campfires: CampfireSummary[]
  activeTab: EventNavTab
  userEmail?: string | null
  onNavigate: (tab: EventNavTab) => void
  onSwitchEvent?: (slug: string) => void
  onSignOut: () => void
  onViewAllEvents?: () => void
  onCreateCampfire?: () => void
  eventSwitcher?: ReactNode
  onNavIntent?: (tab: EventNavTab) => void
  contentDimmed?: boolean
  children: ReactNode
}) {
  const current = campfires.find((c) => c.slug === slug)

  const createCampfireLink =
    onCreateCampfire != null ? (
      <Pressable onPress={onCreateCampfire} className="mt-2 px-1">
        <Text className="text-sm font-semibold text-cf-accent">+ Create new campfire</Text>
      </Pressable>
    ) : null

  const currentEventHeader = (
    <View className="gap-2">
      <View className="flex-row items-center justify-between px-1">
        <Text className="text-xs font-semibold text-ig-muted uppercase">
          Current Event
        </Text>
        {onViewAllEvents != null ? (
          <Pressable onPress={onViewAllEvents}>
            <Text
              className={`text-xs font-semibold ${
                activeTab === 'events' ? 'text-cf-accent' : 'text-cf-accent'
              }`}
            >
              View All
            </Text>
          </Pressable>
        ) : null}
      </View>
      <View className="border border-ig-border rounded-lg bg-ig-surface px-3 py-2">
        {eventSwitcher ?? (
          <Text className="text-sm text-ig-text">{current?.name ?? slug}</Text>
        )}
      </View>
      {createCampfireLink}
    </View>
  )

  return (
    <View className="flex-1 min-h-screen bg-ig-page font-sans">
      <View className="flex-1 flex-row w-full">
        <View className="hidden md:flex w-[260px] shrink-0 border-r border-ig-border bg-ig-surface px-4 py-6 fixed left-0 top-0 bottom-0 z-10">
          <View className="px-2 mb-6">
            <CampfireLogo size="sm" />
          </View>

          <View className="px-2 mb-4">{currentEventHeader}</View>

          <View className="gap-1 flex-1">
            <SidebarNavItem
              icon="⌂"
              label="Home"
              active={activeTab === 'home'}
              onPress={() => onNavigate('home')}
              onIntent={() => onNavIntent?.('home')}
              accent
            />
            <SidebarNavItem
              icon="▦"
              label="Photos & Videos"
              active={activeTab === 'photos'}
              onPress={() => onNavigate('photos')}
              onIntent={() => onNavIntent?.('photos')}
              accent
            />
            <SidebarNavItem
              icon="⚙"
              label="Event Settings"
              active={activeTab === 'settings'}
              onPress={() => onNavigate('settings')}
              onIntent={() => onNavIntent?.('settings')}
              accent
            />
          </View>

          <View className="border-t border-ig-border pt-4 px-2 gap-1">
            <Text className="text-xs font-semibold text-ig-muted">My Account</Text>
            {userEmail ? (
              <Text className="text-xs text-ig-text truncate">{userEmail}</Text>
            ) : null}
            <Pressable onPress={onSignOut} className="mt-2">
              <Text className="text-xs text-cf-accent">Sign out</Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-1 w-full md:ml-[260px] pb-16 md:pb-0">
          <View className="md:hidden border-b border-ig-border bg-ig-surface px-4 py-3 gap-2">
            <CampfireLogo size="sm" />
            {currentEventHeader}
          </View>
          <View className={`max-w-[1100px] w-full px-4 py-6 ${contentDimmed ? 'opacity-50' : ''}`}>
            {children}
          </View>
        </View>
      </View>

      <View className="md:hidden fixed bottom-0 left-0 right-0 h-[52px] border-t border-ig-border bg-ig-surface flex-row items-center justify-around z-20">
        <MobileTab
          label="Home"
          active={activeTab === 'home'}
          onPress={() => onNavigate('home')}
          onIntent={() => onNavIntent?.('home')}
        />
        <MobileTab
          label="Photos"
          active={activeTab === 'photos'}
          onPress={() => onNavigate('photos')}
          onIntent={() => onNavIntent?.('photos')}
        />
        <MobileTab
          label="Settings"
          active={activeTab === 'settings'}
          onPress={() => onNavigate('settings')}
          onIntent={() => onNavIntent?.('settings')}
        />
      </View>
    </View>
  )
}

function MobileTab({
  label,
  active,
  onPress,
  onIntent,
}: {
  label: string
  active: boolean
  onPress: () => void
  onIntent?: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={onIntent}
      onFocus={onIntent}
      className="py-2 px-4"
    >
      <Text
        className={`text-xs font-medium ${active ? 'text-cf-accent' : 'text-ig-muted'}`}
      >
        {label}
      </Text>
    </Pressable>
  )
}

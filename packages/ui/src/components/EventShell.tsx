import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import type { CampfireSummary } from '@campfire/app-core'
import { SidebarNavItem } from './CampfireAvatar'
import { CampfireLogo } from './CampfireLogo'
import { focusRing, linkHover, pressableBase, tabHover } from './motion/motionClasses'
import {
  sidebarChromeCreateButton,
  sidebarChromeDivider,
  sidebarChromeEventSelect,
  sidebarChromeLink,
  sidebarChromeLogoBadge,
  sidebarChromeLogoWrap,
  sidebarChromeMuted,
  sidebarChromeSectionDivider,
  sidebarChromeShell,
  sidebarChromeText,
  chromeFocusRing,
} from './motion/sidebarChromeClasses'

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

  const createCampfireLink = (chrome = false) =>
    onCreateCampfire != null ? (
      <Pressable
        onPress={onCreateCampfire}
        className={`${pressableBase} ${chrome ? `${chromeFocusRing} ${sidebarChromeCreateButton}` : `mt-2 px-1 rounded ${focusRing} ${linkHover}`}`}
      >
        <Text
          className={`text-sm font-semibold text-center ${chrome ? sidebarChromeLink : 'text-cf-accent'}`}
        >
          + Create new campfire
        </Text>
      </Pressable>
    ) : null

  const currentEventHeader = (chrome = false) => (
    <View className="gap-2.5">
      <View className="flex-row items-center justify-between">
        <Text
          className={`text-[11px] font-semibold uppercase ${
            chrome ? sidebarChromeMuted : 'text-ig-muted'
          }`}
        >
          Current Event
        </Text>
        {onViewAllEvents != null ? (
          <Pressable
            onPress={onViewAllEvents}
            className={`rounded ${pressableBase} ${chrome ? chromeFocusRing : focusRing} ${chrome ? 'hover:opacity-80' : linkHover}`}
          >
            <Text
              className={`text-[11px] font-semibold ${
                chrome ? sidebarChromeLink : 'text-cf-accent'
              }`}
            >
              View All
            </Text>
          </Pressable>
        ) : null}
      </View>
      <View
        className={
          chrome ? sidebarChromeEventSelect : 'border border-ig-border bg-ig-surface rounded-lg px-3 py-2'
        }
      >
        {eventSwitcher ?? (
          <Text className="text-sm font-medium text-ig-text">{current?.name ?? slug}</Text>
        )}
      </View>
      {createCampfireLink(chrome)}
    </View>
  )

  return (
    <View className="flex-1 min-h-screen bg-ig-page font-sans">
      <View className="flex-1 flex-row w-full">
        <View
          className={`hidden md:flex w-[260px] shrink-0 px-4 py-5 fixed left-0 top-0 bottom-0 z-10 ${sidebarChromeShell}`}
        >
          <View className={sidebarChromeLogoWrap}>
            <View className={sidebarChromeLogoBadge}>
              <CampfireLogo size="sm" theme="light" />
            </View>
          </View>

          <View className="flex-1 flex-col px-0.5">
            {currentEventHeader(true)}

            <View className={sidebarChromeSectionDivider} />

            <View className="gap-0.5">
              <SidebarNavItem
                icon="⌂"
                label="Home"
                active={activeTab === 'home'}
                onPress={() => onNavigate('home')}
                onIntent={() => onNavIntent?.('home')}
                accent
                variant="chrome"
              />
              <SidebarNavItem
                icon="▦"
                label="Photos & Videos"
                active={activeTab === 'photos'}
                onPress={() => onNavigate('photos')}
                onIntent={() => onNavIntent?.('photos')}
                accent
                variant="chrome"
              />
              <SidebarNavItem
                icon="⚙"
                label="Event Settings"
                active={activeTab === 'settings'}
                onPress={() => onNavigate('settings')}
                onIntent={() => onNavIntent?.('settings')}
                accent
                variant="chrome"
              />
            </View>
          </View>

          <View className={`border-t pt-4 gap-2 ${sidebarChromeDivider}`}>
            <Text className={`text-[11px] font-semibold uppercase ${sidebarChromeMuted}`}>
              My Account
            </Text>
            {userEmail ? (
              <Text className={`text-xs truncate mt-1 ${sidebarChromeText} opacity-90`}>
                {userEmail}
              </Text>
            ) : null}
            <Pressable
              onPress={onSignOut}
              className={`rounded ${pressableBase} ${chromeFocusRing} hover:opacity-80 active:opacity-70 px-0.5`}
            >
              <Text className={`text-xs font-medium ${sidebarChromeLink}`}>Sign out</Text>
            </Pressable>
          </View>
        </View>

        <View className="flex-1 w-full md:ml-[260px] pb-16 md:pb-0">
          <View className="md:hidden border-b border-ig-border bg-ig-surface px-4 py-3 gap-2">
            <CampfireLogo size="sm" />
            {currentEventHeader(false)}
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
      className={`py-2 px-4 rounded-lg ${pressableBase} ${focusRing} ${active ? '' : tabHover}`}
    >
      <Text
        className={`text-xs font-medium transition-colors duration-150 ${active ? 'text-cf-accent' : 'text-ig-muted'}`}
      >
        {label}
      </Text>
    </Pressable>
  )
}

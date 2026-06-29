import type { ReactNode } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SidebarNavItem } from './CampfireAvatar'
import { CampfireLogo } from './CampfireLogo'
import { focusRing, pressableBase, tabHover } from './motion/motionClasses'
import { sidebarChromeLogoBadge, sidebarChromeLogoWrap, sidebarChromeShell } from './motion/sidebarChromeClasses'

export type AppShellTab = 'home' | 'create' | 'profile'

export function AppShell({
  activeTab,
  onHome,
  onCreate,
  onProfile,
  children,
  showNav = true,
}: {
  activeTab: AppShellTab
  onHome: () => void
  onCreate: () => void
  onProfile: () => void
  children: ReactNode
  showNav?: boolean
}) {
  return (
    <View className="flex-1 min-h-screen bg-ig-page font-sans">
      <View className="flex-1 flex-row w-full">
        {showNav ? (
          <View
            className={`hidden md:flex w-[244px] shrink-0 px-4 py-5 fixed left-0 top-0 bottom-0 z-10 ${sidebarChromeShell}`}
          >
            <View className={sidebarChromeLogoWrap}>
              <View className={sidebarChromeLogoBadge}>
                <CampfireLogo size="sm" theme="light" />
              </View>
            </View>
            <View className="gap-0.5 px-0.5">
              <SidebarNavItem
                icon="⌂"
                label="Home"
                active={activeTab === 'home'}
                onPress={onHome}
                variant="chrome"
                accent
              />
              <SidebarNavItem
                icon="＋"
                label="Create"
                active={activeTab === 'create'}
                onPress={onCreate}
                variant="chrome"
                accent
              />
              <SidebarNavItem
                icon="☺"
                label="Profile"
                active={activeTab === 'profile'}
                onPress={onProfile}
                variant="chrome"
                accent
              />
            </View>
          </View>
        ) : null}

        <View className={`flex-1 w-full ${showNav ? 'md:ml-[244px]' : ''} pb-16 md:pb-0`}>
          <ScrollView className="flex-1" contentContainerClassName="grow">
            <View className="max-w-[1200px] w-full">{children}</View>
          </ScrollView>
        </View>
      </View>

      {showNav ? (
        <View className="md:hidden fixed bottom-0 left-0 right-0 h-[49px] border-t border-ig-border bg-ig-surface flex-row items-center justify-around z-20">
          <BottomTab icon="⌂" active={activeTab === 'home'} onPress={onHome} />
          <BottomTab icon="＋" active={activeTab === 'create'} onPress={onCreate} />
          <BottomTab icon="☺" active={activeTab === 'profile'} onPress={onProfile} />
        </View>
      ) : null}
    </View>
  )
}

function BottomTab({
  icon,
  active,
  onPress,
}: {
  icon: string
  active: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`py-2 px-8 rounded-lg ${pressableBase} ${focusRing} ${active ? '' : tabHover}`}
    >
      <Text className={`text-2xl transition-opacity duration-150 ${active ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}>{icon}</Text>
    </Pressable>
  )
}

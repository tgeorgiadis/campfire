import type { ReactNode } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SidebarNavItem } from './CampfireAvatar'

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
          <View className="hidden md:flex w-[244px] shrink-0 border-r border-ig-border bg-ig-surface px-3 py-6 fixed left-0 top-0 bottom-0 z-10">
            <Text className="text-2xl font-bold text-ig-text px-3 mb-8 tracking-tight">
              Campfire
            </Text>
            <View className="gap-1">
              <SidebarNavItem
                icon="⌂"
                label="Home"
                active={activeTab === 'home'}
                onPress={onHome}
              />
              <SidebarNavItem
                icon="＋"
                label="Create"
                active={activeTab === 'create'}
                onPress={onCreate}
              />
              <SidebarNavItem
                icon="☺"
                label="Profile"
                active={activeTab === 'profile'}
                onPress={onProfile}
              />
            </View>
          </View>
        ) : null}

        <View className={`flex-1 w-full ${showNav ? 'md:ml-[244px]' : ''} pb-16 md:pb-0`}>
          <ScrollView className="flex-1" contentContainerClassName="grow">
            <View className="max-w-[1200px] mx-auto w-full">{children}</View>
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
    <Pressable onPress={onPress} className="py-2 px-8">
      <Text className={`text-2xl ${active ? 'opacity-100' : 'opacity-50'}`}>{icon}</Text>
    </Pressable>
  )
}

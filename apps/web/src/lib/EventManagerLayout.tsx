import { Outlet, useRouter, useRouterState } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useConvexAuth } from 'convex/react'
import { Text, View } from 'react-native'
import {
  EventHomeContentSkeleton,
  EventListContentSkeleton,
  EventPhotosContentSkeleton,
  EventSettingsContentSkeleton,
  EventShell,
  EventShellSkeleton,
} from '@campfire/ui'
import { WebEventSelect } from './eventWebUtils'
import {
  EventManagerProvider,
  useEventManagerContext,
} from './EventManagerContext'
import {
  prefetchCampfireDashboard,
  prefetchEventTab,
  useEventManager,
} from './useEventManager'
import type { EventNavTab } from '@campfire/ui'

function tabFromPathname(pathname: string): EventNavTab {
  if (pathname.endsWith('/photos')) {
    return 'photos'
  }
  if (pathname.endsWith('/settings')) {
    return 'settings'
  }
  if (pathname.endsWith('/events')) {
    return 'events'
  }
  return 'home'
}

function contentSkeletonForTab(tab: EventNavTab) {
  switch (tab) {
    case 'photos':
      return <EventPhotosContentSkeleton />
    case 'settings':
      return <EventSettingsContentSkeleton />
    case 'events':
      return <EventListContentSkeleton />
    default:
      return <EventHomeContentSkeleton />
  }
}

export function EventManagerLayout({ slug }: { slug: string }) {
  const { isLoading: authLoading } = useConvexAuth()
  const manager = useEventManager(slug)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const activeTab = tabFromPathname(pathname)
  const queryClient = useQueryClient()
  const router = useRouter()

  if (authLoading) {
    return (
      <EventShellSkeleton contentSkeleton={contentSkeletonForTab(activeTab)} />
    )
  }

  if (manager.loading && !manager.campfires) {
    return (
      <EventShellSkeleton contentSkeleton={contentSkeletonForTab(activeTab)} />
    )
  }

  if (!manager.campfires || !manager.dashboard) {
    return (
      <View className="min-h-screen bg-ig-page items-center justify-center p-8">
        <Text className="text-sm text-ig-muted">
          Event not found or access denied.
        </Text>
      </View>
    )
  }

  const eventSwitcher =
    manager.campfires.length > 0 ? (
      <WebEventSelect
        slug={slug}
        campfires={manager.campfires}
        onSwitchEvent={manager.nav.onSwitchEvent}
        onPrefetchSlug={(nextSlug) => {
          prefetchCampfireDashboard(queryClient, nextSlug)
        }}
      />
    ) : undefined

  const onNavIntent = (tab: EventNavTab) => {
    prefetchEventTab(
      queryClient,
      router,
      slug,
      tab,
      manager.dashboard?._id,
    )
  }

  const showContentSkeleton = manager.dashboardLoading

  return (
    <EventManagerProvider
      value={{
        slug,
        campfires: manager.campfires,
        dashboard: manager.dashboard,
        eventSwitcher,
        nav: manager.nav,
        dashboardLoading: manager.dashboardLoading,
        userEmail: manager.userEmail,
      }}
    >
      <EventShell
        slug={slug}
        campfires={manager.campfires}
        activeTab={activeTab}
        userEmail={manager.userEmail}
        onNavigate={manager.nav.onNavigate}
        onSignOut={manager.nav.onSignOut}
        onCreateCampfire={manager.nav.onCreateCampfire}
        onViewAllEvents={manager.nav.onViewAllEvents}
        onNavIntent={onNavIntent}
        eventSwitcher={eventSwitcher}
        contentDimmed={manager.dashboardLoading}
      >
        {showContentSkeleton ? contentSkeletonForTab(activeTab) : <Outlet />}
      </EventShell>
    </EventManagerProvider>
  )
}

export { useEventManagerContext }

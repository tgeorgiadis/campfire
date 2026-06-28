import { useAuthActions } from '@convex-dev/auth/react'
import { useNavigate } from '@tanstack/react-router'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useConvexAuth } from 'convex/react'
import { useEffect, useMemo } from 'react'
import { setLastCampfireSlug } from '@campfire/app-core'
import { dashboardQuery, listMineQuery, membersQuery } from './eventQueries'
import type { Id } from '@campfire/backend/convex/_generated/dataModel'
import type { EventNavTab } from '@campfire/ui'
import type { QueryClient } from '@tanstack/react-query'
import type { RegisteredRouter } from '@tanstack/react-router'

export function useEventManager(slug: string, userEmail?: string | null) {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
  const { signOut } = useAuthActions()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      void navigate({ to: '/sign-in' })
    }
  }, [isAuthenticated, authLoading, navigate])

  useEffect(() => {
    if (slug) {
      setLastCampfireSlug(slug)
    }
  }, [slug])

  const campfiresQuery = useQuery({
    ...listMineQuery(),
    enabled: isAuthenticated,
  })

  const dashboardQueryResult = useQuery({
    ...dashboardQuery(slug),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  })

  const nav = useMemo(
    () => ({
      onNavigate: (tab: EventNavTab) => {
        if (tab === 'events') {
          void navigate({
            to: '/c/$slug/events',
            params: { slug },
            search: { create: false },
          })
          return
        }
        const path =
          tab === 'home'
            ? '/c/$slug/home'
            : tab === 'photos'
              ? '/c/$slug/photos'
              : '/c/$slug/settings'
        void navigate({ to: path, params: { slug } })
      },
      onSwitchEvent: (nextSlug: string) => {
        setLastCampfireSlug(nextSlug)
        void navigate({ to: '/c/$slug/home', params: { slug: nextSlug } })
      },
      onSignOut: () => void signOut(),
      onViewAllEvents: () => {
        void navigate({
          to: '/c/$slug/events',
          params: { slug },
          search: { create: false },
        })
      },
      onCreateCampfire: () => {
        void navigate({
          to: '/c/$slug/events',
          params: { slug },
          search: { create: true },
        })
      },
    }),
    [navigate, signOut, slug],
  )

  const loading =
    authLoading ||
    !isAuthenticated ||
    campfiresQuery.isLoading ||
    dashboardQueryResult.isLoading

  const dashboardLoading = dashboardQueryResult.isFetching && !dashboardQueryResult.data

  return {
    loading,
    dashboardLoading,
    campfires: campfiresQuery.data,
    dashboard: dashboardQueryResult.data ?? null,
    nav,
    userEmail,
  }
}

export function prefetchEventTab(
  queryClient: QueryClient,
  router: RegisteredRouter,
  slug: string,
  tab: EventNavTab,
  campfireId?: Id<'campfires'>,
) {
  void queryClient.prefetchQuery(listMineQuery())
  void queryClient.prefetchQuery(dashboardQuery(slug))

  const route =
    tab === 'home'
      ? '/c/$slug/home'
      : tab === 'photos'
        ? '/c/$slug/photos'
        : tab === 'settings'
          ? '/c/$slug/settings'
          : '/c/$slug/events'

  void router.preloadRoute({
    to: route,
    params: { slug },
    search: tab === 'events' ? { create: false } : undefined,
  })

  if (tab === 'settings' && campfireId) {
    void queryClient.prefetchQuery(membersQuery(campfireId))
  }
}

export function prefetchCampfireDashboard(
  queryClient: QueryClient,
  slug: string,
) {
  void queryClient.prefetchQuery(dashboardQuery(slug))
}

import { useAuthActions } from '@convex-dev/auth/react'
import { useNavigate } from '@tanstack/react-router'
import { useConvexAuth, useQuery } from 'convex/react'
import { useEffect } from 'react'
import { api } from '@campfire/backend/convex/_generated/api'
import { setLastCampfireSlug } from '@campfire/app-core'
import { LoadingScreen } from '@campfire/ui'
import { WebEventSelect } from './eventWebUtils'
import type { EventNavTab } from '@campfire/ui'
import type { EventManagerContext } from './eventContext'
import type { ReactNode } from 'react'

export function useEventManager(slug: string) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signOut } = useAuthActions()
  const navigate = useNavigate()
  const campfires = useQuery(
    api.campfires.listMine,
    isAuthenticated ? {} : 'skip',
  )
  const dashboard = useQuery(
    api.campfires.getDashboard,
    isAuthenticated ? { slug } : 'skip',
  )

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({ to: '/sign-in' })
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    if (slug) {
      setLastCampfireSlug(slug)
    }
  }, [slug])

  const eventSwitcher =
    campfires && campfires.length > 0 ? (
      <WebEventSelect
        slug={slug}
        campfires={campfires}
        onSwitchEvent={(nextSlug) => {
          void navigate({ to: '/c/$slug/home', params: { slug: nextSlug } })
        }}
      />
    ) : undefined

  const nav = {
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
  }

  if (isLoading || !isAuthenticated) {
    return { loading: true as const, eventSwitcher: undefined, nav }
  }

  if (campfires === undefined || dashboard === undefined) {
    return { loading: true as const, eventSwitcher, nav }
  }

  return {
    loading: false as const,
    campfires,
    dashboard,
    eventSwitcher,
    nav,
  }
}

export function EventManagerGate({
  slug,
  children,
}: {
  slug: string
  children: (ctx: EventManagerContext) => ReactNode
}) {
  const ctx = useEventManager(slug)
  if (ctx.loading) {
    return <LoadingScreen />
  }
  if (!ctx.dashboard) {
    return <LoadingScreen message="Event not found or access denied" />
  }
  return (
    <>
      {children({
        campfires: ctx.campfires,
        dashboard: ctx.dashboard,
        eventSwitcher: ctx.eventSwitcher,
        nav: ctx.nav,
      })}
    </>
  )
}

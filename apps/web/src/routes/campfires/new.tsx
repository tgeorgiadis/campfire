import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useConvexAuth, useQuery } from 'convex/react'
import { useEffect } from 'react'
import { api } from '@campfire/backend/convex/_generated/api'
import {
  getLastCampfireSlug,
  resolveDefaultCampfireSlug,
} from '@campfire/app-core'
import { EventListContentSkeleton, EventShellSkeleton } from '@campfire/ui'

export const Route = createFileRoute('/campfires/new')({
  ssr: false,
  component: CreateCampfireRedirect,
})

function CreateCampfireRedirect() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const navigate = useNavigate()
  const campfires = useQuery(
    api.campfires.listMine,
    isAuthenticated ? {} : 'skip',
  )

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({ to: '/sign-in' })
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    if (isLoading || !isAuthenticated || campfires === undefined) {
      return
    }

    const slug =
      resolveDefaultCampfireSlug(campfires) ?? getLastCampfireSlug() ?? null

    if (slug) {
      void navigate({
        to: '/c/$slug/events',
        params: { slug },
        search: { create: true },
        replace: true,
      })
      return
    }

    void navigate({ to: '/', replace: true })
  }, [campfires, isAuthenticated, isLoading, navigate])

  return (
    <EventShellSkeleton contentSkeleton={<EventListContentSkeleton />} />
  )
}

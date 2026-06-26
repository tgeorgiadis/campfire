import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useConvexAuth, useQuery } from 'convex/react'
import { useEffect } from 'react'
import { api } from '@campfire/backend/convex/_generated/api'
import { getGuestToken } from '@campfire/app-core'
import { LoadingScreen } from '@campfire/ui'

export const Route = createFileRoute('/c/$slug/')({
  ssr: false,
  component: CampfireRedirect,
})

function CampfireRedirect() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()
  const { isLoading } = useConvexAuth()
  const guestToken = getGuestToken(slug) ?? undefined

  const campfire = useQuery(
    api.campfires.getBySlug,
    !isLoading ? { slug, guestToken } : 'skip',
  )

  useEffect(() => {
    if (isLoading || campfire === undefined) {
      return
    }

    if (campfire?.canManage) {
      void navigate({ to: '/c/$slug/home', params: { slug }, replace: true })
      return
    }

    void navigate({ to: '/c/$slug/album', params: { slug }, replace: true })
  }, [campfire, isLoading, navigate, slug])

  return <LoadingScreen />
}

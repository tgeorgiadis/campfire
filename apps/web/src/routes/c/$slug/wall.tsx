import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { useEffect } from 'react'
import { api } from '@campfire/backend/convex/_generated/api'
import { buildAlbumUrl, buildJoinUrl, getGuestToken } from '@campfire/app-core'
import { PhotoWallSkeleton, WallUnavailableScreen } from '@campfire/ui'
import { WebWallExperience } from '~/lib/WebWallExperience'

export const Route = createFileRoute('/c/$slug/wall')({
  ssr: false,
  component: PhotoWall,
})

function PhotoWall() {
  const { slug } = Route.useParams()
  const guestToken = getGuestToken(slug) ?? undefined

  useEffect(() => {
    const prev = document.body.style.backgroundColor
    document.body.style.backgroundColor = '#000000'
    return () => {
      document.body.style.backgroundColor = prev
    }
  }, [])

  const publicSettings = useQuery(api.campfires.getPublicSettings, {
    slug,
    guestToken,
  })

  const photos = useQuery(api.photos.listForWall, { slug, guestToken })

  if (publicSettings === undefined || photos === undefined) {
    return <PhotoWallSkeleton />
  }

  if (publicSettings === null) {
    return <WallUnavailableScreen />
  }

  const joinUrl = guestToken
    ? buildJoinUrl(slug, guestToken)
    : buildAlbumUrl(slug)

  return (
    <WebWallExperience
      publicSettings={publicSettings}
      photos={photos}
      joinUrl={joinUrl}
    />
  )
}

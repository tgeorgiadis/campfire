import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useConvexAuth, useMutation } from 'convex/react'
import { useEffect, useState } from 'react'
import { api } from '@campfire/backend/convex/_generated/api'
import { buildJoinUrl, setGuestToken } from '@campfire/app-core'
import { CreateCampfireScreen, LoadingScreen } from '@campfire/ui'
import { QrCanvas } from '~/lib/QrCanvas'

export const Route = createFileRoute('/campfires/new')({
  ssr: false,
  component: CreateCampfire,
})

function CreateCampfire() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const navigate = useNavigate()
  const createCampfire = useMutation(api.campfires.create)
  const [name, setName] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>('private')
  const [error, setError] = useState<string | null>(null)
  const [created, setCreated] = useState<{ slug: string; guestToken: string } | null>(
    null,
  )

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void navigate({ to: '/sign-in' })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading || !isAuthenticated) {
    return <LoadingScreen />
  }

  const joinUrl = created
    ? buildJoinUrl(created.slug, created.guestToken)
    : ''

  return (
    <CreateCampfireScreen
      name={name}
      onNameChange={setName}
      visibility={visibility}
      onVisibilityChange={setVisibility}
      error={error}
      created={created !== null}
      joinUrl={joinUrl}
      qrElement={created ? <QrCanvas url={joinUrl} size={240} /> : undefined}
      onSubmit={() => {
        setError(null)
        void createCampfire({ name, visibility })
          .then((result) => {
            setGuestToken(result.slug, result.guestToken)
            setCreated({ slug: result.slug, guestToken: result.guestToken })
          })
          .catch((err: unknown) => {
            setError(err instanceof Error ? err.message : 'Failed to create')
          })
      }}
      onHome={() => void navigate({ to: '/' })}
      onCreate={() => void navigate({ to: '/campfires/new' })}
      onProfile={() => void navigate({ to: '/profile' })}
      onOpenBoard={() => {
        if (created) {
          void navigate({ to: '/c/$slug', params: { slug: created.slug } })
        }
      }}
    />
  )
}

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useConvexAuth, useMutation } from 'convex/react'
import { useEffect, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '@campfire/backend/convex/_generated/api'
import {
  resolveDefaultCampfireSlug,
  setGuestToken,
  setLastCampfireSlug,
} from '@campfire/app-core'
import { HomeLoggedOutScreen, LoadingScreen, StartupWizardScreen } from '@campfire/ui'

export const Route = createFileRoute('/')({
  ssr: false,
  component: Dashboard,
})

function Dashboard() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return (
      <HomeLoggedOutScreen onSignIn={() => void navigate({ to: '/sign-in' })} />
    )
  }

  return <AuthenticatedDashboard />
}

function AuthenticatedDashboard() {
  const navigate = useNavigate()
  const { data: campfires } = useSuspenseQuery(
    convexQuery(api.campfires.listMine, {}),
  )
  const createCampfire = useMutation(api.campfires.create)
  const [name, setName] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>('private')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const defaultSlug = resolveDefaultCampfireSlug(campfires)

  useEffect(() => {
    if (defaultSlug) {
      void navigate({
        to: '/c/$slug/home',
        params: { slug: defaultSlug },
        replace: true,
      })
    }
  }, [defaultSlug, navigate])

  if (defaultSlug) {
    return <LoadingScreen message="Opening your campfire…" />
  }

  return (
    <StartupWizardScreen
      name={name}
      onNameChange={setName}
      visibility={visibility}
      onVisibilityChange={setVisibility}
      error={error}
      submitting={submitting}
      onSubmit={() => {
        if (!name.trim()) {
          setError('Enter an event name')
          return
        }
        setError(null)
        setSubmitting(true)
        void createCampfire({ name: name.trim(), visibility })
          .then((result) => {
            setGuestToken(result.slug, result.guestToken)
            setLastCampfireSlug(result.slug)
            void navigate({
              to: '/c/$slug/home',
              params: { slug: result.slug },
              replace: true,
            })
          })
          .catch((err: unknown) => {
            setSubmitting(false)
            setError(err instanceof Error ? err.message : 'Failed to create')
          })
      }}
    />
  )
}

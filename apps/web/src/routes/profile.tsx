import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth } from 'convex/react'
import { LoadingScreen, ProfileScreen } from '@campfire/ui'

export const Route = createFileRoute('/profile')({
  ssr: false,
  component: Profile,
})

function Profile() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signOut } = useAuthActions()
  const navigate = useNavigate()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    void navigate({ to: '/sign-in' })
    return <LoadingScreen />
  }

  return (
    <ProfileScreen
      onHome={() => void navigate({ to: '/' })}
      onCreate={() => void navigate({ to: '/campfires/new' })}
      onSignOut={() => void signOut()}
    />
  )
}

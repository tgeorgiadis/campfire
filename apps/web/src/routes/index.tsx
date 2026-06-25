import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useConvexAuth } from 'convex/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '@campfire/backend/convex/_generated/api'
import { HomeLoggedOutScreen, HomeScreen, LoadingScreen } from '@campfire/ui'

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

  return (
    <HomeScreen
      campfires={campfires}
      onOpenCampfire={(slug) =>
        void navigate({ to: '/c/$slug', params: { slug } })
      }
      onCreate={() => void navigate({ to: '/campfires/new' })}
      onHome={() => void navigate({ to: '/' })}
      onProfile={() => void navigate({ to: '/profile' })}
    />
  )
}

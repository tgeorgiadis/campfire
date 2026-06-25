import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { setGuestToken } from '@campfire/app-core'
import { JoinScreen } from '@campfire/ui'
import '~/lib/initGuestToken'

export const Route = createFileRoute('/c/$slug/join')({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: JoinCampfire,
})

function JoinCampfire() {
  const { slug } = Route.useParams()
  const { token } = Route.useSearch()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      setGuestToken(slug, token)
      void navigate({ to: '/c/$slug', params: { slug }, replace: true })
    }
  }, [slug, token, navigate])

  return (
    <JoinScreen
      invalid={!token}
      onTryBoard={() => void navigate({ to: '/c/$slug', params: { slug } })}
    />
  )
}

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { NotFoundScreen } from '@campfire/ui'

export const Route = createFileRoute('/$')({
  ssr: false,
  component: NotFound,
})

function NotFound() {
  const navigate = useNavigate()

  return <NotFoundScreen onHome={() => void navigate({ to: '/' })} />
}

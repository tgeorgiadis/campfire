import { createFileRoute } from '@tanstack/react-router'
import { BrandStoryboardScreen } from '@campfire/ui'

export const Route = createFileRoute('/brand')({
  ssr: false,
  component: BrandStoryboardPage,
})

function BrandStoryboardPage() {
  return <BrandStoryboardScreen />
}

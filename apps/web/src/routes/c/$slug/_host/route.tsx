import { createFileRoute } from '@tanstack/react-router'
import { EventManagerLayout } from '~/lib/EventManagerLayout'
import { dashboardQuery, listMineQuery } from '~/lib/eventQueries'

export const Route = createFileRoute('/c/$slug/_host')({
  ssr: false,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(listMineQuery())
    await context.queryClient.ensureQueryData(dashboardQuery(params.slug))
  },
  component: HostLayoutRoute,
})

function HostLayoutRoute() {
  const { slug } = Route.useParams()
  return <EventManagerLayout slug={slug} />
}

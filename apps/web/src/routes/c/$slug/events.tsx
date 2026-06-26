import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { api } from '@campfire/backend/convex/_generated/api'
import { setGuestToken, setLastCampfireSlug } from '@campfire/app-core'
import { MyEventsScreen } from '@campfire/ui'
import type { CreateEventFormData } from '@campfire/ui'
import { WebDateInput } from '~/lib/eventWebUtils'
import { EventManagerGate } from '~/lib/useEventManager'

export const Route = createFileRoute('/c/$slug/events')({
  ssr: false,
  validateSearch: (search: Record<string, unknown>) => ({
    create: search.create === true || search.create === 'true',
  }),
  component: MyEvents,
})

function MyEvents() {
  const { slug } = Route.useParams()
  const { create } = Route.useSearch()
  const navigate = useNavigate()
  const createCampfire = useMutation(api.campfires.create)
  const [createError, setCreateError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [eventDate, setEventDate] = useState('')

  const closeCreateModal = () => {
    setCreateError(null)
    setEventDate('')
    void navigate({
      to: '/c/$slug/events',
      params: { slug },
      search: { create: false },
    })
  }

  return (
    <EventManagerGate slug={slug}>
      {(ctx) => (
        <MyEventsScreen
          slug={slug}
          campfires={ctx.campfires}
          events={ctx.campfires}
          activeTab="events"
          onNavigate={ctx.nav.onNavigate}
          onSwitchEvent={ctx.nav.onSwitchEvent}
          onSignOut={ctx.nav.onSignOut}
          onViewAllEvents={ctx.nav.onViewAllEvents}
          onCreateCampfire={ctx.nav.onCreateCampfire}
          onOpenEvent={(nextSlug) => {
            void navigate({ to: '/c/$slug/home', params: { slug: nextSlug } })
          }}
          createModalOpen={create}
          onCreateModalClose={closeCreateModal}
          createSubmitting={submitting}
          createError={createError}
          dateValue={eventDate}
          onDateChange={setEventDate}
          dateInput={
            <WebDateInput value={eventDate} onChange={setEventDate} />
          }
          onCreateEvent={(data: CreateEventFormData) => {
            setCreateError(null)
            setSubmitting(true)
            void createCampfire({
              name: data.name,
              visibility: 'private',
              eventDate: data.eventDate,
              eventType: data.eventType,
            })
              .then((result) => {
                setGuestToken(result.slug, result.guestToken)
                setLastCampfireSlug(result.slug)
                void navigate({
                  to: '/c/$slug/home',
                  params: { slug: result.slug },
                })
              })
              .catch((err: unknown) => {
                setSubmitting(false)
                setCreateError(
                  err instanceof Error ? err.message : 'Failed to create event',
                )
              })
          }}
          eventSwitcher={ctx.eventSwitcher}
        />
      )}
    </EventManagerGate>
  )
}

import type { CampfireListItem } from '@campfire/app-core'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { EventShell, type EventNavTab } from '../components/EventShell'
import { PrimaryButton } from '../components/PrimaryButton'
import type { CampfireSummary } from '@campfire/app-core'
import { CreateEventModal, type CreateEventFormData } from './CreateEventModal'

function formatCreatedDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function MyEventsContent({
  slug,
  events,
  onOpenEvent,
  onCreateEvent,
  createModalOpen,
  onCreateModalClose,
  createSubmitting,
  createError,
  dateValue,
  onDateChange,
  dateInput,
}: {
  slug: string
  events: Array<CampfireListItem>
  onOpenEvent: (slug: string) => void
  onCreateEvent: (data: CreateEventFormData) => void
  createModalOpen: boolean
  onCreateModalClose: () => void
  createSubmitting?: boolean
  createError: string | null
  dateValue?: string
  onDateChange?: (value: string) => void
  dateInput?: ReactNode
}) {
  const [localModalOpen, setLocalModalOpen] = useState(false)
  const modalOpen = createModalOpen || localModalOpen

  const openModal = () => {
    setLocalModalOpen(true)
  }

  const closeModal = () => {
    setLocalModalOpen(false)
    onCreateModalClose()
  }

  return (
    <>
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-ig-text">My Events</Text>
          <Text className="text-sm text-ig-muted">
            Here you can find all your campfires or create a new one.
          </Text>
        </View>

        <PrimaryButton
          label="+ Create new campfire"
          variant="secondary"
          onPress={openModal}
        />

        <View className="flex-row flex-wrap gap-4">
          {events.map((event) => (
            <Pressable
              key={event._id}
              onPress={() => onOpenEvent(event.slug)}
              className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] border border-cf-card-border rounded-xl bg-cf-card overflow-hidden"
            >
              <View className="p-4 gap-3">
                <Text className="text-lg font-semibold text-ig-text">{event.name}</Text>
                <View className="gap-1">
                  <Text className="text-sm text-ig-muted">
                    {event.uploadCount} upload{event.uploadCount === 1 ? '' : 's'}
                  </Text>
                  <Text className="text-sm text-ig-muted">
                    Created on {formatCreatedDate(event.createdAt)}
                  </Text>
                </View>
              </View>
              {event.slug === slug ? (
                <View className="border-t border-ig-border bg-ig-page py-2 items-center">
                  <Text className="text-sm font-semibold text-ig-text">Current Event</Text>
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>
      </View>

      <CreateEventModal
        visible={modalOpen}
        onClose={closeModal}
        onSubmit={onCreateEvent}
        submitting={createSubmitting}
        error={createError}
        dateInput={dateInput}
        dateValue={dateValue}
        onDateChange={onDateChange}
      />
    </>
  )
}

export function MyEventsScreen({
  slug,
  campfires,
  events,
  activeTab,
  userEmail,
  onNavigate,
  onSwitchEvent,
  onSignOut,
  onViewAllEvents,
  onCreateCampfire,
  onOpenEvent,
  onCreateEvent,
  createModalOpen,
  onCreateModalClose,
  createSubmitting,
  createError,
  dateValue,
  onDateChange,
  dateInput,
  eventSwitcher,
}: {
  slug: string
  campfires: Array<CampfireSummary>
  events: Array<CampfireListItem>
  activeTab: EventNavTab
  userEmail?: string | null
  onNavigate: (tab: EventNavTab) => void
  onSwitchEvent: (slug: string) => void
  onSignOut: () => void
  onViewAllEvents: () => void
  onCreateCampfire: () => void
  onOpenEvent: (slug: string) => void
  onCreateEvent: (data: CreateEventFormData) => void
  createModalOpen: boolean
  onCreateModalClose: () => void
  createSubmitting?: boolean
  createError: string | null
  dateValue?: string
  onDateChange?: (value: string) => void
  dateInput?: ReactNode
  eventSwitcher?: ReactNode
}) {
  return (
    <EventShell
      slug={slug}
      campfires={campfires}
      activeTab={activeTab}
      userEmail={userEmail}
      onNavigate={onNavigate}
      onSwitchEvent={onSwitchEvent}
      onSignOut={onSignOut}
      onViewAllEvents={onViewAllEvents}
      onCreateCampfire={onCreateCampfire}
      eventSwitcher={eventSwitcher}
    >
      <MyEventsContent
        slug={slug}
        events={events}
        onOpenEvent={onOpenEvent}
        onCreateEvent={onCreateEvent}
        createModalOpen={createModalOpen}
        onCreateModalClose={onCreateModalClose}
        createSubmitting={createSubmitting}
        createError={createError}
        dateValue={dateValue}
        onDateChange={onDateChange}
        dateInput={dateInput}
      />
    </EventShell>
  )
}

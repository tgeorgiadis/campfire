import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { EventManagerContext } from './eventContext'

export type EventManagerContextValue = EventManagerContext & {
  slug: string
  dashboardLoading: boolean
  userEmail?: string | null
}

const EventManagerReactContext = createContext<EventManagerContextValue | null>(null)

export function EventManagerProvider({
  value,
  children,
}: {
  value: EventManagerContextValue
  children: ReactNode
}) {
  return (
    <EventManagerReactContext.Provider value={value}>
      {children}
    </EventManagerReactContext.Provider>
  )
}

export function useEventManagerContext(): EventManagerContextValue {
  const ctx = useContext(EventManagerReactContext)
  if (ctx == null) {
    throw new Error('useEventManagerContext must be used within EventManagerProvider')
  }
  return ctx
}

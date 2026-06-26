import type { CampfireDashboard, CampfireListItem } from '@campfire/app-core'
import type { ReactNode } from 'react'
import type { EventNavTab } from '@campfire/ui'

export type EventManagerContext = {
  campfires: Array<CampfireListItem>
  dashboard: CampfireDashboard
  eventSwitcher: ReactNode | undefined
  nav: {
    onNavigate: (tab: EventNavTab) => void
    onSwitchEvent: (slug: string) => void
    onSignOut: () => void
    onCreateCampfire: () => void
    onViewAllEvents: () => void
  }
}

export type PublicCampfireSettings = {
  _id: CampfireDashboard['_id']
  name: string
  slug: string
  settings: CampfireDashboard['settings']
  canView: boolean
  canUpload: boolean
  canComment: boolean
  role: 'owner' | 'member' | null
  isGuest: boolean
}

import type { ReactNode } from 'react'
import type { CampfireDashboard } from '@campfire/app-core'
import { Text, View } from 'react-native'
import {
  CopyField,
  DashboardCard,
  MonitorMockup,
  PhoneMockup,
} from '../components/EventComponents'
import { EventShell, type EventNavTab } from '../components/EventShell'
import type { CampfireSummary } from '@campfire/app-core'

export function EventHomeContent({
  dashboard,
  joinUrl,
  albumUrl,
  wallUrl,
  qrElement,
  onCopy,
  onOpenUrl,
  onDownloadQr,
}: {
  dashboard: CampfireDashboard
  joinUrl: string
  albumUrl: string
  wallUrl: string
  qrElement?: ReactNode
  onCopy: (url: string) => void
  onOpenUrl: (url: string) => void
  onDownloadQr?: () => void
}) {
  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-3xl font-bold text-ig-text">{dashboard.name}</Text>
        <Text className="text-sm text-ig-muted">
          Here you&apos;ll find everything you need to share your album and photo wall with
          guests.
        </Text>
      </View>

      <DashboardCard
        title="Your Digital Album"
        description="Share this link or QR code so everyone who came can upload and view photos."
      >
        <View className="flex-row flex-wrap gap-6 items-start">
          <View className="flex-1 min-w-[280px] gap-4">
            <CopyField
              value={joinUrl}
              onCopy={() => onCopy(joinUrl)}
              onOpen={() => onOpenUrl(albumUrl)}
            />
            <View className="items-center gap-3">
              {qrElement}
              {onDownloadQr ? (
                <Text
                  className="text-sm text-cf-accent font-medium"
                  onPress={onDownloadQr}
                >
                  Download QR Code
                </Text>
              ) : null}
            </View>
          </View>
          <PhoneMockup />
        </View>
      </DashboardCard>

      <DashboardCard
        title="Your Photo Wall"
        description="Uploads appear here automatically. Display on TVs or screens at your event."
      >
        <View className="gap-4">
          <CopyField
            value={wallUrl}
            onCopy={() => onCopy(wallUrl)}
            onOpen={() => onOpenUrl(wallUrl)}
          />
          <MonitorMockup qrUrl={joinUrl} />
          <Text className="text-xs text-ig-muted">
            Display on: laptop, monitor, or TV — open the link above in fullscreen.
          </Text>
        </View>
      </DashboardCard>
    </View>
  )
}

export function EventHomeScreen({
  slug,
  campfires,
  dashboard,
  joinUrl,
  albumUrl,
  wallUrl,
  qrElement,
  activeTab,
  userEmail,
  onNavigate,
  onSwitchEvent,
  onSignOut,
  onCreateCampfire,
  onViewAllEvents,
  onCopy,
  onOpenUrl,
  onDownloadQr,
  eventSwitcher,
}: {
  slug: string
  campfires: CampfireSummary[]
  dashboard: CampfireDashboard
  joinUrl: string
  albumUrl: string
  wallUrl: string
  qrElement?: ReactNode
  activeTab: EventNavTab
  userEmail?: string | null
  onNavigate: (tab: EventNavTab) => void
  onSwitchEvent: (slug: string) => void
  onSignOut: () => void
  onCreateCampfire: () => void
  onViewAllEvents: () => void
  onCopy: (url: string) => void
  onOpenUrl: (url: string) => void
  onDownloadQr?: () => void
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
      onCreateCampfire={onCreateCampfire}
      onViewAllEvents={onViewAllEvents}
      eventSwitcher={eventSwitcher}
    >
      <EventHomeContent
        dashboard={dashboard}
        joinUrl={joinUrl}
        albumUrl={albumUrl}
        wallUrl={wallUrl}
        qrElement={qrElement}
        onCopy={onCopy}
        onOpenUrl={onOpenUrl}
        onDownloadQr={onDownloadQr}
      />
    </EventShell>
  )
}

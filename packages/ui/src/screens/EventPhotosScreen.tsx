import type { PhotoItem, PhotoStatus } from '@campfire/app-core'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { ElevatedSurface } from '../components/brand/ElevatedSurface'
import {
  focusRing,
  pillSelected,
  pillUnselected,
  pressableBase,
  tabHover,
} from '../components/motion/motionClasses'
import { EventShell, type EventNavTab } from '../components/EventShell'
import { MediaGrid } from '../components/MediaGrid'
import { PrimaryButton } from '../components/PrimaryButton'
import { TextField } from '../components/TextField'
import type { CampfireDashboard, CampfireSummary } from '@campfire/app-core'
import { TEXT_POST_BACKGROUNDS } from '@campfire/app-core'

type TabId = PhotoStatus

export function EventPhotosContent({
  dashboard,
  photos,
  photoTab,
  onPhotoTabChange,
  onUpload,
  onDownloadAll,
  onApprove,
  onHide,
  onDelete,
  onCreateTextPost,
  fileInput,
  uploading,
  uploadError,
}: {
  dashboard: CampfireDashboard
  photos: PhotoItem[]
  photoTab: TabId
  onPhotoTabChange: (tab: TabId) => void
  onUpload: () => void
  onDownloadAll: () => void
  onApprove: (photo: PhotoItem) => void
  onHide: (photo: PhotoItem) => void
  onDelete: (photo: PhotoItem) => void
  onCreateTextPost: (body: string, background: string) => void
  fileInput?: ReactNode
  uploading: boolean
  uploadError: string | null
}) {
  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: 'published', label: 'Published', count: dashboard.counts.published },
    { id: 'pending', label: 'Need Approval', count: dashboard.counts.pending },
    { id: 'hidden', label: 'Hidden', count: dashboard.counts.hidden },
  ]

  const [textOpen, setTextOpen] = useState(false)
  const [textBody, setTextBody] = useState('')
  const [textBg, setTextBg] = useState<string>(TEXT_POST_BACKGROUNDS[0])

  return (
    <View className="gap-6">
      <ElevatedSurface className="border border-ig-border rounded-xl bg-ig-surface p-6 gap-4">
        <Text className="text-xl font-semibold text-ig-text">Your Photos & Videos</Text>
        <Text className="text-sm text-ig-muted">
          Find, upload, and view photos from everyone who came. Approved items appear on your
          photo wall and digital album.
        </Text>
        <View className="flex-row flex-wrap gap-3">
          <PrimaryButton label="Upload Photos" onPress={onUpload} disabled={uploading} />
          <PrimaryButton
            label="Download All"
            onPress={onDownloadAll}
            variant="secondary"
          />
          <PrimaryButton
            label="Text Post"
            onPress={() => setTextOpen(!textOpen)}
            variant="secondary"
          />
        </View>
        {fileInput}
        {uploadError ? (
          <Text className="text-sm text-ig-red">{uploadError}</Text>
        ) : null}
        <Text className="text-sm text-ig-muted">
          {dashboard.counts.total} uploads total
        </Text>
      </ElevatedSurface>

      {textOpen ? (
        <View className="border border-ig-border rounded-lg p-4 gap-3 bg-ig-surface">
          <Text className="text-sm font-semibold text-ig-text">New text post</Text>
          <TextField
            value={textBody}
            onChangeText={setTextBody}
            placeholder="Share a message with the group"
          />
          <View className="flex-row flex-wrap gap-2">
            {TEXT_POST_BACKGROUNDS.map((bg) => (
              <Pressable
                key={bg}
                onPress={() => setTextBg(bg)}
                className={`px-2 py-1 rounded border ${pressableBase} ${focusRing} active:scale-95 ${
                  textBg === bg
                    ? pillSelected
                    : `border-ig-border bg-ig-surface ${pillUnselected}`
                }`}
              >
                <Text className="text-xs text-ig-text">{bg}</Text>
              </Pressable>
            ))}
          </View>
          <PrimaryButton
            label="Post"
            onPress={() => {
              onCreateTextPost(textBody, textBg)
              setTextBody('')
              setTextOpen(false)
            }}
          />
        </View>
      ) : null}

      <View className="flex-row flex-wrap gap-2 border-b border-ig-border pb-2">
        {tabs.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => onPhotoTabChange(t.id)}
            className={`px-4 py-2 rounded-t-lg transition-colors duration-150 ${focusRing} ${
              photoTab === t.id ? 'border-b-2 border-cf-accent' : tabHover
            }`}
          >
            <Text
              className={`text-sm font-medium transition-colors duration-150 ${
                photoTab === t.id ? 'text-cf-accent' : 'text-ig-muted'
              }`}
            >
              {t.label} ({t.count})
            </Text>
          </Pressable>
        ))}
      </View>

      <MediaGrid
        photos={photos}
        onPhotoPress={() => {}}
        onApprove={onApprove}
        onHide={onHide}
        onDelete={onDelete}
        showActions
      />
    </View>
  )
}

export function EventPhotosScreen({
  slug,
  campfires,
  dashboard,
  photos,
  photoTab,
  onPhotoTabChange,
  activeTab,
  userEmail,
  onNavigate,
  onSwitchEvent,
  onSignOut,
  onCreateCampfire,
  onViewAllEvents,
  onUpload,
  onDownloadAll,
  onApprove,
  onHide,
  onDelete,
  onCreateTextPost,
  fileInput,
  uploading,
  uploadError,
  eventSwitcher,
}: {
  slug: string
  campfires: CampfireSummary[]
  dashboard: CampfireDashboard
  photos: PhotoItem[]
  photoTab: TabId
  onPhotoTabChange: (tab: TabId) => void
  activeTab: EventNavTab
  userEmail?: string | null
  onNavigate: (tab: EventNavTab) => void
  onSwitchEvent: (slug: string) => void
  onSignOut: () => void
  onCreateCampfire: () => void
  onViewAllEvents: () => void
  onUpload: () => void
  onDownloadAll: () => void
  onApprove: (photo: PhotoItem) => void
  onHide: (photo: PhotoItem) => void
  onDelete: (photo: PhotoItem) => void
  onCreateTextPost: (body: string, background: string) => void
  fileInput?: ReactNode
  uploading: boolean
  uploadError: string | null
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
      <EventPhotosContent
        dashboard={dashboard}
        photos={photos}
        photoTab={photoTab}
        onPhotoTabChange={onPhotoTabChange}
        onUpload={onUpload}
        onDownloadAll={onDownloadAll}
        onApprove={onApprove}
        onHide={onHide}
        onDelete={onDelete}
        onCreateTextPost={onCreateTextPost}
        fileInput={fileInput}
        uploading={uploading}
        uploadError={uploadError}
      />
    </EventShell>
  )
}

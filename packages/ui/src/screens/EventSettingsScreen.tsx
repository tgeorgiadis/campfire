import type {
  AlbumPermission,
  CampfireDashboard,
  CampfireMember,
  CampfireSummary,
  CaptionTheme,
  EventType,
  SettingsTab,
} from '@campfire/app-core'
import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import {
  SettingsRow,
  SettingsTabBar,
  ToggleSwitch,
} from '../components/EventComponents'
import { EventShell, type EventNavTab } from '../components/EventShell'
import { PrimaryButton, TextButton } from '../components/PrimaryButton'
import { TextField } from '../components/TextField'
import { SelectablePill } from '../components/SelectablePill'
import { EVENT_TYPE_OPTIONS } from '../lib/eventTypes'
import {
  focusRing,
  pressableBase,
} from '../components/motion/motionClasses'
import { SkeletonBlock } from '../components/skeletons/SkeletonBlock'

const SETTINGS_TABS = [
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'photo-wall', label: 'Photo Wall' },
  { id: 'moderation', label: 'Moderation' },
  { id: 'collaborators', label: 'Collaborators' },
]

export function EventSettingsContent({
  dashboard,
  members,
  settingsTab,
  onSettingsTabChange,
  onSaveGeneral,
  onSaveAppearance,
  onSaveWall,
  onSaveModeration,
  onInvite,
  onRemoveMember,
  onUploadAsset,
  generalForm,
  onGeneralFormChange,
  appearanceForm,
  onAppearanceFormChange,
  wallForm,
  onWallFormChange,
  moderationForm,
  onModerationFormChange,
  inviteEmail,
  onInviteEmailChange,
  inviteError,
}: {
  dashboard: CampfireDashboard
  members?: CampfireMember[]
  settingsTab: SettingsTab
  onSettingsTabChange: (tab: SettingsTab) => void
  onSaveGeneral: () => void
  onSaveAppearance: () => void
  onSaveWall: () => void
  onSaveModeration: () => void
  onInvite: () => void
  onRemoveMember: (memberId: CampfireMember['_id']) => void
  onUploadAsset: (kind: 'logo' | 'albumBg' | 'wallBg') => void
  generalForm: {
    name: string
    eventDate: string
    eventType: EventType
    customSlug: string
  }
  onGeneralFormChange: (patch: Partial<typeof generalForm>) => void
  appearanceForm: {
    themeColor: string
    displayLanguage: string
    welcomeScreenEnabled: boolean
    welcomeScreenTitle: string
    welcomeScreenMessage: string
    removeBranding: boolean
    captionTheme: CaptionTheme
  }
  onAppearanceFormChange: (patch: Partial<typeof appearanceForm>) => void
  wallForm: {
    imageDurationSec: string
    videoDurationSec: string
    textDurationSec: string
    autoVideoDuration: boolean
    hideSideImages: boolean
    hideWallQr: boolean
    hideWallCaption: boolean
    hideWallLikes: boolean
  }
  onWallFormChange: (patch: Partial<typeof wallForm>) => void
  moderationForm: {
    requireApproval: boolean
    contentFilterEnabled: boolean
    allowedPhotos: boolean
    allowedVideos: boolean
    allowedText: boolean
    albumPermission: AlbumPermission
    disableGuestDownload: boolean
    disableLikes: boolean
  }
  onModerationFormChange: (patch: Partial<typeof moderationForm>) => void
  inviteEmail: string
  onInviteEmailChange: (value: string) => void
  inviteError: string | null
}) {
  const isOwner = dashboard.role === 'owner'

  return (
    <>
      <SettingsTabBar
        tabs={SETTINGS_TABS}
        active={settingsTab}
        onChange={(id) => onSettingsTabChange(id as SettingsTab)}
      />

      {settingsTab === 'general' ? (
        <View className="gap-4 max-w-xl">
          <TextField
            value={generalForm.name}
            onChangeText={(name) => onGeneralFormChange({ name })}
            placeholder="Event name"
          />
          <Text className="text-xs text-ig-muted">
            Used throughout the app and shown to guests.
          </Text>
          <TextField
            value={generalForm.eventDate}
            onChangeText={(eventDate) => onGeneralFormChange({ eventDate })}
            placeholder="YYYY-MM-DD"
          />
          <View className="flex-row flex-wrap gap-2">
            {EVENT_TYPE_OPTIONS.map((type) => (
              <SelectablePill
                key={type.id}
                label={type.label}
                emoji={type.emoji}
                selected={generalForm.eventType === type.id}
                onPress={() => onGeneralFormChange({ eventType: type.id })}
              />
            ))}
          </View>
          <Text className="text-sm font-semibold text-ig-text">Event link</Text>
          <TextField
            value={generalForm.customSlug}
            onChangeText={(customSlug) => onGeneralFormChange({ customSlug })}
            placeholder="custom-slug"
          />
          {isOwner ? (
            <PrimaryButton label="Save general settings" onPress={onSaveGeneral} />
          ) : null}
        </View>
      ) : null}

      {settingsTab === 'appearance' ? (
        <View>
          <SettingsRow
            title="Event logo"
            description="Square photos work best (1:1)."
            control={
              <PrimaryButton
                label="Upload"
                variant="secondary"
                onPress={() => onUploadAsset('logo')}
              />
            }
          />
          <SettingsRow
            title="Theme color"
            control={
              <TextField
                value={appearanceForm.themeColor}
                onChangeText={(themeColor) =>
                  onAppearanceFormChange({ themeColor })
                }
              />
            }
          />
          <SettingsRow
            title="Display language"
            control={
              <TextField
                value={appearanceForm.displayLanguage}
                onChangeText={(displayLanguage) =>
                  onAppearanceFormChange({ displayLanguage })
                }
              />
            }
          />
          <SettingsRow
            title="Welcome screen"
            description="Intro screen for guests on first visit."
            control={
              <ToggleSwitch
                value={appearanceForm.welcomeScreenEnabled}
                onChange={(welcomeScreenEnabled) =>
                  onAppearanceFormChange({ welcomeScreenEnabled })
                }
              />
            }
          />
          {appearanceForm.welcomeScreenEnabled ? (
            <View className="gap-2 pb-4">
              <TextField
                value={appearanceForm.welcomeScreenTitle}
                onChangeText={(welcomeScreenTitle) =>
                  onAppearanceFormChange({ welcomeScreenTitle })
                }
                placeholder="Welcome title"
              />
              <TextField
                value={appearanceForm.welcomeScreenMessage}
                onChangeText={(welcomeScreenMessage) =>
                  onAppearanceFormChange({ welcomeScreenMessage })
                }
                placeholder="Welcome message"
              />
            </View>
          ) : null}
          <SettingsRow
            title="Remove Campfire branding"
            control={
              <ToggleSwitch
                value={appearanceForm.removeBranding}
                onChange={(removeBranding) =>
                  onAppearanceFormChange({ removeBranding })
                }
              />
            }
          />
          <SettingsRow
            title="Album background"
            control={
              <PrimaryButton
                label="Upload"
                variant="secondary"
                onPress={() => onUploadAsset('albumBg')}
              />
            }
          />
          <SettingsRow
            title="Caption theme"
            control={
              <View className="flex-row gap-2">
                {(['dark', 'light'] as const).map((theme) => (
                  <Pressable
                    key={theme}
                    onPress={() => onAppearanceFormChange({ captionTheme: theme })}
                    className={`px-3 py-1 rounded border ${
                      appearanceForm.captionTheme === theme
                        ? 'border-cf-accent'
                        : 'border-ig-border'
                    }`}
                  >
                    <Text className="text-sm capitalize">{theme}</Text>
                  </Pressable>
                ))}
              </View>
            }
          />
          {isOwner ? (
            <PrimaryButton label="Save appearance" onPress={onSaveAppearance} />
          ) : null}
        </View>
      ) : null}

      {settingsTab === 'photo-wall' ? (
        <View>
          <SettingsRow
            title="Image duration (seconds)"
            control={
              <TextField
                value={wallForm.imageDurationSec}
                onChangeText={(imageDurationSec) =>
                  onWallFormChange({ imageDurationSec })
                }
              />
            }
          />
          <SettingsRow
            title="Video duration (seconds)"
            control={
              <TextField
                value={wallForm.videoDurationSec}
                onChangeText={(videoDurationSec) =>
                  onWallFormChange({ videoDurationSec })
                }
              />
            }
          />
          <SettingsRow
            title="Text post duration (seconds)"
            control={
              <TextField
                value={wallForm.textDurationSec}
                onChangeText={(textDurationSec) =>
                  onWallFormChange({ textDurationSec })
                }
              />
            }
          />
          <SettingsRow
            title="Automatic video duration"
            description="Play videos for their full length."
            control={
              <ToggleSwitch
                value={wallForm.autoVideoDuration}
                onChange={(autoVideoDuration) =>
                  onWallFormChange({ autoVideoDuration })
                }
              />
            }
          />
          <SettingsRow
            title="Wall background"
            control={
              <PrimaryButton
                label="Upload"
                variant="secondary"
                onPress={() => onUploadAsset('wallBg')}
              />
            }
          />
          <SettingsRow
            title="Hide side images"
            control={
              <ToggleSwitch
                value={wallForm.hideSideImages}
                onChange={(hideSideImages) => onWallFormChange({ hideSideImages })}
              />
            }
          />
          <SettingsRow
            title="Hide QR code"
            control={
              <ToggleSwitch
                value={wallForm.hideWallQr}
                onChange={(hideWallQr) => onWallFormChange({ hideWallQr })}
              />
            }
          />
          <SettingsRow
            title="Hide caption"
            control={
              <ToggleSwitch
                value={wallForm.hideWallCaption}
                onChange={(hideWallCaption) => onWallFormChange({ hideWallCaption })}
              />
            }
          />
          <SettingsRow
            title="Hide likes"
            control={
              <ToggleSwitch
                value={wallForm.hideWallLikes}
                onChange={(hideWallLikes) => onWallFormChange({ hideWallLikes })}
              />
            }
          />
          {isOwner ? (
            <PrimaryButton label="Save photo wall settings" onPress={onSaveWall} />
          ) : null}
        </View>
      ) : null}

      {settingsTab === 'moderation' ? (
        <View>
          <SettingsRow
            title="Manually approve guest uploads"
            control={
              <ToggleSwitch
                value={moderationForm.requireApproval}
                onChange={(requireApproval) =>
                  onModerationFormChange({ requireApproval })
                }
              />
            }
          />
          <SettingsRow
            title="Automatic content filter"
            description="Blocks explicit content when enabled (best-effort)."
            control={
              <ToggleSwitch
                value={moderationForm.contentFilterEnabled}
                onChange={(contentFilterEnabled) =>
                  onModerationFormChange({ contentFilterEnabled })
                }
              />
            }
          />
          <SettingsRow
            title="Allowed media types"
            control={
              <View className="gap-2">
                <CheckRow
                  label="Photos"
                  checked={moderationForm.allowedPhotos}
                  onChange={(allowedPhotos) =>
                    onModerationFormChange({ allowedPhotos })
                  }
                />
                <CheckRow
                  label="Videos"
                  checked={moderationForm.allowedVideos}
                  onChange={(allowedVideos) =>
                    onModerationFormChange({ allowedVideos })
                  }
                />
                <CheckRow
                  label="Text"
                  checked={moderationForm.allowedText}
                  onChange={(allowedText) => onModerationFormChange({ allowedText })}
                />
              </View>
            }
          />
          <SettingsRow
            title="Digital album permissions"
            control={
              <View className="gap-2">
                {(
                  [
                    ['view_and_upload', 'View & Upload'],
                    ['view_only', 'View Only'],
                    ['upload_only', 'Upload Only'],
                  ] as const
                ).map(([perm, label]) => (
                  <SelectablePill
                    key={perm}
                    label={label}
                    selected={moderationForm.albumPermission === perm}
                    onPress={() => onModerationFormChange({ albumPermission: perm })}
                    className="w-full"
                  />
                ))}
              </View>
            }
          />
          <SettingsRow
            title="Disable guest download"
            control={
              <ToggleSwitch
                value={moderationForm.disableGuestDownload}
                onChange={(disableGuestDownload) =>
                  onModerationFormChange({ disableGuestDownload })
                }
              />
            }
          />
          <SettingsRow
            title="Disable likes"
            control={
              <ToggleSwitch
                value={moderationForm.disableLikes}
                onChange={(disableLikes) => onModerationFormChange({ disableLikes })}
              />
            }
          />
          {isOwner ? (
            <PrimaryButton label="Save moderation settings" onPress={onSaveModeration} />
          ) : null}
        </View>
      ) : null}

      {settingsTab === 'collaborators' ? (
        <View className="gap-4">
          <Text className="text-sm text-ig-muted">
            Invite other members who can access and manage this event.
          </Text>
          {isOwner ? (
            <View className="flex-row gap-2 items-end">
              <View className="flex-1">
                <TextField
                  value={inviteEmail}
                  onChangeText={onInviteEmailChange}
                  placeholder="Email address"
                />
              </View>
              <PrimaryButton label="Invite" onPress={onInvite} />
            </View>
          ) : null}
          {inviteError ? (
            <Text className="text-sm text-ig-red">{inviteError}</Text>
          ) : null}
          <View className="border border-ig-border rounded-lg overflow-hidden">
            <View className="flex-row bg-ig-page px-4 py-2 border-b border-ig-border">
              <Text className="flex-1 text-xs font-semibold text-ig-muted">
                Collaborator
              </Text>
              <Text className="w-24 text-xs font-semibold text-ig-muted">Role</Text>
            </View>
            {members == null ? (
              <>
                <View className="flex-row px-4 py-3 border-b border-ig-border items-center gap-4">
                  <SkeletonBlock className="h-4 flex-1" />
                  <SkeletonBlock className="h-4 w-16" />
                </View>
                <View className="flex-row px-4 py-3 border-b border-ig-border items-center gap-4">
                  <SkeletonBlock className="h-4 flex-1" />
                  <SkeletonBlock className="h-4 w-16" />
                </View>
              </>
            ) : (
              members.map((member) => (
              <View
                key={member._id}
                className="flex-row px-4 py-3 border-b border-ig-border items-center"
              >
                <Text className="flex-1 text-sm text-ig-text">
                  {member.email ?? member.name ?? member.userId}
                </Text>
                <View className="w-24 flex-row items-center gap-2">
                  <Text className="text-sm text-ig-muted capitalize">{member.role}</Text>
                  {isOwner && member.role !== 'owner' ? (
                    <TextButton
                      label="Remove"
                      onPress={() => onRemoveMember(member._id)}
                    />
                  ) : null}
                </View>
              </View>
              ))
            )}
          </View>
        </View>
      ) : null}
    </>
  )
}

export function EventSettingsScreen({
  slug,
  campfires,
  dashboard,
  members,
  activeTab,
  settingsTab,
  userEmail,
  onNavigate,
  onSwitchEvent,
  onSignOut,
  onCreateCampfire,
  onViewAllEvents,
  onSettingsTabChange,
  onSaveGeneral,
  onSaveAppearance,
  onSaveWall,
  onSaveModeration,
  onInvite,
  onRemoveMember,
  onUploadAsset,
  eventSwitcher,
  generalForm,
  onGeneralFormChange,
  appearanceForm,
  onAppearanceFormChange,
  wallForm,
  onWallFormChange,
  moderationForm,
  onModerationFormChange,
  inviteEmail,
  onInviteEmailChange,
  inviteError,
}: {
  slug: string
  campfires: CampfireSummary[]
  dashboard: CampfireDashboard
  members?: CampfireMember[]
  activeTab: EventNavTab
  settingsTab: SettingsTab
  userEmail?: string | null
  onNavigate: (tab: EventNavTab) => void
  onSwitchEvent: (slug: string) => void
  onSignOut: () => void
  onCreateCampfire: () => void
  onViewAllEvents: () => void
  onSettingsTabChange: (tab: SettingsTab) => void
  onSaveGeneral: () => void
  onSaveAppearance: () => void
  onSaveWall: () => void
  onSaveModeration: () => void
  onInvite: () => void
  onRemoveMember: (memberId: CampfireMember['_id']) => void
  onUploadAsset: (kind: 'logo' | 'albumBg' | 'wallBg') => void
  eventSwitcher?: ReactNode
  generalForm: {
    name: string
    eventDate: string
    eventType: EventType
    customSlug: string
  }
  onGeneralFormChange: (patch: Partial<typeof generalForm>) => void
  appearanceForm: {
    themeColor: string
    displayLanguage: string
    welcomeScreenEnabled: boolean
    welcomeScreenTitle: string
    welcomeScreenMessage: string
    removeBranding: boolean
    captionTheme: CaptionTheme
  }
  onAppearanceFormChange: (patch: Partial<typeof appearanceForm>) => void
  wallForm: {
    imageDurationSec: string
    videoDurationSec: string
    textDurationSec: string
    autoVideoDuration: boolean
    hideSideImages: boolean
    hideWallQr: boolean
    hideWallCaption: boolean
    hideWallLikes: boolean
  }
  onWallFormChange: (patch: Partial<typeof wallForm>) => void
  moderationForm: {
    requireApproval: boolean
    contentFilterEnabled: boolean
    allowedPhotos: boolean
    allowedVideos: boolean
    allowedText: boolean
    albumPermission: AlbumPermission
    disableGuestDownload: boolean
    disableLikes: boolean
  }
  onModerationFormChange: (patch: Partial<typeof moderationForm>) => void
  inviteEmail: string
  onInviteEmailChange: (value: string) => void
  inviteError: string | null
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
      <EventSettingsContent
        dashboard={dashboard}
        members={members}
        settingsTab={settingsTab}
        onSettingsTabChange={onSettingsTabChange}
        onSaveGeneral={onSaveGeneral}
        onSaveAppearance={onSaveAppearance}
        onSaveWall={onSaveWall}
        onSaveModeration={onSaveModeration}
        onInvite={onInvite}
        onRemoveMember={onRemoveMember}
        onUploadAsset={onUploadAsset}
        generalForm={generalForm}
        onGeneralFormChange={onGeneralFormChange}
        appearanceForm={appearanceForm}
        onAppearanceFormChange={onAppearanceFormChange}
        wallForm={wallForm}
        onWallFormChange={onWallFormChange}
        moderationForm={moderationForm}
        onModerationFormChange={onModerationFormChange}
        inviteEmail={inviteEmail}
        onInviteEmailChange={onInviteEmailChange}
        inviteError={inviteError}
      />
    </EventShell>
  )
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      className={`flex-row items-center gap-2 rounded ${pressableBase} ${focusRing} hover:bg-cf-accent-light/30 active:bg-cf-accent-light/50 px-1 py-0.5`}
    >
      <View
        className={`w-4 h-4 rounded border ${
          checked ? 'bg-cf-accent border-cf-accent' : 'border-ig-border'
        }`}
      />
      <Text className="text-sm text-ig-text">{label}</Text>
    </Pressable>
  )
}
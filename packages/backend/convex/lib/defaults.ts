import type { Doc } from '../_generated/dataModel'

export type EventType = 'wedding' | 'party' | 'conference' | 'birthday' | 'other'
export type AlbumPermission = 'view_and_upload' | 'view_only' | 'upload_only'
export type CaptionTheme = 'dark' | 'light'
export type PhotoStatus = 'published' | 'pending' | 'hidden'
export type MediaType = 'photo' | 'video' | 'text'

export type CampfireSettings = {
  eventDate: number | undefined
  eventType: EventType
  logoStorageId: Doc<'campfires'>['logoStorageId']
  themeColor: string
  displayLanguage: string
  welcomeScreenEnabled: boolean
  welcomeScreenTitle: string | undefined
  welcomeScreenMessage: string | undefined
  removeBranding: boolean
  albumBackgroundStorageId: Doc<'campfires'>['albumBackgroundStorageId']
  captionTheme: CaptionTheme
  imageDurationSec: number
  videoDurationSec: number
  textDurationSec: number
  autoVideoDuration: boolean
  wallBackgroundStorageId: Doc<'campfires'>['wallBackgroundStorageId']
  hideSideImages: boolean
  hideWallQr: boolean
  hideWallCaption: boolean
  hideWallLikes: boolean
  requireApproval: boolean
  contentFilterEnabled: boolean
  allowedPhotos: boolean
  allowedVideos: boolean
  allowedText: boolean
  albumPermission: AlbumPermission
  disableGuestDownload: boolean
  disableLikes: boolean
}

export const DEFAULT_CAMPFIRE_SETTINGS: CampfireSettings = {
  eventDate: undefined,
  eventType: 'party',
  logoStorageId: undefined,
  themeColor: '#E5634D',
  displayLanguage: 'automatic',
  welcomeScreenEnabled: false,
  welcomeScreenTitle: undefined,
  welcomeScreenMessage: undefined,
  removeBranding: false,
  albumBackgroundStorageId: undefined,
  captionTheme: 'dark',
  imageDurationSec: 8,
  videoDurationSec: 12,
  textDurationSec: 10,
  autoVideoDuration: false,
  wallBackgroundStorageId: undefined,
  hideSideImages: true,
  hideWallQr: false,
  hideWallCaption: false,
  hideWallLikes: false,
  requireApproval: false,
  contentFilterEnabled: false,
  allowedPhotos: true,
  allowedVideos: true,
  allowedText: true,
  albumPermission: 'view_and_upload',
  disableGuestDownload: false,
  disableLikes: false,
}

export function resolveCampfireSettings(
  campfire: Doc<'campfires'>,
): CampfireSettings {
  return {
    eventDate: campfire.eventDate,
    eventType: campfire.eventType ?? DEFAULT_CAMPFIRE_SETTINGS.eventType,
    logoStorageId: campfire.logoStorageId,
    themeColor: campfire.themeColor ?? DEFAULT_CAMPFIRE_SETTINGS.themeColor,
    displayLanguage:
      campfire.displayLanguage ?? DEFAULT_CAMPFIRE_SETTINGS.displayLanguage,
    welcomeScreenEnabled:
      campfire.welcomeScreenEnabled ??
      DEFAULT_CAMPFIRE_SETTINGS.welcomeScreenEnabled,
    welcomeScreenTitle: campfire.welcomeScreenTitle,
    welcomeScreenMessage: campfire.welcomeScreenMessage,
    removeBranding:
      campfire.removeBranding ?? DEFAULT_CAMPFIRE_SETTINGS.removeBranding,
    albumBackgroundStorageId: campfire.albumBackgroundStorageId,
    captionTheme: campfire.captionTheme ?? DEFAULT_CAMPFIRE_SETTINGS.captionTheme,
    imageDurationSec:
      campfire.imageDurationSec ?? DEFAULT_CAMPFIRE_SETTINGS.imageDurationSec,
    videoDurationSec:
      campfire.videoDurationSec ?? DEFAULT_CAMPFIRE_SETTINGS.videoDurationSec,
    textDurationSec:
      campfire.textDurationSec ?? DEFAULT_CAMPFIRE_SETTINGS.textDurationSec,
    autoVideoDuration:
      campfire.autoVideoDuration ?? DEFAULT_CAMPFIRE_SETTINGS.autoVideoDuration,
    wallBackgroundStorageId: campfire.wallBackgroundStorageId,
    hideSideImages:
      campfire.hideSideImages ?? DEFAULT_CAMPFIRE_SETTINGS.hideSideImages,
    hideWallQr: campfire.hideWallQr ?? DEFAULT_CAMPFIRE_SETTINGS.hideWallQr,
    hideWallCaption:
      campfire.hideWallCaption ?? DEFAULT_CAMPFIRE_SETTINGS.hideWallCaption,
    hideWallLikes:
      campfire.hideWallLikes ?? DEFAULT_CAMPFIRE_SETTINGS.hideWallLikes,
    requireApproval:
      campfire.requireApproval ?? DEFAULT_CAMPFIRE_SETTINGS.requireApproval,
    contentFilterEnabled:
      campfire.contentFilterEnabled ??
      DEFAULT_CAMPFIRE_SETTINGS.contentFilterEnabled,
    allowedPhotos:
      campfire.allowedPhotos ?? DEFAULT_CAMPFIRE_SETTINGS.allowedPhotos,
    allowedVideos:
      campfire.allowedVideos ?? DEFAULT_CAMPFIRE_SETTINGS.allowedVideos,
    allowedText: campfire.allowedText ?? DEFAULT_CAMPFIRE_SETTINGS.allowedText,
    albumPermission:
      campfire.albumPermission ?? DEFAULT_CAMPFIRE_SETTINGS.albumPermission,
    disableGuestDownload:
      campfire.disableGuestDownload ??
      DEFAULT_CAMPFIRE_SETTINGS.disableGuestDownload,
    disableLikes:
      campfire.disableLikes ?? DEFAULT_CAMPFIRE_SETTINGS.disableLikes,
  }
}

export function defaultCampfireFields() {
  return {
    eventType: DEFAULT_CAMPFIRE_SETTINGS.eventType,
    themeColor: DEFAULT_CAMPFIRE_SETTINGS.themeColor,
    displayLanguage: DEFAULT_CAMPFIRE_SETTINGS.displayLanguage,
    welcomeScreenEnabled: DEFAULT_CAMPFIRE_SETTINGS.welcomeScreenEnabled,
    removeBranding: DEFAULT_CAMPFIRE_SETTINGS.removeBranding,
    captionTheme: DEFAULT_CAMPFIRE_SETTINGS.captionTheme,
    imageDurationSec: DEFAULT_CAMPFIRE_SETTINGS.imageDurationSec,
    videoDurationSec: DEFAULT_CAMPFIRE_SETTINGS.videoDurationSec,
    textDurationSec: DEFAULT_CAMPFIRE_SETTINGS.textDurationSec,
    autoVideoDuration: DEFAULT_CAMPFIRE_SETTINGS.autoVideoDuration,
    hideSideImages: DEFAULT_CAMPFIRE_SETTINGS.hideSideImages,
    hideWallQr: DEFAULT_CAMPFIRE_SETTINGS.hideWallQr,
    hideWallCaption: DEFAULT_CAMPFIRE_SETTINGS.hideWallCaption,
    hideWallLikes: DEFAULT_CAMPFIRE_SETTINGS.hideWallLikes,
    requireApproval: DEFAULT_CAMPFIRE_SETTINGS.requireApproval,
    contentFilterEnabled: DEFAULT_CAMPFIRE_SETTINGS.contentFilterEnabled,
    allowedPhotos: DEFAULT_CAMPFIRE_SETTINGS.allowedPhotos,
    allowedVideos: DEFAULT_CAMPFIRE_SETTINGS.allowedVideos,
    allowedText: DEFAULT_CAMPFIRE_SETTINGS.allowedText,
    albumPermission: DEFAULT_CAMPFIRE_SETTINGS.albumPermission,
    disableGuestDownload: DEFAULT_CAMPFIRE_SETTINGS.disableGuestDownload,
    disableLikes: DEFAULT_CAMPFIRE_SETTINGS.disableLikes,
  } as const
}

export function resolvePhotoStatus(
  photo: Doc<'photos'>,
): PhotoStatus {
  return photo.status ?? 'published'
}

export function resolveMediaType(photo: Doc<'photos'>): MediaType {
  return photo.mediaType ?? 'photo'
}

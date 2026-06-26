import type { Id } from '@campfire/backend/convex/_generated/dataModel'

export type EventType = 'wedding' | 'party' | 'conference' | 'birthday' | 'other'
export type AlbumPermission = 'view_and_upload' | 'view_only' | 'upload_only'
export type CaptionTheme = 'dark' | 'light'
export type PhotoStatus = 'published' | 'pending' | 'hidden'
export type MediaType = 'photo' | 'video' | 'text'
export type SettingsTab =
  | 'general'
  | 'appearance'
  | 'photo-wall'
  | 'moderation'
  | 'collaborators'

export type CampfireSettings = {
  eventDate?: number
  eventType: EventType
  themeColor: string
  displayLanguage: string
  welcomeScreenEnabled: boolean
  welcomeScreenTitle?: string
  welcomeScreenMessage?: string
  removeBranding: boolean
  captionTheme: CaptionTheme
  imageDurationSec: number
  videoDurationSec: number
  textDurationSec: number
  autoVideoDuration: boolean
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

export type CampfireSummary = {
  _id: Id<'campfires'>
  name: string
  slug: string
  visibility: 'public' | 'private'
  role: 'owner' | 'member'
  createdAt: number
}

export type CampfireListItem = CampfireSummary & {
  uploadCount: number
}

export type CampfireDashboard = {
  _id: Id<'campfires'>
  name: string
  slug: string
  visibility: 'public' | 'private'
  role: 'owner' | 'member'
  settings: CampfireSettings
  counts: {
    published: number
    pending: number
    hidden: number
    total: number
  }
  logoUrl: string | null
  albumBackgroundUrl: string | null
  wallBackgroundUrl: string | null
}

export type CampfireView = {
  _id: Id<'campfires'>
  name: string
  slug: string
  visibility: 'public' | 'private'
  role: 'owner' | 'member' | null
  canView: boolean
  canUpload: boolean
  canComment: boolean
  canManage: boolean
  isGuest: boolean
  photoCount: number
  settings: CampfireSettings
}

export type PhotoItem = {
  _id: Id<'photos'>
  caption?: string
  createdAt: number
  url: string | null
  uploaderGuestName?: string
  uploaderUserId?: Id<'users'>
  status: PhotoStatus
  mediaType: MediaType
  textBody?: string
  textBackground?: string
  likeCount: number
}

export type PhotoComment = {
  _id: Id<'photoComments'>
  body: string
  createdAt: number
  authorName: string
}

export type CampfireMember = {
  _id: Id<'campfireMembers'>
  userId: Id<'users'>
  role: 'owner' | 'member'
  email: string | null
  name: string | null
}

export type Navigation = {
  home: () => void
  signIn: () => void
  signOut: () => void
  createCampfire: () => void
  openCampfire: (slug: string) => void
}

export const TEXT_POST_BACKGROUNDS = [
  'gradient-pink',
  'gradient-blue',
  'gradient-green',
  'gradient-orange',
  'solid-dark',
  'solid-light',
] as const

import { v } from 'convex/values'

export const eventTypeValidator = v.union(
  v.literal('wedding'),
  v.literal('party'),
  v.literal('conference'),
  v.literal('birthday'),
  v.literal('other'),
)

export const albumPermissionValidator = v.union(
  v.literal('view_and_upload'),
  v.literal('view_only'),
  v.literal('upload_only'),
)

export const captionThemeValidator = v.union(
  v.literal('dark'),
  v.literal('light'),
)

export const photoStatusValidator = v.union(
  v.literal('published'),
  v.literal('pending'),
  v.literal('hidden'),
)

export const mediaTypeValidator = v.union(
  v.literal('photo'),
  v.literal('video'),
  v.literal('text'),
)

export const campfireSettingsValidator = v.object({
  eventDate: v.optional(v.number()),
  eventType: eventTypeValidator,
  logoStorageId: v.optional(v.id('_storage')),
  themeColor: v.string(),
  displayLanguage: v.string(),
  welcomeScreenEnabled: v.boolean(),
  welcomeScreenTitle: v.optional(v.string()),
  welcomeScreenMessage: v.optional(v.string()),
  removeBranding: v.boolean(),
  albumBackgroundStorageId: v.optional(v.id('_storage')),
  captionTheme: captionThemeValidator,
  imageDurationSec: v.number(),
  videoDurationSec: v.number(),
  textDurationSec: v.number(),
  autoVideoDuration: v.boolean(),
  wallBackgroundStorageId: v.optional(v.id('_storage')),
  hideSideImages: v.boolean(),
  hideWallQr: v.boolean(),
  hideWallCaption: v.boolean(),
  hideWallLikes: v.boolean(),
  requireApproval: v.boolean(),
  contentFilterEnabled: v.boolean(),
  allowedPhotos: v.boolean(),
  allowedVideos: v.boolean(),
  allowedText: v.boolean(),
  albumPermission: albumPermissionValidator,
  disableGuestDownload: v.boolean(),
  disableLikes: v.boolean(),
})

export const photoItemValidator = v.object({
  _id: v.id('photos'),
  caption: v.optional(v.string()),
  createdAt: v.number(),
  url: v.union(v.string(), v.null()),
  uploaderGuestName: v.optional(v.string()),
  uploaderUserId: v.optional(v.id('users')),
  status: photoStatusValidator,
  mediaType: mediaTypeValidator,
  textBody: v.optional(v.string()),
  textBackground: v.optional(v.string()),
  likeCount: v.number(),
})

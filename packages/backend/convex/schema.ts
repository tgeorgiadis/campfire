import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import {
  albumPermissionValidator,
  captionThemeValidator,
  eventTypeValidator,
  mediaTypeValidator,
  photoStatusValidator,
} from './lib/validators'

const campfireSettingsFields = {
  eventDate: v.optional(v.number()),
  eventType: v.optional(eventTypeValidator),
  logoStorageId: v.optional(v.id('_storage')),
  themeColor: v.optional(v.string()),
  displayLanguage: v.optional(v.string()),
  welcomeScreenEnabled: v.optional(v.boolean()),
  welcomeScreenTitle: v.optional(v.string()),
  welcomeScreenMessage: v.optional(v.string()),
  removeBranding: v.optional(v.boolean()),
  albumBackgroundStorageId: v.optional(v.id('_storage')),
  captionTheme: v.optional(captionThemeValidator),
  imageDurationSec: v.optional(v.number()),
  videoDurationSec: v.optional(v.number()),
  textDurationSec: v.optional(v.number()),
  autoVideoDuration: v.optional(v.boolean()),
  wallBackgroundStorageId: v.optional(v.id('_storage')),
  hideSideImages: v.optional(v.boolean()),
  hideWallQr: v.optional(v.boolean()),
  hideWallCaption: v.optional(v.boolean()),
  hideWallLikes: v.optional(v.boolean()),
  requireApproval: v.optional(v.boolean()),
  contentFilterEnabled: v.optional(v.boolean()),
  allowedPhotos: v.optional(v.boolean()),
  allowedVideos: v.optional(v.boolean()),
  allowedText: v.optional(v.boolean()),
  albumPermission: v.optional(albumPermissionValidator),
  disableGuestDownload: v.optional(v.boolean()),
  disableLikes: v.optional(v.boolean()),
}

export default defineSchema({
  ...authTables,
  campfires: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.id('users'),
    visibility: v.union(v.literal('public'), v.literal('private')),
    guestTokenHash: v.string(),
    createdAt: v.number(),
    ...campfireSettingsFields,
  })
    .index('by_slug', ['slug'])
    .index('by_owner', ['ownerId']),
  campfireMembers: defineTable({
    campfireId: v.id('campfires'),
    userId: v.id('users'),
    role: v.union(v.literal('owner'), v.literal('member')),
    invitedAt: v.number(),
  })
    .index('by_campfire', ['campfireId'])
    .index('by_user', ['userId'])
    .index('by_campfire_and_user', ['campfireId', 'userId']),
  photos: defineTable({
    campfireId: v.id('campfires'),
    storageId: v.optional(v.id('_storage')),
    caption: v.optional(v.string()),
    uploaderUserId: v.optional(v.id('users')),
    uploaderGuestName: v.optional(v.string()),
    createdAt: v.number(),
    status: v.optional(photoStatusValidator),
    mediaType: v.optional(mediaTypeValidator),
    textBody: v.optional(v.string()),
    textBackground: v.optional(v.string()),
    likeCount: v.optional(v.number()),
  })
    .index('by_campfire', ['campfireId'])
    .index('by_campfire_and_status', ['campfireId', 'status']),
  photoComments: defineTable({
    photoId: v.id('photos'),
    campfireId: v.id('campfires'),
    body: v.string(),
    authorUserId: v.optional(v.id('users')),
    authorGuestName: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_photo', ['photoId']),
  photoLikes: defineTable({
    photoId: v.id('photos'),
    userId: v.optional(v.id('users')),
    guestKey: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index('by_photo', ['photoId'])
    .index('by_photo_and_user', ['photoId', 'userId']),
})

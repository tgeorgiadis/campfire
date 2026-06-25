import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  ...authTables,
  campfires: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.id('users'),
    visibility: v.union(v.literal('public'), v.literal('private')),
    guestTokenHash: v.string(),
    createdAt: v.number(),
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
    storageId: v.id('_storage'),
    caption: v.optional(v.string()),
    uploaderUserId: v.optional(v.id('users')),
    uploaderGuestName: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_campfire', ['campfireId']),
  photoComments: defineTable({
    photoId: v.id('photos'),
    campfireId: v.id('campfires'),
    body: v.string(),
    authorUserId: v.optional(v.id('users')),
    authorGuestName: v.optional(v.string()),
    createdAt: v.number(),
  }).index('by_photo', ['photoId']),
})

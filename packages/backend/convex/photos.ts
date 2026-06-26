import { getAuthUserId } from '@convex-dev/auth/server'
import { paginationOptsValidator } from 'convex/server'
import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import {
  assertMediaTypeAllowed,
  getCampfireAccess,
} from './lib/access'
import { resolveCampfireSettings, resolveMediaType, resolvePhotoStatus } from './lib/defaults'
import type { Doc, Id } from './_generated/dataModel'
import type { QueryCtx } from './_generated/server'
import {
  mediaTypeValidator,
  photoItemValidator,
  photoStatusValidator,
} from './lib/validators'

async function toPhotoItem(
  ctx: { storage: QueryCtx['storage'] },
  photo: {
    _id: Id<'photos'>
    caption?: string
    createdAt: number
    storageId?: Id<'_storage'>
    uploaderGuestName?: string
    uploaderUserId?: Id<'users'>
    status?: 'published' | 'pending' | 'hidden'
    mediaType?: 'photo' | 'video' | 'text'
    textBody?: string
    textBackground?: string
    likeCount?: number
  },
) {
  return {
    _id: photo._id,
    caption: photo.caption,
    createdAt: photo.createdAt,
    url: photo.storageId
      ? await ctx.storage.getUrl(photo.storageId)
      : null,
    uploaderGuestName: photo.uploaderGuestName,
    uploaderUserId: photo.uploaderUserId,
    status: resolvePhotoStatus(photo as Doc<'photos'>),
    mediaType: resolveMediaType(photo as Doc<'photos'>),
    textBody: photo.textBody,
    textBackground: photo.textBackground,
    likeCount: photo.likeCount ?? 0,
  }
}

export const generateUploadUrl = mutation({
  args: {
    campfireId: v.id('campfires'),
    guestToken: v.optional(v.string()),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const access = await getCampfireAccess(ctx, args)
    if (!access.canUpload || !access.campfire) {
      throw new ConvexError('You do not have permission to upload')
    }
    return await ctx.storage.generateUploadUrl()
  },
})

export const create = mutation({
  args: {
    campfireId: v.id('campfires'),
    storageId: v.id('_storage'),
    mediaType: v.optional(mediaTypeValidator),
    caption: v.optional(v.string()),
    guestToken: v.optional(v.string()),
    guestName: v.optional(v.string()),
  },
  returns: v.id('photos'),
  handler: async (ctx, args) => {
    const access = await getCampfireAccess(ctx, args)
    if (!access.canUpload || !access.campfire) {
      throw new ConvexError('You do not have permission to upload')
    }

    const mediaType = args.mediaType ?? 'photo'
    assertMediaTypeAllowed(access.campfire, mediaType)

    const userId = await getAuthUserId(ctx)
    const trimmedCaption = args.caption?.trim()
    const trimmedGuestName = args.guestName?.trim()
    const settings = resolveCampfireSettings(access.campfire)
    const isMember = access.role !== null
    const status =
      settings.requireApproval && !isMember ? 'pending' : 'published'

    if (userId === null && !access.isGuest) {
      throw new ConvexError('Sign in or use a guest link to upload')
    }

    return await ctx.db.insert('photos', {
      campfireId: args.campfireId,
      storageId: args.storageId,
      mediaType,
      status,
      caption:
        trimmedCaption && trimmedCaption.length > 0 ? trimmedCaption : undefined,
      uploaderUserId: userId ?? undefined,
      uploaderGuestName:
        userId === null && trimmedGuestName && trimmedGuestName.length > 0
          ? trimmedGuestName
          : undefined,
      likeCount: 0,
      createdAt: Date.now(),
    })
  },
})

export const createTextPost = mutation({
  args: {
    campfireId: v.id('campfires'),
    textBody: v.string(),
    textBackground: v.string(),
    guestToken: v.optional(v.string()),
    guestName: v.optional(v.string()),
  },
  returns: v.id('photos'),
  handler: async (ctx, args) => {
    const access = await getCampfireAccess(ctx, args)
    if (!access.canUpload || !access.campfire) {
      throw new ConvexError('You do not have permission to upload')
    }

    assertMediaTypeAllowed(access.campfire, 'text')

    const trimmedBody = args.textBody.trim()
    if (trimmedBody.length === 0) {
      throw new ConvexError('Text is required')
    }

    const userId = await getAuthUserId(ctx)
    const trimmedGuestName = args.guestName?.trim()
    const settings = resolveCampfireSettings(access.campfire)
    const isMember = access.role !== null
    const status =
      settings.requireApproval && !isMember ? 'pending' : 'published'

    return await ctx.db.insert('photos', {
      campfireId: args.campfireId,
      mediaType: 'text',
      status,
      textBody: trimmedBody,
      textBackground: args.textBackground,
      uploaderUserId: userId ?? undefined,
      uploaderGuestName:
        userId === null && trimmedGuestName && trimmedGuestName.length > 0
          ? trimmedGuestName
          : undefined,
      likeCount: 0,
      createdAt: Date.now(),
    })
  },
})

export const listByCampfire = query({
  args: {
    campfireId: v.id('campfires'),
    guestToken: v.optional(v.string()),
    status: v.optional(photoStatusValidator),
    paginationOpts: paginationOptsValidator,
  },
  returns: v.object({
    page: v.array(photoItemValidator),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const access = await getCampfireAccess(ctx, args)
    if (!access.campfire) {
      throw new ConvexError('Access denied')
    }

    const isManager = access.canManage

    if (!isManager && !access.canView) {
      throw new ConvexError('Access denied')
    }

    let statusFilter = args.status
    if (!isManager) {
      statusFilter = 'published'
    }

    const results = await ctx.db
      .query('photos')
      .withIndex('by_campfire', (q) => q.eq('campfireId', args.campfireId))
      .order('desc')
      .paginate(args.paginationOpts)

    const filteredPage = results.page.filter((photo) => {
      const status = photo.status ?? 'published'
      if (!statusFilter) {
        return true
      }
      return status === statusFilter
    })

    const page = await Promise.all(
      filteredPage.map((photo) => toPhotoItem(ctx, photo)),
    )

    return {
      page,
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    }
  },
})

export const listForWall = query({
  args: {
    slug: v.string(),
    guestToken: v.optional(v.string()),
  },
  returns: v.array(photoItemValidator),
  handler: async (ctx, args) => {
    const campfire = await ctx.db
      .query('campfires')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique()

    if (!campfire) {
      return []
    }

    const access = await getCampfireAccess(ctx, {
      campfireId: campfire._id,
      guestToken: args.guestToken,
    })

    if (!access.canView && !access.canManage) {
      return []
    }

    const photos = await ctx.db
      .query('photos')
      .withIndex('by_campfire', (q) => q.eq('campfireId', campfire._id))
      .order('desc')
      .take(100)

    const published = photos.filter((p) => (p.status ?? 'published') === 'published')

    return Promise.all(published.map((photo) => toPhotoItem(ctx, photo)))
  },
})

export const setStatus = mutation({
  args: {
    photoId: v.id('photos'),
    status: photoStatusValidator,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photoId)
    if (!photo) {
      throw new ConvexError('Photo not found')
    }

    const access = await getCampfireAccess(ctx, {
      campfireId: photo.campfireId,
    })
    if (!access.canManage) {
      throw new ConvexError('Access denied')
    }

    await ctx.db.patch(args.photoId, { status: args.status })
    return null
  },
})

export const remove = mutation({
  args: { photoId: v.id('photos') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photoId)
    if (!photo) {
      throw new ConvexError('Photo not found')
    }

    const access = await getCampfireAccess(ctx, {
      campfireId: photo.campfireId,
    })
    if (!access.canManage) {
      throw new ConvexError('Access denied')
    }

    if (photo.storageId) {
      await ctx.storage.delete(photo.storageId)
    }

    const comments = await ctx.db
      .query('photoComments')
      .withIndex('by_photo', (q) => q.eq('photoId', args.photoId))
      .collect()
    for (const comment of comments) {
      await ctx.db.delete(comment._id)
    }

    const likes = await ctx.db
      .query('photoLikes')
      .withIndex('by_photo', (q) => q.eq('photoId', args.photoId))
      .collect()
    for (const like of likes) {
      await ctx.db.delete(like._id)
    }

    await ctx.db.delete(args.photoId)
    return null
  },
})

export const toggleLike = mutation({
  args: {
    photoId: v.id('photos'),
    guestToken: v.optional(v.string()),
    guestKey: v.optional(v.string()),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photoId)
    if (!photo) {
      throw new ConvexError('Photo not found')
    }

    const access = await getCampfireAccess(ctx, {
      campfireId: photo.campfireId,
      guestToken: args.guestToken,
    })
    if (!access.campfire) {
      throw new ConvexError('Access denied')
    }

    const settings = resolveCampfireSettings(access.campfire)
    if (settings.disableLikes) {
      throw new ConvexError('Likes are disabled')
    }

    if (!access.canView && !access.canManage) {
      throw new ConvexError('Access denied')
    }

    const userId = await getAuthUserId(ctx)
    const guestKey = args.guestKey

    let existingLike = null
    if (userId) {
      existingLike = await ctx.db
        .query('photoLikes')
        .withIndex('by_photo_and_user', (q) =>
          q.eq('photoId', args.photoId).eq('userId', userId),
        )
        .unique()
    } else if (guestKey) {
      const likes = await ctx.db
        .query('photoLikes')
        .withIndex('by_photo', (q) => q.eq('photoId', args.photoId))
        .collect()
      existingLike = likes.find((l) => l.guestKey === guestKey) ?? null
    } else {
      throw new ConvexError('Sign in or provide guest key to like')
    }

    const currentCount = photo.likeCount ?? 0

    if (existingLike) {
      await ctx.db.delete(existingLike._id)
      const next = Math.max(0, currentCount - 1)
      await ctx.db.patch(args.photoId, { likeCount: next })
      return next
    }

    await ctx.db.insert('photoLikes', {
      photoId: args.photoId,
      userId: userId ?? undefined,
      guestKey: userId ? undefined : guestKey,
      createdAt: Date.now(),
    })
    const next = currentCount + 1
    await ctx.db.patch(args.photoId, { likeCount: next })
    return next
  },
})

export const listDownloadUrls = query({
  args: { campfireId: v.id('campfires') },
  returns: v.array(
    v.object({
      photoId: v.id('photos'),
      url: v.string(),
      filename: v.string(),
    }),
  ),
  handler: async (ctx, args) => {
    const access = await getCampfireAccess(ctx, args)
    if (!access.canManage) {
      throw new ConvexError('Access denied')
    }

    const photos = await ctx.db
      .query('photos')
      .withIndex('by_campfire', (q) => q.eq('campfireId', args.campfireId))
      .collect()

    const items = []
    for (const photo of photos) {
      if (!photo.storageId) {
        continue
      }
      const url = await ctx.storage.getUrl(photo.storageId)
      if (url) {
        items.push({
          photoId: photo._id,
          url,
          filename: `${photo._id}.${resolveMediaType(photo) === 'video' ? 'mp4' : 'jpg'}`,
        })
      }
    }
    return items
  },
})

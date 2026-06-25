import { getAuthUserId } from '@convex-dev/auth/server'
import { paginationOptsValidator } from 'convex/server'
import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getCampfireAccess } from './lib/access'

export const generateUploadUrl = mutation({
  args: {
    campfireId: v.id('campfires'),
    guestToken: v.optional(v.string()),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const access = await getCampfireAccess(ctx, args)
    if (!access.canUpload) {
      throw new ConvexError('You do not have permission to upload photos')
    }
    return await ctx.storage.generateUploadUrl()
  },
})

export const create = mutation({
  args: {
    campfireId: v.id('campfires'),
    storageId: v.id('_storage'),
    caption: v.optional(v.string()),
    guestToken: v.optional(v.string()),
    guestName: v.optional(v.string()),
  },
  returns: v.id('photos'),
  handler: async (ctx, args) => {
    const access = await getCampfireAccess(ctx, args)
    if (!access.canUpload) {
      throw new ConvexError('You do not have permission to upload photos')
    }

    const userId = await getAuthUserId(ctx)
    const trimmedCaption = args.caption?.trim()
    const trimmedGuestName = args.guestName?.trim()

    if (userId === null && !access.isGuest) {
      throw new ConvexError('Sign in or use a guest link to upload photos')
    }

    return await ctx.db.insert('photos', {
      campfireId: args.campfireId,
      storageId: args.storageId,
      caption: trimmedCaption && trimmedCaption.length > 0 ? trimmedCaption : undefined,
      uploaderUserId: userId ?? undefined,
      uploaderGuestName:
        userId === null && trimmedGuestName && trimmedGuestName.length > 0
          ? trimmedGuestName
          : undefined,
      createdAt: Date.now(),
    })
  },
})

const photoItemValidator = v.object({
  _id: v.id('photos'),
  caption: v.optional(v.string()),
  createdAt: v.number(),
  url: v.union(v.string(), v.null()),
  uploaderGuestName: v.optional(v.string()),
  uploaderUserId: v.optional(v.id('users')),
})

export const listByCampfire = query({
  args: {
    campfireId: v.id('campfires'),
    guestToken: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  returns: v.object({
    page: v.array(photoItemValidator),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    const access = await getCampfireAccess(ctx, args)
    if (!access.canView) {
      throw new ConvexError('Access denied')
    }

    const results = await ctx.db
      .query('photos')
      .withIndex('by_campfire', (q) => q.eq('campfireId', args.campfireId))
      .order('desc')
      .paginate(args.paginationOpts)

    const page = await Promise.all(
      results.page.map(async (photo) => ({
        _id: photo._id,
        caption: photo.caption,
        createdAt: photo.createdAt,
        url: await ctx.storage.getUrl(photo.storageId),
        uploaderGuestName: photo.uploaderGuestName,
        uploaderUserId: photo.uploaderUserId,
      })),
    )

    return {
      page,
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    }
  },
})

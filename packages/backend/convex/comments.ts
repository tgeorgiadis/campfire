import { getAuthUserId } from '@convex-dev/auth/server'
import { ConvexError, v } from 'convex/values'
import type { Doc } from './_generated/dataModel'
import { mutation, query } from './_generated/server'
import type { QueryCtx } from './_generated/server'
import { getCampfireAccess } from './lib/access'

const MAX_BODY_LENGTH = 500

const photoCommentValidator = v.object({
  _id: v.id('photoComments'),
  body: v.string(),
  createdAt: v.number(),
  authorName: v.string(),
})

async function resolveAuthorName(
  ctx: QueryCtx,
  comment: Doc<'photoComments'>,
): Promise<string> {
  if (comment.authorGuestName) {
    return comment.authorGuestName
  }
  if (comment.authorUserId) {
    const user = await ctx.db.get(comment.authorUserId)
    return user?.name ?? user?.email ?? 'Member'
  }
  return 'Unknown'
}

export const listByPhoto = query({
  args: {
    photoId: v.id('photos'),
    guestToken: v.optional(v.string()),
  },
  returns: v.array(photoCommentValidator),
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photoId)
    if (!photo) {
      throw new ConvexError('Photo not found')
    }

    const access = await getCampfireAccess(ctx, {
      campfireId: photo.campfireId,
      guestToken: args.guestToken,
    })
    if (!access.canView) {
      throw new ConvexError('Access denied')
    }

    const comments = await ctx.db
      .query('photoComments')
      .withIndex('by_photo', (q) => q.eq('photoId', args.photoId))
      .collect()

    comments.sort((a, b) => a.createdAt - b.createdAt)

    return Promise.all(
      comments.map(async (comment) => ({
        _id: comment._id,
        body: comment.body,
        createdAt: comment.createdAt,
        authorName: await resolveAuthorName(ctx, comment),
      })),
    )
  },
})

export const create = mutation({
  args: {
    photoId: v.id('photos'),
    body: v.string(),
    guestToken: v.optional(v.string()),
    guestName: v.optional(v.string()),
  },
  returns: v.id('photoComments'),
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photoId)
    if (!photo) {
      throw new ConvexError('Photo not found')
    }

    const access = await getCampfireAccess(ctx, {
      campfireId: photo.campfireId,
      guestToken: args.guestToken,
    })
    if (!access.canComment) {
      throw new ConvexError('You do not have permission to comment')
    }

    const trimmedBody = args.body.trim()
    if (trimmedBody.length === 0) {
      throw new ConvexError('Comment cannot be empty')
    }
    if (trimmedBody.length > MAX_BODY_LENGTH) {
      throw new ConvexError(`Comment must be at most ${MAX_BODY_LENGTH} characters`)
    }

    const userId = await getAuthUserId(ctx)

    if (userId !== null) {
      return await ctx.db.insert('photoComments', {
        photoId: args.photoId,
        campfireId: photo.campfireId,
        body: trimmedBody,
        authorUserId: userId,
        createdAt: Date.now(),
      })
    }

    if (!access.isGuest) {
      throw new ConvexError('Sign in or use a guest link to comment')
    }

    const trimmedGuestName = args.guestName?.trim()
    if (!trimmedGuestName || trimmedGuestName.length === 0) {
      throw new ConvexError('Your name is required')
    }

    return await ctx.db.insert('photoComments', {
      photoId: args.photoId,
      campfireId: photo.campfireId,
      body: trimmedBody,
      authorGuestName: trimmedGuestName,
      createdAt: Date.now(),
    })
  },
})

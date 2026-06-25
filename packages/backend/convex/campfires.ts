import { getAuthUserId } from '@convex-dev/auth/server'
import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import type { MutationCtx } from './_generated/server'
import {
  generateGuestToken,
  getCampfireAccess,
  getCampfireAccessBySlug,
  hashGuestToken,
} from './lib/access'

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 48) || 'campfire'
  )
}

async function uniqueSlug(ctx: MutationCtx, base: string): Promise<string> {
  let slug = base
  let attempt = 0
  while (true) {
    const existing = await ctx.db
      .query('campfires')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique()
    if (!existing) {
      return slug
    }
    attempt += 1
    slug = `${base}-${attempt}`
  }
}

const campfireSummaryValidator = v.object({
  _id: v.id('campfires'),
  name: v.string(),
  slug: v.string(),
  visibility: v.union(v.literal('public'), v.literal('private')),
  role: v.union(v.literal('owner'), v.literal('member')),
  createdAt: v.number(),
})

export const create = mutation({
  args: {
    name: v.string(),
    visibility: v.union(v.literal('public'), v.literal('private')),
  },
  returns: v.object({
    campfireId: v.id('campfires'),
    slug: v.string(),
    guestToken: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      throw new ConvexError('Not authenticated')
    }

    const trimmedName = args.name.trim()
    if (trimmedName.length === 0) {
      throw new ConvexError('Name is required')
    }

    const guestToken = generateGuestToken()
    const guestTokenHash = await hashGuestToken(guestToken)
    const slug = await uniqueSlug(ctx, slugify(trimmedName))
    const now = Date.now()

    const campfireId = await ctx.db.insert('campfires', {
      name: trimmedName,
      slug,
      ownerId: userId,
      visibility: args.visibility,
      guestTokenHash,
      createdAt: now,
    })

    await ctx.db.insert('campfireMembers', {
      campfireId,
      userId,
      role: 'owner',
      invitedAt: now,
    })

    return { campfireId, slug, guestToken }
  },
})

export const listMine = query({
  args: {},
  returns: v.array(campfireSummaryValidator),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      throw new ConvexError('Not authenticated')
    }

    const memberships = await ctx.db
      .query('campfireMembers')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect()

    const campfires = (
      await Promise.all(
        memberships.map(async (membership) => {
          const campfire = await ctx.db.get(membership.campfireId)
          if (!campfire) {
            return null
          }
          return {
            _id: campfire._id,
            name: campfire.name,
            slug: campfire.slug,
            visibility: campfire.visibility,
            role: membership.role,
            createdAt: campfire.createdAt,
          }
        }),
      )
    ).filter((campfire) => campfire !== null)

    return campfires.sort((a, b) => b.createdAt - a.createdAt)
  },
})

export const getBySlug = query({
  args: {
    slug: v.string(),
    guestToken: v.optional(v.string()),
  },
  returns: v.union(
    v.object({
      _id: v.id('campfires'),
      name: v.string(),
      slug: v.string(),
      visibility: v.union(v.literal('public'), v.literal('private')),
      role: v.union(v.literal('owner'), v.literal('member'), v.null()),
      canView: v.boolean(),
      canUpload: v.boolean(),
      canComment: v.boolean(),
      isGuest: v.boolean(),
      photoCount: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const access = await getCampfireAccessBySlug(ctx, args)
    if (!access.campfire || !access.canView) {
      return null
    }

    const photos = await ctx.db
      .query('photos')
      .withIndex('by_campfire', (q) => q.eq('campfireId', access.campfire!._id))
      .collect()

    return {
      _id: access.campfire._id,
      name: access.campfire.name,
      slug: access.campfire.slug,
      visibility: access.campfire.visibility,
      role: access.role,
      canView: access.canView,
      canUpload: access.canUpload,
      canComment: access.canComment,
      isGuest: access.isGuest,
      photoCount: photos.length,
    }
  },
})

export const inviteMember = mutation({
  args: {
    campfireId: v.id('campfires'),
    email: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      throw new ConvexError('Not authenticated')
    }

    const access = await getCampfireAccess(ctx, {
      campfireId: args.campfireId,
    })
    if (!access.campfire || access.role !== 'owner') {
      throw new ConvexError('Only the owner can invite members')
    }

    const email = args.email.trim().toLowerCase()
    if (email.length === 0) {
      throw new ConvexError('Email is required')
    }

    const invitee = await ctx.db
      .query('users')
      .withIndex('email', (q) => q.eq('email', email))
      .unique()
    if (!invitee) {
      throw new ConvexError(
        'No user found with that email. They must sign up first.',
      )
    }

    if (invitee._id === userId) {
      throw new ConvexError('You are already the owner')
    }

    const existing = await ctx.db
      .query('campfireMembers')
      .withIndex('by_campfire_and_user', (q) =>
        q.eq('campfireId', args.campfireId).eq('userId', invitee._id),
      )
      .unique()
    if (existing) {
      throw new ConvexError('User is already a member')
    }

    await ctx.db.insert('campfireMembers', {
      campfireId: args.campfireId,
      userId: invitee._id,
      role: 'member',
      invitedAt: Date.now(),
    })

    return null
  },
})

export const listMembers = query({
  args: {
    campfireId: v.id('campfires'),
    guestToken: v.optional(v.string()),
  },
  returns: v.array(
    v.object({
      _id: v.id('campfireMembers'),
      userId: v.id('users'),
      role: v.union(v.literal('owner'), v.literal('member')),
      email: v.union(v.string(), v.null()),
      name: v.union(v.string(), v.null()),
    }),
  ),
  handler: async (ctx, args) => {
    const access = await getCampfireAccess(ctx, args)
    if (!access.campfire || access.role === null) {
      throw new ConvexError('Access denied')
    }

    const members = await ctx.db
      .query('campfireMembers')
      .withIndex('by_campfire', (q) => q.eq('campfireId', args.campfireId))
      .collect()

    return Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId)
        return {
          _id: member._id,
          userId: member.userId,
          role: member.role,
          email: user?.email ?? null,
          name: user?.name ?? null,
        }
      }),
    )
  },
})

export const rotateGuestToken = mutation({
  args: {
    campfireId: v.id('campfires'),
  },
  returns: v.object({
    guestToken: v.string(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      throw new ConvexError('Not authenticated')
    }

    const access = await getCampfireAccess(ctx, {
      campfireId: args.campfireId,
    })
    if (!access.campfire || access.role !== 'owner') {
      throw new ConvexError('Only the owner can rotate the guest token')
    }

    const guestToken = generateGuestToken()
    const guestTokenHash = await hashGuestToken(guestToken)
    await ctx.db.patch(args.campfireId, { guestTokenHash })

    return { guestToken }
  },
})

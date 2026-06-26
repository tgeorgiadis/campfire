import { getAuthUserId } from '@convex-dev/auth/server'
import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import type { Id } from './_generated/dataModel'
import type { MutationCtx, QueryCtx } from './_generated/server'
import {
  defaultCampfireFields,
  resolveCampfireSettings,
} from './lib/defaults'
import {
  generateGuestToken,
  getCampfireAccess,
  getCampfireAccessBySlug,
  hashGuestToken,
} from './lib/access'
import {
  albumPermissionValidator,
  campfireSettingsValidator,
  captionThemeValidator,
  eventTypeValidator,
} from './lib/validators'

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

async function uniqueSlug(
  ctx: MutationCtx,
  base: string,
  excludeId?: Id<'campfires'>,
) {
  let slug = base
  let attempt = 0
  while (true) {
    const existing = await ctx.db
      .query('campfires')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique()
    if (!existing || existing._id === excludeId) {
      return slug
    }
    attempt += 1
    slug = `${base}-${attempt}`
  }
}

async function requireOwner(ctx: MutationCtx, campfireId: Id<'campfires'>) {
  const userId = await getAuthUserId(ctx)
  if (userId === null) {
    throw new ConvexError('Not authenticated')
  }
  const access = await getCampfireAccess(ctx, { campfireId })
  if (!access.campfire || access.role !== 'owner') {
    throw new ConvexError('Only the owner can update settings')
  }
  return access
}

async function countPhotosByStatus(
  ctx: { db: QueryCtx['db'] },
  campfireId: Id<'campfires'>,
) {
  const photos = await ctx.db
    .query('photos')
    .withIndex('by_campfire', (q) => q.eq('campfireId', campfireId))
    .collect()
  return {
    published: photos.filter((p) => (p.status ?? 'published') === 'published')
      .length,
    pending: photos.filter((p) => p.status === 'pending').length,
    hidden: photos.filter((p) => p.status === 'hidden').length,
    total: photos.length,
  }
}

const campfireListItemValidator = v.object({
  _id: v.id('campfires'),
  name: v.string(),
  slug: v.string(),
  visibility: v.union(v.literal('public'), v.literal('private')),
  role: v.union(v.literal('owner'), v.literal('member')),
  createdAt: v.number(),
  uploadCount: v.number(),
})

export const create = mutation({
  args: {
    name: v.string(),
    visibility: v.union(v.literal('public'), v.literal('private')),
    eventDate: v.optional(v.number()),
    eventType: v.optional(eventTypeValidator),
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
      ...defaultCampfireFields(),
      ...(args.eventDate !== undefined ? { eventDate: args.eventDate } : {}),
      ...(args.eventType !== undefined ? { eventType: args.eventType } : {}),
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
  returns: v.array(campfireListItemValidator),
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
          const counts = await countPhotosByStatus(ctx, campfire._id)
          return {
            _id: campfire._id,
            name: campfire.name,
            slug: campfire.slug,
            visibility: campfire.visibility,
            role: membership.role,
            createdAt: campfire.createdAt,
            uploadCount: counts.total,
          }
        }),
      )
    ).filter((campfire) => campfire !== null)

    return campfires.sort((a, b) => b.createdAt - a.createdAt)
  },
})

export const getDashboard = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      _id: v.id('campfires'),
      name: v.string(),
      slug: v.string(),
      visibility: v.union(v.literal('public'), v.literal('private')),
      role: v.union(v.literal('owner'), v.literal('member')),
      settings: campfireSettingsValidator,
      counts: v.object({
        published: v.number(),
        pending: v.number(),
        hidden: v.number(),
        total: v.number(),
      }),
      logoUrl: v.union(v.string(), v.null()),
      albumBackgroundUrl: v.union(v.string(), v.null()),
      wallBackgroundUrl: v.union(v.string(), v.null()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const access = await getCampfireAccessBySlug(ctx, { slug: args.slug })
    if (!access.campfire || !access.canManage || access.role === null) {
      return null
    }

    const settings = resolveCampfireSettings(access.campfire)
    const counts = await countPhotosByStatus(ctx, access.campfire._id)

    return {
      _id: access.campfire._id,
      name: access.campfire.name,
      slug: access.campfire.slug,
      visibility: access.campfire.visibility,
      role: access.role,
      settings,
      counts,
      logoUrl: settings.logoStorageId
        ? await ctx.storage.getUrl(settings.logoStorageId)
        : null,
      albumBackgroundUrl: settings.albumBackgroundStorageId
        ? await ctx.storage.getUrl(settings.albumBackgroundStorageId)
        : null,
      wallBackgroundUrl: settings.wallBackgroundStorageId
        ? await ctx.storage.getUrl(settings.wallBackgroundStorageId)
        : null,
    }
  },
})

export const getPublicSettings = query({
  args: {
    slug: v.string(),
    guestToken: v.optional(v.string()),
  },
  returns: v.union(
    v.object({
      _id: v.id('campfires'),
      name: v.string(),
      slug: v.string(),
      settings: campfireSettingsValidator,
      canView: v.boolean(),
      canUpload: v.boolean(),
      canComment: v.boolean(),
      role: v.union(v.literal('owner'), v.literal('member'), v.null()),
      isGuest: v.boolean(),
      logoUrl: v.union(v.string(), v.null()),
      albumBackgroundUrl: v.union(v.string(), v.null()),
      wallBackgroundUrl: v.union(v.string(), v.null()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const access = await getCampfireAccessBySlug(ctx, args)
    if (!access.campfire) {
      return null
    }

    const settings = resolveCampfireSettings(access.campfire)
    const canAccess =
      access.canView || access.canUpload || access.canManage

    if (!canAccess) {
      return null
    }

    return {
      _id: access.campfire._id,
      name: access.campfire.name,
      slug: access.campfire.slug,
      settings,
      canView: access.canView,
      canUpload: access.canUpload,
      canComment: access.canComment,
      role: access.role,
      isGuest: access.isGuest,
      logoUrl: settings.logoStorageId
        ? await ctx.storage.getUrl(settings.logoStorageId)
        : null,
      albumBackgroundUrl: settings.albumBackgroundStorageId
        ? await ctx.storage.getUrl(settings.albumBackgroundStorageId)
        : null,
      wallBackgroundUrl: settings.wallBackgroundStorageId
        ? await ctx.storage.getUrl(settings.wallBackgroundStorageId)
        : null,
    }
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
      canManage: v.boolean(),
      isGuest: v.boolean(),
      photoCount: v.number(),
      settings: campfireSettingsValidator,
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const access = await getCampfireAccessBySlug(ctx, args)
    if (!access.campfire) {
      return null
    }
    if (!access.canView && !access.canUpload && !access.canManage) {
      return null
    }

    const counts = await countPhotosByStatus(ctx, access.campfire._id)

    return {
      _id: access.campfire._id,
      name: access.campfire.name,
      slug: access.campfire.slug,
      visibility: access.campfire.visibility,
      role: access.role,
      canView: access.canView,
      canUpload: access.canUpload,
      canComment: access.canComment,
      canManage: access.canManage,
      isGuest: access.isGuest,
      photoCount: counts.published,
      settings: resolveCampfireSettings(access.campfire),
    }
  },
})

export const updateGeneral = mutation({
  args: {
    campfireId: v.id('campfires'),
    name: v.optional(v.string()),
    eventDate: v.optional(v.union(v.number(), v.null())),
    eventType: v.optional(eventTypeValidator),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.campfireId)
    const patch: Record<string, unknown> = {}
    if (args.name !== undefined) {
      const trimmed = args.name.trim()
      if (trimmed.length === 0) {
        throw new ConvexError('Name is required')
      }
      patch.name = trimmed
    }
    if (args.eventDate !== undefined) {
      patch.eventDate = args.eventDate ?? undefined
    }
    if (args.eventType !== undefined) {
      patch.eventType = args.eventType
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(args.campfireId, patch)
    }
    return null
  },
})

export const updateSlug = mutation({
  args: {
    campfireId: v.id('campfires'),
    slug: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.campfireId)
    const base = slugify(args.slug)
    const slug = await uniqueSlug(ctx, base, args.campfireId)
    await ctx.db.patch(args.campfireId, { slug })
    return slug
  },
})

export const updateAppearance = mutation({
  args: {
    campfireId: v.id('campfires'),
    themeColor: v.optional(v.string()),
    displayLanguage: v.optional(v.string()),
    welcomeScreenEnabled: v.optional(v.boolean()),
    welcomeScreenTitle: v.optional(v.union(v.string(), v.null())),
    welcomeScreenMessage: v.optional(v.union(v.string(), v.null())),
    removeBranding: v.optional(v.boolean()),
    captionTheme: v.optional(captionThemeValidator),
    logoStorageId: v.optional(v.union(v.id('_storage'), v.null())),
    albumBackgroundStorageId: v.optional(v.union(v.id('_storage'), v.null())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.campfireId)
    const { campfireId, ...fields } = args
    const patch: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        patch[key] = value === null ? undefined : value
      }
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(campfireId, patch)
    }
    return null
  },
})

export const updateWallSettings = mutation({
  args: {
    campfireId: v.id('campfires'),
    imageDurationSec: v.optional(v.number()),
    videoDurationSec: v.optional(v.number()),
    textDurationSec: v.optional(v.number()),
    autoVideoDuration: v.optional(v.boolean()),
    hideSideImages: v.optional(v.boolean()),
    hideWallQr: v.optional(v.boolean()),
    hideWallCaption: v.optional(v.boolean()),
    hideWallLikes: v.optional(v.boolean()),
    wallBackgroundStorageId: v.optional(v.union(v.id('_storage'), v.null())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.campfireId)
    const { campfireId, ...fields } = args
    const patch: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        patch[key] = value === null ? undefined : value
      }
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(campfireId, patch)
    }
    return null
  },
})

export const updateModeration = mutation({
  args: {
    campfireId: v.id('campfires'),
    requireApproval: v.optional(v.boolean()),
    contentFilterEnabled: v.optional(v.boolean()),
    allowedPhotos: v.optional(v.boolean()),
    allowedVideos: v.optional(v.boolean()),
    allowedText: v.optional(v.boolean()),
    albumPermission: v.optional(albumPermissionValidator),
    disableGuestDownload: v.optional(v.boolean()),
    disableLikes: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.campfireId)
    const { campfireId, ...fields } = args
    const patch: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        patch[key] = value
      }
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(campfireId, patch)
    }
    return null
  },
})

export const generateSettingsUploadUrl = mutation({
  args: { campfireId: v.id('campfires') },
  returns: v.string(),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.campfireId)
    return await ctx.storage.generateUploadUrl()
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

export const removeMember = mutation({
  args: {
    campfireId: v.id('campfires'),
    memberId: v.id('campfireMembers'),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.campfireId)
    const member = await ctx.db.get(args.memberId)
    if (!member || member.campfireId !== args.campfireId) {
      throw new ConvexError('Member not found')
    }
    if (member.role === 'owner') {
      throw new ConvexError('Cannot remove the owner')
    }
    await ctx.db.delete(args.memberId)
    return null
  },
})

export const listMembers = query({
  args: { campfireId: v.id('campfires') },
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
  args: { campfireId: v.id('campfires') },
  returns: v.object({ guestToken: v.string() }),
  handler: async (ctx, args) => {
    await requireOwner(ctx, args.campfireId)
    const guestToken = generateGuestToken()
    const guestTokenHash = await hashGuestToken(guestToken)
    await ctx.db.patch(args.campfireId, { guestTokenHash })
    return { guestToken }
  },
})

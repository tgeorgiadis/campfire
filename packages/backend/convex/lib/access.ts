import { getAuthUserId } from '@convex-dev/auth/server'
import { ConvexError } from 'convex/values'
import type { Doc, Id } from '../_generated/dataModel'
import type { MutationCtx, QueryCtx } from '../_generated/server'
import { resolveCampfireSettings } from './defaults'

export type CampfireRole = 'owner' | 'member' | null

export type CampfireAccess = {
  canView: boolean
  canUpload: boolean
  canComment: boolean
  canManage: boolean
  role: CampfireRole
  userId: Id<'users'> | null
  campfire: Doc<'campfires'> | null
  isGuest: boolean
}

type Ctx = QueryCtx | MutationCtx

export function generateGuestToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function hashGuestToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function getCampfireAccess(
  ctx: Ctx,
  args: { campfireId: Id<'campfires'>; guestToken?: string },
): Promise<CampfireAccess> {
  const campfire = await ctx.db.get(args.campfireId)
  if (!campfire) {
    return emptyAccess()
  }
  return getCampfireAccessForDoc(ctx, campfire, args.guestToken)
}

export async function getCampfireAccessBySlug(
  ctx: Ctx,
  args: { slug: string; guestToken?: string },
): Promise<CampfireAccess> {
  const campfire = await ctx.db
    .query('campfires')
    .withIndex('by_slug', (q) => q.eq('slug', args.slug))
    .unique()
  if (!campfire) {
    return emptyAccess()
  }
  return getCampfireAccessForDoc(ctx, campfire, args.guestToken)
}

function emptyAccess(): CampfireAccess {
  return {
    canView: false,
    canUpload: false,
    canComment: false,
    canManage: false,
    role: null,
    userId: null,
    campfire: null,
    isGuest: false,
  }
}

async function getCampfireAccessForDoc(
  ctx: Ctx,
  campfire: Doc<'campfires'>,
  guestToken?: string,
): Promise<CampfireAccess> {
  const userId = await getAuthUserId(ctx)
  let role: CampfireRole = null

  if (userId) {
    const membership = await ctx.db
      .query('campfireMembers')
      .withIndex('by_campfire_and_user', (q) =>
        q.eq('campfireId', campfire._id).eq('userId', userId),
      )
      .unique()
    if (membership) {
      role = membership.role
    }
  }

  let isGuest = false
  if (guestToken) {
    const hash = await hashGuestToken(guestToken)
    if (hash === campfire.guestTokenHash) {
      isGuest = true
    }
  }

  const isMember = role !== null
  const isPublic = campfire.visibility === 'public'
  const settings = resolveCampfireSettings(campfire)
  const canManage = isMember

  let canView = isPublic || isMember
  let canUpload = isMember

  if (isGuest) {
    switch (settings.albumPermission) {
      case 'view_and_upload':
        canView = true
        canUpload = true
        break
      case 'view_only':
        canView = true
        canUpload = false
        break
      case 'upload_only':
        canView = false
        canUpload = true
        break
    }
  } else if (isPublic && !isMember) {
    switch (settings.albumPermission) {
      case 'view_and_upload':
        canView = true
        canUpload = false
        break
      case 'view_only':
        canView = true
        canUpload = false
        break
      case 'upload_only':
        canView = false
        canUpload = false
        break
    }
  }

  const canComment = canView && (userId !== null || isGuest)

  return {
    canView,
    canUpload,
    canComment,
    canManage,
    role,
    userId,
    campfire,
    isGuest,
  }
}

export function assertMediaTypeAllowed(
  campfire: Doc<'campfires'>,
  mediaType: 'photo' | 'video' | 'text',
): void {
  const settings = resolveCampfireSettings(campfire)
  if (mediaType === 'photo' && !settings.allowedPhotos) {
    throw new ConvexError('Photo uploads are disabled for this event')
  }
  if (mediaType === 'video' && !settings.allowedVideos) {
    throw new ConvexError('Video uploads are disabled for this event')
  }
  if (mediaType === 'text' && !settings.allowedText) {
    throw new ConvexError('Text posts are disabled for this event')
  }
}

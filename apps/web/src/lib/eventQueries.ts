import { convexQuery } from '@convex-dev/react-query'
import { api } from '@campfire/backend/convex/_generated/api'
import type { Id } from '@campfire/backend/convex/_generated/dataModel'
import type { PhotoStatus } from '@campfire/app-core'

export function listMineQuery() {
  return convexQuery(api.campfires.listMine, {})
}

export function dashboardQuery(slug: string) {
  return convexQuery(api.campfires.getDashboard, { slug })
}

export function membersQuery(campfireId: Id<'campfires'>) {
  return convexQuery(api.campfires.listMembers, { campfireId })
}

export function photosQuery(campfireId: Id<'campfires'>, status: PhotoStatus) {
  return convexQuery(api.photos.listByCampfire, {
    campfireId,
    status,
    paginationOpts: { numItems: 48, cursor: null },
  })
}

export function publicSettingsQuery(slug: string, guestToken?: string) {
  return convexQuery(api.campfires.getPublicSettings, { slug, guestToken })
}

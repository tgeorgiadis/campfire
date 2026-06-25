import type { Id } from '@campfire/backend/convex/_generated/dataModel'

export type CampfireSummary = {
  _id: Id<'campfires'>
  name: string
  slug: string
  visibility: 'public' | 'private'
  role: 'owner' | 'member'
  createdAt: number
}

export type CampfireView = {
  _id: Id<'campfires'>
  name: string
  slug: string
  visibility: 'public' | 'private'
  role: 'owner' | 'member' | null
  canView: boolean
  canUpload: boolean
  canComment: boolean
  isGuest: boolean
  photoCount: number
}

export type PhotoItem = {
  _id: Id<'photos'>
  caption?: string
  createdAt: number
  url: string | null
  uploaderGuestName?: string
  uploaderUserId?: Id<'users'>
}

export type PhotoComment = {
  _id: Id<'photoComments'>
  body: string
  createdAt: number
  authorName: string
}

export type Navigation = {
  home: () => void
  signIn: () => void
  signOut: () => void
  createCampfire: () => void
  openCampfire: (slug: string) => void
}

import type { CampfireSummary } from './types'

const STORAGE_KEY = 'campfire-last-slug'

type LastCampfireStorage = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

let storage: LastCampfireStorage | null = null

export function setLastCampfireStorage(adapter: LastCampfireStorage): void {
  storage = adapter
}

function getStorage(): LastCampfireStorage | null {
  return storage
}

export function getLastCampfireSlug(): string | null {
  const store = getStorage()
  if (!store) {
    return null
  }
  return store.getItem(STORAGE_KEY)
}

export function setLastCampfireSlug(slug: string): void {
  const store = getStorage()
  if (!store) {
    return
  }
  store.setItem(STORAGE_KEY, slug)
}

export function resolveDefaultCampfireSlug(campfires: CampfireSummary[]): string | null {
  if (campfires.length === 0) {
    return null
  }
  const last = getLastCampfireSlug()
  if (last && campfires.some((campfire) => campfire.slug === last)) {
    return last
  }
  return campfires[0]!.slug
}

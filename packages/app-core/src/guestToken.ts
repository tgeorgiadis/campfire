const STORAGE_PREFIX = 'campfire-guest-token:'

type GuestTokenStorage = {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
}

let storage: GuestTokenStorage | null = null

export function setGuestTokenStorage(adapter: GuestTokenStorage): void {
  storage = adapter
}

function getStorage(): GuestTokenStorage | null {
  return storage
}

export function getGuestToken(slug: string): string | null {
  const store = getStorage()
  if (!store) {
    return null
  }
  return store.getItem(`${STORAGE_PREFIX}${slug}`)
}

export function setGuestToken(slug: string, token: string): void {
  const store = getStorage()
  if (!store) {
    return
  }
  store.setItem(`${STORAGE_PREFIX}${slug}`, token)
}

function getOrigin(): string {
  return typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000'
}

export function buildJoinUrl(slug: string, guestToken: string): string {
  return `${getOrigin()}/c/${slug}/join?token=${encodeURIComponent(guestToken)}`
}

export function buildAlbumUrl(slug: string): string {
  return `${getOrigin()}/c/${slug}/album`
}

export function buildWallUrl(slug: string): string {
  return `${getOrigin()}/c/${slug}/wall`
}

export function buildEventHomeUrl(slug: string): string {
  return `${getOrigin()}/c/${slug}/home`
}

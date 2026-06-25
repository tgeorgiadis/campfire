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

export function buildJoinUrl(slug: string, guestToken: string): string {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  return `${origin}/c/${slug}/join?token=${encodeURIComponent(guestToken)}`
}

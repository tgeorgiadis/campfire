import { setGuestTokenStorage, setLastCampfireStorage } from '@campfire/app-core'

const storage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
}

setGuestTokenStorage(storage)
setLastCampfireStorage(storage)

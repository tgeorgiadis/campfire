import { setGuestTokenStorage } from '@campfire/app-core'

setGuestTokenStorage({
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
})

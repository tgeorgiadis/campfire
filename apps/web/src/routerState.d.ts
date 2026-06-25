import '@tanstack/react-router'

declare module '@tanstack/react-router' {
  interface HistoryState {
    guestToken?: string
  }
}

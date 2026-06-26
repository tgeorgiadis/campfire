import type { EventType } from '@campfire/app-core'

export const EVENT_TYPE_OPTIONS: Array<{
  id: EventType
  label: string
  emoji: string
}> = [
  { id: 'wedding', label: 'Wedding', emoji: '💍' },
  { id: 'party', label: 'Party', emoji: '🎉' },
  { id: 'conference', label: 'Conference', emoji: '🎤' },
  { id: 'birthday', label: 'Birthday', emoji: '🎂' },
  { id: 'other', label: 'Other', emoji: '❓' },
]

import type { EventType } from '@campfire/app-core'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ModalFrame } from '../components/ModalFrame'
import { PrimaryButton } from '../components/PrimaryButton'
import { SelectablePill } from '../components/SelectablePill'
import { TextField } from '../components/TextField'
import { EVENT_TYPE_OPTIONS } from '../lib/eventTypes'

export type CreateEventFormData = {
  name: string
  eventDate?: number
  eventType: EventType
}

export function CreateEventModal({
  visible,
  onClose,
  onSubmit,
  submitting,
  error,
  dateInput,
  dateValue,
  onDateChange,
}: {
  visible: boolean
  onClose: () => void
  onSubmit: (data: CreateEventFormData) => void
  submitting?: boolean
  error: string | null
  dateInput?: ReactNode
  dateValue?: string
  onDateChange?: (value: string) => void
}) {
  const [name, setName] = useState('')
  const [internalDate, setInternalDate] = useState('')
  const [eventType, setEventType] = useState<EventType>('party')

  const eventDateText = dateValue ?? internalDate
  const setEventDateText = onDateChange ?? setInternalDate

  useEffect(() => {
    if (!visible) {
      return
    }
    setName('')
    setInternalDate('')
    onDateChange?.('')
    setEventType('party')
  }, [visible, onDateChange])

  const handleSubmit = () => {
    const trimmedName = name.trim()
    if (trimmedName.length === 0) {
      return
    }

    let eventDate: number | undefined
    if (eventDateText.trim()) {
      const parsed = Date.parse(eventDateText.trim())
      if (Number.isFinite(parsed)) {
        eventDate = parsed
      }
    }

    onSubmit({ name: trimmedName, eventDate, eventType })
  }

  return (
    <ModalFrame visible={visible} onClose={onClose} title="Add new event">
      <View className="gap-4">
        <TextField
          label="What's the event title?"
          value={name}
          onChangeText={setName}
          placeholder="i.e - Dan and Rachel Wedding"
        />

        <View className="gap-2">
          <Text className="text-xs text-ig-muted font-medium">When does it happen?</Text>
          {dateInput ?? (
            <TextField
              value={eventDateText}
              onChangeText={setEventDateText}
              placeholder="YYYY-MM-DD"
            />
          )}
        </View>

        <View className="gap-2">
          <Text className="text-xs text-ig-muted font-medium">What are you up to?</Text>
          <View className="flex-row flex-wrap gap-2">
            {EVENT_TYPE_OPTIONS.map((type) => (
              <SelectablePill
                key={type.id}
                label={type.label}
                emoji={type.emoji}
                selected={eventType === type.id}
                onPress={() => setEventType(type.id)}
                className="min-w-[30%] flex-1 items-center"
              />
            ))}
          </View>
        </View>

        {error ? <Text className="text-sm text-ig-red">{error}</Text> : null}

        <PrimaryButton
          label={submitting ? 'Creating…' : 'Create Event'}
          onPress={handleSubmit}
        />
      </View>
    </ModalFrame>
  )
}

import { useRef } from 'react'

export function WebFileInput({
  onFileSelected,
  accept = 'image/*',
  hidden,
}: {
  onFileSelected: (file: File | null) => void
  accept?: string
  hidden?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  if (hidden) {
    return (
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(event) => {
          onFileSelected(event.target.files?.[0] ?? null)
          event.target.value = ''
        }}
      />
    )
  }

  return (
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      onChange={(event) => {
        onFileSelected(event.target.files?.[0] ?? null)
      }}
      style={{
        fontSize: 14,
        width: '100%',
      }}
    />
  )
}

export function triggerFileInput(input: HTMLInputElement | null) {
  input?.click()
}

import { useRef } from 'react'

export function WebFileInput({
  onFileSelected,
}: {
  onFileSelected: (file: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
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

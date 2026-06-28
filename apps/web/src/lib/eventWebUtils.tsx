import type { CampfireSummary } from '@campfire/app-core'

export function WebEventSelect({
  slug,
  campfires,
  onSwitchEvent,
  onPrefetchSlug,
}: {
  slug: string
  campfires: Array<CampfireSummary>
  onSwitchEvent: (slug: string) => void
  onPrefetchSlug?: (slug: string) => void
}) {
  return (
    <select
      className="w-full bg-transparent text-sm text-ig-text outline-none border-0"
      value={slug}
      onFocus={() => {
        for (const c of campfires) {
          onPrefetchSlug?.(c.slug)
        }
      }}
      onChange={(e) => onSwitchEvent(e.target.value)}
    >
      {campfires.map((c) => (
        <option
          key={c._id}
          value={c.slug}
          onMouseEnter={() => onPrefetchSlug?.(c.slug)}
        >
          {c.name}
        </option>
      ))}
    </select>
  )
}

export function WebDateInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-ig-border rounded-lg px-3 py-2 text-sm text-ig-text bg-ig-surface outline-none"
    />
  )
}

export function copyToClipboard(text: string) {
  void navigator.clipboard.writeText(text)
}

export function openUrl(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function downloadQrCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}

const WELCOME_KEY = 'campfire-welcome-seen:'

export function hasSeenWelcome(slug: string): boolean {
  try {
    return localStorage.getItem(`${WELCOME_KEY}${slug}`) === '1'
  } catch {
    return false
  }
}

export function markWelcomeSeen(slug: string) {
  try {
    localStorage.setItem(`${WELCOME_KEY}${slug}`, '1')
  } catch {
    // ignore
  }
}

export function getGuestLikeKey(slug: string): string {
  const key = `campfire-guest-like-key:${slug}`
  try {
    let value = localStorage.getItem(key)
    if (!value) {
      value = crypto.randomUUID()
      localStorage.setItem(key, value)
    }
    return value
  } catch {
    return 'guest'
  }
}

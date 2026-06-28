import { useCallback, useEffect, useRef, useState } from 'react'
import { QrCanvas } from '~/lib/QrCanvas'

const ACCENT = '#FF5E3A'
const MIN_SIZE = 160
const MAX_SIZE = 360
const SIZE_STEP = 40
const DEFAULT_SIZE = 240
const EDGE_PADDING = 32
const TOOLBAR_HEIGHT = 40

function defaultPosition(size: number) {
  if (typeof window === 'undefined') {
    return { x: EDGE_PADDING, y: EDGE_PADDING }
  }
  const height = size + 80 + TOOLBAR_HEIGHT
  return {
    x: EDGE_PADDING,
    y: Math.max(EDGE_PADDING, window.innerHeight - height - EDGE_PADDING),
  }
}

function clampPosition(
  x: number,
  y: number,
  widgetWidth: number,
  widgetHeight: number,
) {
  const maxX = Math.max(EDGE_PADDING, window.innerWidth - widgetWidth - EDGE_PADDING)
  const maxY = Math.max(EDGE_PADDING, window.innerHeight - widgetHeight - EDGE_PADDING)
  return {
    x: Math.min(Math.max(EDGE_PADDING, x), maxX),
    y: Math.min(Math.max(EDGE_PADDING, y), maxY),
  }
}

export function WebWallQrWidget({ url }: { url: string }) {
  const [visible, setVisible] = useState(true)
  const [size, setSize] = useState(DEFAULT_SIZE)
  const [position, setPosition] = useState(() => defaultPosition(DEFAULT_SIZE))
  const [dragging, setDragging] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  const estimateHeight = size + 80 + TOOLBAR_HEIGHT
  const estimateWidth = size + 32

  useEffect(() => {
    setPosition((prev) =>
      clampPosition(prev.x, prev.y, estimateWidth, estimateHeight),
    )
  }, [size, estimateWidth, estimateHeight])

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const widget = widgetRef.current
      if (!widget) {
        return
      }
      const rect = widget.getBoundingClientRect()
      const next = clampPosition(
        event.clientX - dragOffsetRef.current.x,
        event.clientY - dragOffsetRef.current.y,
        rect.width,
        rect.height,
      )
      setPosition(next)
    },
    [],
  )

  const handlePointerUp = useCallback(() => {
    setDragging(false)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
  }, [handlePointerMove])

  const startDrag = (event: React.PointerEvent) => {
    if ((event.target as HTMLElement).closest('button')) {
      return
    }
    event.preventDefault()
    dragOffsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    }
    setDragging(true)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [handlePointerMove, handlePointerUp])

  if (!visible) {
    return null
  }

  return (
    <div
      ref={widgetRef}
      className="group fixed z-50 select-none"
      style={{
        left: position.x,
        top: position.y,
        cursor: dragging ? 'grabbing' : 'grab',
      }}
      onPointerDown={startDrag}
    >
      <div className="flex justify-center gap-2 mb-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        <ToolbarButton
          label="Remove QR code"
          className="bg-ig-red hover:opacity-90 text-white"
          onClick={() => setVisible(false)}
        >
          ×
        </ToolbarButton>
        <ToolbarButton
          label="Decrease QR size"
          className="bg-cf-charcoal hover:opacity-90 text-white"
          onClick={() => setSize((s) => Math.max(MIN_SIZE, s - SIZE_STEP))}
        >
          −
        </ToolbarButton>
        <ToolbarButton
          label="Increase QR size"
          className="bg-cf-charcoal hover:opacity-90 text-white"
          onClick={() => setSize((s) => Math.min(MAX_SIZE, s + SIZE_STEP))}
        >
          +
        </ToolbarButton>
      </div>

      <div className="rounded-lg overflow-hidden bg-black/70 shadow-lg min-w-[200px]">
        <div className="bg-black/50 px-4 py-3">
          <p className="text-white text-sm font-semibold text-center leading-snug">
            Scan to view or add photos!
          </p>
        </div>
        <div className="bg-white p-3 flex items-center justify-center">
          <QrCanvas url={url} size={size} borderColor={ACCENT} />
        </div>
      </div>
    </div>
  )
}

function ToolbarButton({
  children,
  label,
  className,
  onClick,
}: {
  children: React.ReactNode
  label: string
  className: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`w-9 h-9 rounded-md text-lg font-bold leading-none flex items-center justify-center cursor-pointer ${className}`}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {children}
    </button>
  )
}

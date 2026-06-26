import { useCallback, useEffect, useRef, useState } from 'react'

const IDLE_HIDE_MS = 400

export function WebWallTopBar({
  isOwner,
  soundEnabled,
  onSoundChange,
  onOpenSettings,
}: {
  isOwner: boolean
  soundEnabled: boolean
  onSoundChange: (enabled: boolean) => void
  onOpenSettings: () => void
}) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [visible, setVisible] = useState(false)
  const menuHoveredRef = useRef(false)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const sync = () => {
      setIsFullscreen(document.fullscreenElement != null)
    }
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  useEffect(() => {
    const scheduleHide = () => {
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        if (!menuHoveredRef.current) {
          setVisible(false)
        }
      }, IDLE_HIDE_MS)
    }

    const onMouseMove = () => {
      setVisible(true)
      scheduleHide()
    }

    document.addEventListener('mousemove', onMouseMove)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      clearTimeout(idleTimerRef.current)
    }
  }, [])

  const onMenuEnter = useCallback(() => {
    menuHoveredRef.current = true
    clearTimeout(idleTimerRef.current)
    setVisible(true)
  }, [])

  const onMenuLeave = useCallback(() => {
    menuHoveredRef.current = false
    setVisible(false)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
      return
    }
    void document.documentElement.requestFullscreen()
  }, [])

  return (
    <div
      className="fixed top-0 inset-x-0 z-[60] flex justify-center pb-4 pointer-events-none"
    >
      <div
        className={`mt-4 flex items-center gap-0 bg-white rounded-xl shadow-lg border border-ig-border overflow-hidden transition-transform duration-300 ease-in-out pointer-events-auto ${
          visible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-[calc(100%+1rem)] opacity-0'
        }`}
        onMouseEnter={onMenuEnter}
        onMouseLeave={onMenuLeave}
      >
        <button
          type="button"
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-cf-accent hover:opacity-90 transition-opacity"
        >
          <span aria-hidden>{isFullscreen ? '⤡' : '⤢'}</span>
          {isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        </button>

        <button
          type="button"
          onClick={() => onSoundChange(!soundEnabled)}
          className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-ig-text border-l border-ig-border hover:bg-ig-page transition-colors"
        >
          <span aria-hidden>{soundEnabled ? '🔊' : '🔇'}</span>
          {soundEnabled ? 'Turn Sound Off' : 'Turn Sound On'}
        </button>

        {isOwner ? (
          <>
            <div className="w-px self-stretch bg-ig-border" />
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-cf-accent border-l border-cf-accent/30 hover:bg-cf-accent-light transition-colors"
            >
              <span aria-hidden>⋯</span>
              More Options
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}

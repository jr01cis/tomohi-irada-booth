import { useEffect } from 'react'

const EVENTS = ['pointerdown', 'touchstart', 'keydown'] as const

export function useIdle(ms: number, onIdle: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    let t = setTimeout(onIdle, ms)
    const reset = () => {
      clearTimeout(t)
      t = setTimeout(onIdle, ms)
    }
    for (const e of EVENTS) window.addEventListener(e, reset, { passive: true })
    return () => {
      clearTimeout(t)
      for (const e of EVENTS) window.removeEventListener(e, reset)
    }
  }, [ms, onIdle, enabled])
}

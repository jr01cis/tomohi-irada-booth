import { useEffect, useState } from 'react'

const KIOSK_KEY = 'irada.kiosk'

type FsDocument = Document & { webkitFullscreenElement?: Element | null; webkitFullscreenEnabled?: boolean; webkitExitFullscreen?: () => void }
type FsElement = HTMLElement & { webkitRequestFullscreen?: () => void }

const doc = () => document as FsDocument

export function isFullscreen(): boolean {
  return Boolean(doc().fullscreenElement || doc().webkitFullscreenElement)
}

export function canFullscreen(): boolean {
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone
  return !standalone && Boolean(doc().fullscreenEnabled || doc().webkitFullscreenEnabled)
}

export function enterFullscreen() {
  const el = document.documentElement as FsElement
  try {
    if (el.requestFullscreen) void el.requestFullscreen({ navigationUI: 'hide' }).catch(() => {})
    else el.webkitRequestFullscreen?.()
  } catch {
    /* refused outside a gesture */
  }
}

export function exitFullscreen() {
  try {
    if (document.exitFullscreen) void document.exitFullscreen().catch(() => {})
    else doc().webkitExitFullscreen?.()
  } catch {
    /* already out */
  }
}

/** Kiosk mode: once staff turned fullscreen on, every visitor's first tap brings it back if it dropped. */
export function kioskWanted(): boolean {
  try {
    return localStorage.getItem(KIOSK_KEY) === '1'
  } catch {
    return false
  }
}

function setKiosk(on: boolean) {
  try {
    localStorage.setItem(KIOSK_KEY, on ? '1' : '0')
  } catch {
    /* per-device preference only */
  }
}

export function keepFullscreen() {
  if (kioskWanted() && canFullscreen() && !isFullscreen()) enterFullscreen()
}

export function useFullscreen() {
  const [full, setFull] = useState(isFullscreen())
  useEffect(() => {
    const sync = () => setFull(isFullscreen())
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('webkitfullscreenchange', sync)
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      document.removeEventListener('webkitfullscreenchange', sync)
    }
  }, [])
  const toggle = () => {
    if (isFullscreen()) {
      setKiosk(false)
      exitFullscreen()
    } else {
      setKiosk(true)
      enterFullscreen()
    }
  }
  return { full, available: canFullscreen(), toggle }
}

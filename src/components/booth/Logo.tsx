import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  tone?: 'dark' | 'light'
  className?: string
  /** Five taps inside three seconds open the admin panel. */
  onSecret?: () => void
}

export function Logo({ tone = 'light', className, onSecret }: Props) {
  const taps = useRef<number[]>([])
  const tap = () => {
    if (!onSecret) return
    const now = Date.now()
    taps.current = [...taps.current.filter((t) => now - t < 3000), now]
    if (taps.current.length >= 5) {
      taps.current = []
      onSecret()
    }
  }
  const file = tone === 'light' ? 'logo-full-white.png' : 'logo-full-blue.png'
  return (
    <img
      src={`${import.meta.env.BASE_URL}brand/${file}`}
      alt="Tomohi"
      draggable={false}
      onClick={tap}
      className={cn('h-10 w-auto shrink-0 self-start select-none', className)}
    />
  )
}

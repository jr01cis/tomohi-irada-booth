import { cn } from '@/lib/utils'

interface Props {
  leftMs: number
  totalMs: number
  size?: number
  className?: string
}

export function Countdown({ leftMs, totalMs, size = 64, className }: Props) {
  const r = size / 2 - 5
  const c = 2 * Math.PI * r
  const frac = Math.max(0, Math.min(1, leftMs / totalMs))
  const secs = Math.ceil(leftMs / 1000)
  const hot = secs <= 10
  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeOpacity={0.15} strokeWidth={5} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={hot ? '#fc694f' : 'currentColor'}
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          style={{ transition: 'stroke-dashoffset 120ms linear, stroke 300ms' }}
        />
      </svg>
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center font-semibold tabular-nums',
          hot ? 'text-coral' : 'text-current',
        )}
        style={{ fontSize: size * 0.36 }}
      >
        {secs}
      </span>
    </div>
  )
}

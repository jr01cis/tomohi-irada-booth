import { animate, motion, useMotionValue } from 'motion/react'
import { useState } from 'react'
import GooeyFilter from '@/components/smoothui/gooey-filter'
import { cn } from '@/lib/utils'
import { WHEEL_SLICES, sliceIndexFor, spinOutcome, type Prize } from '@/lib/voucher'

interface Props {
  onResult: (prize: Prize) => void
  size?: number
}

const SLICE = 360 / WHEEL_SLICES.length
const R = 100

const FILL: Record<Prize, string> = {
  '10': '#2e36b8',
  '20': '#3887f5',
  '30': '#fc694f',
  SESSION: '#fcc24a',
}
const TEXT: Record<Prize, string> = {
  '10': '#ffffff',
  '20': '#ffffff',
  '30': '#ffffff',
  SESSION: '#0a2952',
}

function polar(deg: number, r: number) {
  const a = ((deg - 90) * Math.PI) / 180
  return [R + r * Math.cos(a), R + r * Math.sin(a)]
}

function slicePath(i: number) {
  const [x1, y1] = polar(i * SLICE, R)
  const [x2, y2] = polar((i + 1) * SLICE, R)
  return `M ${R} ${R} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`
}

/** The painted face only, so the attract screen can show a slowly turning wheel without the button. */
export function WheelFace() {
  return (
    <>
      <circle cx={R} cy={R} r={R} fill="#0a2952" />
      {WHEEL_SLICES.map((p, i) => (
        <path key={i} d={slicePath(i)} fill={FILL[p]} stroke="#0a2952" strokeWidth={1.2} />
      ))}
      {WHEEL_SLICES.map((p, i) => {
        const a = i * SLICE + SLICE / 2
        const [x, y] = polar(a, R * 0.64)
        const textAngle = a > 90 && a < 270 ? a + 180 : a
        const common = {
          x,
          y,
          fill: TEXT[p],
          fontWeight: 700,
          textAnchor: 'middle' as const,
          dominantBaseline: 'middle' as const,
          transform: `rotate(${textAngle} ${x} ${y})`,
          style: { fontFamily: 'inherit', letterSpacing: '-0.02em' },
        }
        return p === 'SESSION' ? (
          <text key={`t${i}`} {...common} fontSize={8}>
            <tspan x={x} dy="-0.5em">
              FREE
            </tspan>
            <tspan x={x} dy="1.15em">
              SESSION
            </tspan>
          </text>
        ) : (
          <text key={`t${i}`} {...common} fontSize={15}>
            {p}%
          </text>
        )
      })}
      <circle cx={R} cy={R} r={R - 1} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
    </>
  )
}

export function Wheel({ onResult, size = 560 }: Props) {
  const rotate = useMotionValue(0)
  const [spinning, setSpinning] = useState(false)
  const [done, setDone] = useState(false)

  const spin = () => {
    if (spinning || done) return
    setSpinning(true)
    const prize = spinOutcome()
    const idx = sliceIndexFor(prize)
    const center = idx * SLICE + SLICE / 2
    const jitter = (Math.random() - 0.5) * (SLICE * 0.6)
    const current = rotate.get()
    const base = current - (current % 360)
    const turns = 5 + Math.floor(Math.random() * 2)
    const target = base + 360 * turns + (360 - center) + jitter
    animate(rotate, target, {
      duration: 5.4,
      ease: [0.12, 0.86, 0.1, 1],
      onComplete: () => {
        setSpinning(false)
        setDone(true)
        onResult(prize)
      },
    })
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div className="absolute left-1/2 -top-3 z-20 -translate-x-1/2">
        <div className="h-0 w-0 border-x-[18px] border-t-[34px] border-x-transparent border-t-white drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]" />
      </div>

      <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl" />

      <motion.svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        style={{ rotate }}
        className="relative z-10 rounded-full shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
      >
        <WheelFace />
      </motion.svg>

      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <GooeyFilter intensity={10} className="relative flex items-center justify-center pointer-events-none">
          {spinning &&
            [0, 1, 2].map((k) => (
              <motion.span
                key={k}
                className="absolute h-7 w-7 rounded-full bg-white"
                animate={{ x: [0, 40 * Math.cos((k * 2 * Math.PI) / 3), 0], y: [0, 40 * Math.sin((k * 2 * Math.PI) / 3), 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: k * 0.1 }}
              />
            ))}
          <motion.button
            onClick={spin}
            disabled={spinning || done}
            whileTap={{ scale: 0.92 }}
            className={cn(
              'pointer-events-auto relative flex h-32 w-32 items-center justify-center rounded-full bg-white text-xl font-bold tracking-tight text-brand shadow-[0_10px_40px_rgba(0,0,0,0.35)]',
              (spinning || done) && 'text-body',
            )}
          >
            {done || spinning ? '' : 'SPIN'}
          </motion.button>
        </GooeyFilter>
      </div>

      {!spinning && !done && (
        <motion.div
          className="absolute inset-0 z-10 rounded-full border-4 border-white/40"
          animate={{ scale: [1, 1.04, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />
      )}
    </div>
  )
}

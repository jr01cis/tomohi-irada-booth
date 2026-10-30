import confetti from 'canvas-confetti'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import HolographicFoil from '@/components/smoothui/holographic-foil'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/utils'
import { BONUS_LINE, PRIZE_CARD, VALID_UNTIL, isBigPrize, type CardArt, type Prize } from '@/lib/voucher'

interface Props {
  prize: Prize
  code: string
  name: string
  /** Written in the quiz card's "Course Name" field. */
  course?: string
  celebrate?: boolean
  /** Fills its column instead of the fixed 620 px. */
  compact?: boolean
}

interface Box {
  left: number
  right: number
  top: number
  bottom: number
}

/**
 * Where to write on each of marketing's cards, in % of the artwork (tools/cards.py and tools/quizcard.py).
 * The discount cards have one "Gifted to" box; the quiz card has a Course Name line and a Winner Name line.
 */
const FIELDS: Record<CardArt, { name: Box; course?: Box; lines?: boolean }> = {
  session: { name: { left: 70.75, right: 96.44, top: 55.58, bottom: 64.13 } },
  '10': { name: { left: 71.06, right: 97.69, top: 52.73, bottom: 61.28 } },
  '15': { name: { left: 71.0, right: 97.69, top: 50.83, bottom: 59.38 } },
  '20': { name: { left: 71.0, right: 97.69, top: 52.14, bottom: 60.69 } },
  quiz: {
    lines: true,
    course: { left: 5.04, right: 45.33, top: 83.88, bottom: 91.0 },
    name: { left: 54.25, right: 94.75, top: 83.88, bottom: 91.47 },
  },
}

/** The card has one short line for the course, so the catalogue's prefixes and suffixes go. */
const cardCourse = (name: string) =>
  name
    .replace(/^CPD Certified\s*-\s*/i, '')
    .replace(/\s*Crash Course!?$/i, '')
    .replace(/!$/, '')

/** One line that shrinks to fit its box, so a long course name still reads in full. */
function FitLine({ text, size, center }: { text: string; size: number; center?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    setScale(1)
  }, [text])
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || scale !== 1 || el.scrollWidth <= el.clientWidth) return
    setScale(Math.max(0.6, (el.clientWidth / el.scrollWidth) * 0.97))
  }, [text, scale])
  return (
    <span ref={ref} className={cn('block w-full truncate', center && 'text-center')} style={{ fontSize: `${size * scale}cqw` }}>
      {text}
    </span>
  )
}

function Field({ box, text, lines }: { box: Box; text: string; lines?: boolean }) {
  return (
    <div
      className={cn('absolute flex items-end overflow-hidden font-semibold text-brand', lines ? 'justify-start' : 'justify-center px-[1.2cqw] pb-[1.9cqw]')}
      style={{ left: `${box.left}%`, width: `${box.right - box.left}%`, top: `${box.top}%`, height: `${box.bottom - box.top}%`, lineHeight: 1.1 }}
    >
      <FitLine text={text} size={lines ? 2.45 : 2.5} center={!lines} />
    </div>
  )
}

/** Marketing's printed card with the visitor's details written in, and the code underneath, under the foil. */
export function VoucherCard({ prize, code, name, course, celebrate = true, compact = false }: Props) {
  const big = isBigPrize(prize)
  useEffect(() => {
    if (!celebrate) return
    sfx.play('confetti')
    sfx.play('voucher')
    confetti({
      particleCount: big ? 220 : 120,
      spread: big ? 110 : 70,
      startVelocity: 45,
      origin: { y: 0.55 },
      colors: ['#2e36b8', '#fc694f', '#fcc24a', '#ffffff'],
    })
  }, [celebrate, big])

  const art = PRIZE_CARD[prize]
  const fields = FIELDS[art]
  const bonus = BONUS_LINE[prize]

  return (
    <HolographicFoil
      pattern={art === 'session' || art === 'quiz' ? 'gold' : 'prism'}
      intensity={0.45}
      glare={0.5}
      foilOver
      tilt
      useDeviceOrientation
      className={cn('max-w-full overflow-hidden rounded-[22px] bg-white', compact ? 'w-full' : 'w-[620px]')}
    >
      {/* one container for the art and the strip, so every cqw below is a share of the card's width */}
      <div style={{ containerType: 'inline-size' }}>
        <div className="relative">
          <img src={`${import.meta.env.BASE_URL}vouchers/${art}.jpg`} alt="" draggable={false} className="block w-full select-none" />
          {fields.course && course && <Field box={fields.course} text={cardCourse(course)} lines />}
          <Field box={fields.name} text={name} lines={fields.lines} />
        </div>
        {/* right padding leaves room for the foil's own "Enable tilt" button, which sits bottom-right on iPad */}
        <div className="flex items-center justify-between gap-3 bg-brand-deep py-[1.8cqw] pl-[3cqw] pr-[17cqw] text-white">
          <div className="min-w-0">
            <p className="font-semibold uppercase tracking-widest text-white/60" style={{ fontSize: '1.7cqw' }}>
              Voucher code
            </p>
            <p className="whitespace-nowrap font-mono font-bold tracking-[0.08em]" style={{ fontSize: '3.6cqw', lineHeight: 1.15 }}>
              {code}
            </p>
          </div>
          <div className="text-right text-white/75" style={{ fontSize: '2cqw', lineHeight: 1.35 }}>
            {bonus && (
              <p className="whitespace-nowrap font-bold text-coral" style={{ fontSize: '2.6cqw' }}>
                {bonus}
              </p>
            )}
            <p>Valid until {VALID_UNTIL}</p>
          </div>
        </div>
      </div>
    </HolographicFoil>
  )
}

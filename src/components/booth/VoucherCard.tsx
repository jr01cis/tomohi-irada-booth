import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import HolographicFoil from '@/components/smoothui/holographic-foil'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/utils'
import { PRIZE_CARD, VALID_UNTIL, includesDemo, isBigPrize, type CardArt, type Prize } from '@/lib/voucher'

interface Props {
  prize: Prize
  code: string
  name: string
  celebrate?: boolean
  /** Fills its column instead of the fixed 620 px. */
  compact?: boolean
}

/** Where the "Gifted to" box sits on each of marketing's cards, in % of the artwork (measured by tools/cards.py). */
const NAME_BOX: Record<CardArt, { left: number; right: number; top: number; bottom: number }> = {
  session: { left: 70.75, right: 96.44, top: 55.58, bottom: 64.13 },
  '10': { left: 71.06, right: 97.69, top: 52.73, bottom: 61.28 },
  '15': { left: 71.0, right: 97.69, top: 50.83, bottom: 59.38 },
  '20': { left: 71.0, right: 97.69, top: 52.14, bottom: 60.69 },
}

/** Marketing's printed card with the visitor's name in the "Gifted to" box, and the code underneath, under the foil. */
export function VoucherCard({ prize, code, name, celebrate = true, compact = false }: Props) {
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
  const box = NAME_BOX[art]

  return (
    <HolographicFoil
      pattern={prize === 'SESSION' || prize === 'DEMO' ? 'gold' : 'prism'}
      intensity={0.45}
      glare={0.5}
      foilOver
      tilt
      useDeviceOrientation
      className={cn('max-w-full overflow-hidden rounded-[22px] bg-white', compact ? 'w-full' : 'w-[620px]')}
    >
      <div className="relative" style={{ containerType: 'inline-size' }}>
        <img src={`${import.meta.env.BASE_URL}vouchers/${art}.jpg`} alt="" draggable={false} className="block w-full select-none" />
        <div
          className="absolute flex items-end justify-center overflow-hidden px-[1.2cqw] pb-[1.9cqw] font-semibold text-brand"
          style={{ left: `${box.left}%`, width: `${box.right - box.left}%`, top: `${box.top}%`, height: `${box.bottom - box.top}%`, fontSize: '2.5cqw', lineHeight: 1.1 }}
        >
          <span className="truncate">{name}</span>
        </div>
      </div>
      {/* right padding leaves room for the foil's own "Enable tilt" button, which sits bottom-right on iPad */}
      <div className="flex items-center justify-between gap-3 bg-brand-deep py-[1.8cqw] pl-[3cqw] pr-[17cqw] text-white" style={{ containerType: 'inline-size' }}>
        <div className="min-w-0">
          <p className="font-semibold uppercase tracking-widest text-white/60" style={{ fontSize: '1.7cqw' }}>
            Voucher code
          </p>
          <p className="whitespace-nowrap font-mono font-bold tracking-[0.08em]" style={{ fontSize: '3.6cqw', lineHeight: 1.15 }}>
            {code}
          </p>
        </div>
        <div className="text-right text-white/75" style={{ fontSize: '2cqw', lineHeight: 1.35 }}>
          {includesDemo(prize) && <p className="font-semibold text-coral">+ a free demo session</p>}
          <p>Valid until {VALID_UNTIL}</p>
        </div>
      </div>
    </HolographicFoil>
  )
}

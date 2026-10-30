import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import HolographicFoil from '@/components/smoothui/holographic-foil'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/utils'
import { PRIZE_HEADLINE, VALID_UNTIL, isBigPrize, type Prize } from '@/lib/voucher'

interface Props {
  prize: Prize
  code: string
  name: string
  celebrate?: boolean
  /** Smaller card for a side column. */
  compact?: boolean
}

export function VoucherCard({ prize, code, name, celebrate = true, compact = false }: Props) {
  const big = isBigPrize(prize)
  useEffect(() => {
    if (!celebrate) return
    sfx.play('voucher')
    confetti({
      particleCount: big ? 220 : 120,
      spread: big ? 110 : 70,
      startVelocity: 45,
      origin: { y: 0.55 },
      colors: ['#2e36b8', '#fc694f', '#fcc24a', '#ffffff'],
    })
  }, [celebrate, big])

  const headline = PRIZE_HEADLINE[prize]
  const long = headline.length > 24

  return (
    <HolographicFoil
      pattern={prize === 'SESSION' || prize === 'DEMO30' ? 'gold' : 'prism'}
      intensity={0.9}
      glare={0.55}
      tilt
      useDeviceOrientation
      className={cn('max-w-full rounded-[28px] bg-brand-deep text-white', compact ? 'w-full' : 'w-[620px]')}
    >
      <div className={cn('relative flex flex-col justify-between', compact ? 'h-[250px] p-6' : 'h-[310px] p-7')}>
        <div className="flex items-start justify-between">
          <img src={`${import.meta.env.BASE_URL}brand/logo-full-white.png`} alt="Tomohi" className={cn('w-auto', compact ? 'h-6' : 'h-8')} draggable={false} />
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest">Irada 2026</span>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-coral">Your reward</p>
          <p className={cn('mt-1 font-bold leading-tight tracking-tight', compact ? (long ? 'text-2xl' : 'text-3xl') : long ? 'text-[32px]' : 'text-4xl')}>{headline}</p>
          <p className="mt-1 text-base text-white/70">For {name}</p>
        </div>
        <div className="flex items-end justify-between pb-7">
          <div className="rounded-2xl bg-black/40 px-5 py-3 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Voucher code</p>
            <p className={cn('whitespace-nowrap font-mono font-bold tracking-[0.1em]', compact ? 'text-2xl' : 'text-[28px]')}>{code}</p>
          </div>
          <div className="text-right text-sm text-white/70">
            <p>Valid until {VALID_UNTIL}</p>
            <p>Show this at the Tomohi desk</p>
          </div>
        </div>
      </div>
    </HolographicFoil>
  )
}

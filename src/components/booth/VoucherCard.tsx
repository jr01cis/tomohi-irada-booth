import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import HolographicFoil from '@/components/smoothui/holographic-foil'
import { PRIZE_HEADLINE, VALID_UNTIL, type Prize } from '@/lib/voucher'

interface Props {
  prize: Prize
  code: string
  name: string
  celebrate?: boolean
}

export function VoucherCard({ prize, code, name, celebrate = true }: Props) {
  useEffect(() => {
    if (!celebrate) return
    const big = prize === 'FREE' || prize === 'SESSION' || prize === '30'
    confetti({
      particleCount: big ? 220 : 120,
      spread: big ? 110 : 70,
      startVelocity: 45,
      origin: { y: 0.55 },
      colors: ['#2e36b8', '#fc694f', '#fcc24a', '#ffffff'],
    })
  }, [celebrate, prize])

  return (
    <HolographicFoil
      pattern={prize === 'FREE' || prize === 'SESSION' ? 'gold' : 'prism'}
      intensity={0.9}
      glare={0.55}
      tilt
      useDeviceOrientation
      className="w-[620px] max-w-full rounded-[28px] bg-brand-deep text-white"
    >
      <div className="relative flex h-[310px] flex-col justify-between p-7">
        <div className="flex items-start justify-between">
          <img src={`${import.meta.env.BASE_URL}brand/logo-white-wordmark.png`} alt="Tomohi" className="h-8 w-auto" draggable={false} />
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest">Irada 2026</span>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-coral">Your reward</p>
          <p className="mt-1 text-4xl font-bold leading-tight tracking-tight">{PRIZE_HEADLINE[prize]}</p>
          <p className="mt-2 text-base text-white/70">For {name}</p>
        </div>
        <div className="flex items-end justify-between pb-7">
          <div className="rounded-2xl bg-black/40 px-5 py-3 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Voucher code</p>
            <p className="font-mono text-[28px] font-bold tracking-[0.1em] whitespace-nowrap">{code}</p>
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

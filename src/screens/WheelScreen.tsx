import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import PriceFlow from '@/components/smoothui/price-flow'
import { BigButton } from '@/components/booth/BigButton'
import { Logo } from '@/components/booth/Logo'
import { Wheel } from '@/components/booth/Wheel'
import { sfx } from '@/lib/sound'
import { OUTCOMES, PRIZE_HEADLINE, isBigPrize, type WheelPrize } from '@/lib/voucher'

interface Props {
  onPrize: (prize: WheelPrize) => void
  onBack: () => void
}

const DOT: Record<WheelPrize, string> = { '10': 'bg-brand', '15': 'bg-[#3887f5]', '20': 'bg-coral', SESSION: 'bg-[#fcc24a]' }

export function WheelScreen({ onPrize, onBack }: Props) {
  const [prize, setPrize] = useState<WheelPrize | null>(null)
  const [shown, setShown] = useState(0)

  const handle = (p: WheelPrize) => {
    sfx.play(isBigPrize(p) ? 'bigPrize' : 'prize')
    setPrize(p)
    if (p !== 'SESSION') setTimeout(() => setShown(Number(p)), 350)
  }

  return (
    <div className="relative flex h-full gap-10 bg-brand-deep px-12 py-8 text-white">
      <div className="flex w-[400px] shrink-0 flex-col justify-between">
        <div>
          <Logo tone="light" className="h-12" />
          <h2 className="mt-12 text-6xl font-bold leading-[1] tracking-tight">Tap SPIN</h2>
          <p className="mt-4 text-xl text-white/70">Every slice is real. The discounts apply to a full course, the session is on us.</p>
          <ul className="mt-8 space-y-3">
            {OUTCOMES.map((o) => (
              <li key={o.prize} className="flex items-center gap-3 text-xl">
                <span className={`h-4 w-4 rounded-full ${DOT[o.prize]}`} />
                {o.label}
              </li>
            ))}
          </ul>
        </div>
        {!prize && (
          <button onClick={onBack} className="w-fit rounded-full bg-white/10 px-6 py-3 text-base font-medium text-white/80">
            Back
          </button>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center">
        <Wheel onResult={handle} size={620} />
      </div>

      <AnimatePresence>
        {prize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-brand-deep/85 px-10 text-center backdrop-blur-md"
          >
            <motion.div initial={{ scale: 0.6, y: 40 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', bounce: 0.45, duration: 0.9 }}>
              <p className="text-2xl font-semibold uppercase tracking-widest text-coral">You won</p>
              {prize === 'SESSION' ? (
                <p className="mt-2 text-[104px] font-bold leading-none tracking-tight">A free session</p>
              ) : (
                <p className="mt-2 flex items-baseline justify-center text-[160px] font-bold leading-none tracking-tight tabular-nums">
                  <PriceFlow value={shown} />
                  <span className="text-[80px]">%</span>
                </p>
              )}
              <p className="mt-4 text-3xl text-white/85">{PRIZE_HEADLINE[prize]}</p>
            </motion.div>
            <BigButton size="xl" variant="coral" className="mt-10 w-[420px]" onClick={() => onPrize(prize)}>
              Claim it
            </BigButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

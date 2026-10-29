import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import PriceFlow from '@/components/smoothui/price-flow'
import { BigButton } from '@/components/booth/BigButton'
import { Logo } from '@/components/booth/Logo'
import { Wheel } from '@/components/booth/Wheel'
import { PRIZE_HEADLINE, type Prize } from '@/lib/voucher'

interface Props {
  onPrize: (prize: Prize) => void
  onBack: () => void
}

export function WheelScreen({ onPrize, onBack }: Props) {
  const [prize, setPrize] = useState<Prize | null>(null)
  const [shown, setShown] = useState(0)

  const handle = (p: Prize) => {
    setPrize(p)
    if (p !== 'FREE') setTimeout(() => setShown(Number(p)), 350)
  }

  return (
    <div className="relative flex h-full flex-col items-center bg-brand-deep px-10 py-10 text-white">
      <div className="flex w-full items-center justify-between">
        <Logo tone="light" className="h-11" />
        {!prize && (
          <button onClick={onBack} className="rounded-full bg-white/10 px-5 py-3 text-base font-medium text-white/80">
            Back
          </button>
        )}
      </div>

      <h2 className="mt-8 text-5xl font-bold tracking-tight">Tap SPIN</h2>
      <p className="mt-3 text-xl text-white/70">Every slice is a real discount on any Tomohi course.</p>

      <div className="mt-10">
        <Wheel onResult={handle} size={560} />
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
              {prize === 'FREE' ? (
                <p className="mt-2 text-[120px] font-bold leading-none tracking-tight">FREE</p>
              ) : (
                <p className="mt-2 flex items-baseline justify-center text-[160px] font-bold leading-none tracking-tight tabular-nums">
                  <PriceFlow value={shown} />
                  <span className="text-[80px]">%</span>
                </p>
              )}
              <p className="mt-4 text-3xl text-white/85">{PRIZE_HEADLINE[prize]}</p>
            </motion.div>
            <BigButton size="xl" variant="coral" className="mt-12 w-[420px]" onClick={() => onPrize(prize)}>
              Claim it
            </BigButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

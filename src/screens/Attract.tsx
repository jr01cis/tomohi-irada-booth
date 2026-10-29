import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import AuroraCurtain from '@/components/smoothui/aurora-curtain'
import GravityLetters from '@/components/smoothui/gravity-letters'
import { Logo } from '@/components/booth/Logo'
import { WheelFace } from '@/components/booth/Wheel'
import { LITE } from '@/lib/session'

const PRIZES = ['10% off', '20% off', '30% off', 'a free course', 'a free session']

interface Props {
  onStart: () => void
  onSecret: () => void
}

export function Attract({ onStart, onSecret }: Props) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const h = setInterval(() => setI((v) => (v + 1) % PRIZES.length), 2400)
    return () => clearInterval(h)
  }, [])

  return (
    <div className="relative h-full w-full bg-brand-deep text-white" onPointerUp={onStart}>
      {!LITE && (
        <AuroraCurtain
          className="absolute inset-0"
          colors={['#2e36b8', '#fc694f', '#66d1ff', '#fcc24a']}
          intensity={0.85}
          bands={5}
          blur={0.55}
          noise={0.25}
          speed={0.8}
        />
      )}
      <div className="relative z-10 flex h-full flex-col items-center justify-between px-10 py-12">
        <div className="w-full" onPointerUp={(e) => e.stopPropagation()}>
          <Logo tone="light" className="h-12" onSecret={onSecret} />
        </div>

        <div className="flex flex-col items-center gap-9 text-center">
          <motion.svg
            viewBox="0 0 200 200"
            width={300}
            height={300}
            animate={{ rotate: 360 }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            className="rounded-full shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]"
          >
            <WheelFace />
          </motion.svg>

          <h1 className="text-[76px] font-bold leading-[0.95] tracking-tight">
            <GravityLetters text="Spin. Play. Learn." trigger="click" spread={200} />
          </h1>

          <div className="flex flex-col items-center gap-3">
            <p className="text-2xl text-white/75">One minute at the Tomohi booth. Walk away with</p>
            <div className="relative h-[76px] w-[420px] overflow-hidden rounded-full bg-white text-brand">
              <AnimatePresence initial={false}>
                <motion.span
                  key={i}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
                  className="absolute inset-0 flex items-center justify-center text-4xl font-bold tracking-tight"
                >
                  {PRIZES[i]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.p
          className="text-2xl font-semibold tracking-wide text-white/90"
          animate={{ opacity: [0.5, 1, 0.5], y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tap anywhere to start
        </motion.p>
      </div>
    </div>
  )
}

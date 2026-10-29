import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import AuroraCurtain from '@/components/smoothui/aurora-curtain'
import GravityLetters from '@/components/smoothui/gravity-letters'
import { Logo } from '@/components/booth/Logo'
import { WheelFace } from '@/components/booth/Wheel'
import { LITE } from '@/lib/session'

const PRIZES = ['10% off a full course', '20% off a full course', '30% off a full course', 'a free session']

interface Props {
  onWheel: () => void
  onChallenge: () => void
  onSecret: () => void
}

export function Attract({ onWheel, onChallenge, onSecret }: Props) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const h = setInterval(() => setI((v) => (v + 1) % PRIZES.length), 2400)
    return () => clearInterval(h)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-brand-deep text-white">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[620px] w-[620px] rounded-full bg-brand/40 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 h-[560px] w-[560px] rounded-full bg-coral/30 blur-[140px]" />

      <div className="relative z-10 flex h-full flex-col px-12 py-8">
        <div className="flex items-center justify-between">
          <Logo tone="light" className="h-14" onSecret={onSecret} />
          <p className="text-lg font-medium text-white/60">Tomohi at Irada</p>
        </div>

        <div className="mt-6 flex items-end justify-between gap-8">
          <h1 className="text-[72px] font-bold leading-[0.95] tracking-tight">
            <GravityLetters text="Spin. Play. Learn." trigger="click" spread={200} />
          </h1>
          <div className="flex flex-col items-end gap-2 pb-2">
            <p className="text-xl text-white/70">One minute. Walk away with</p>
            <div className="relative h-[64px] w-[380px] overflow-hidden rounded-full bg-white text-brand">
              <AnimatePresence initial={false}>
                <motion.span
                  key={i}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
                  className="absolute inset-0 flex items-center justify-center text-[26px] font-bold tracking-tight"
                >
                  {PRIZES[i]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-7 grid flex-1 grid-cols-2 gap-7">
          <motion.button
            whileTap={{ scale: 0.985 }}
            onClick={onWheel}
            className="relative flex overflow-hidden rounded-[32px] bg-gradient-to-br from-coral to-[#ff9a7a] p-8 text-left shadow-[0_30px_80px_-30px_rgba(252,105,79,0.8)]"
          >
            <div className="relative z-10 flex flex-col justify-between">
              <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-sm font-bold uppercase tracking-widest">20 seconds</span>
              <span>
                <span className="block text-5xl font-bold leading-tight">Spin the wheel</span>
                <span className="mt-3 block max-w-[300px] text-lg text-white/90">10%, 20% or 30% off a full course, or a free session.</span>
              </span>
            </div>
            <motion.svg
              viewBox="0 0 200 200"
              className="absolute -bottom-16 -right-12 rounded-full shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)]"
              width={300}
              height={300}
              animate={{ rotate: 360 }}
              transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            >
              <WheelFace />
            </motion.svg>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.985 }}
            onClick={onChallenge}
            className="relative flex overflow-hidden rounded-[32px] bg-[#0a2978] p-8 text-left shadow-[0_30px_80px_-30px_rgba(46,54,184,0.9)]"
          >
            {!LITE && (
              <AuroraCurtain
                className="absolute inset-0"
                colors={['#66d1ff', '#fc694f', '#3887f5', '#fcc24a']}
                intensity={1}
                bands={5}
                blur={0.5}
                noise={0.7}
                speed={0.9}
              />
            )}
            <div className="relative z-10 flex w-full flex-col justify-between">
              <span className="flex items-center justify-between">
                <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-sm font-bold uppercase tracking-widest backdrop-blur">60 seconds</span>
                <span className="text-5xl">⚡</span>
              </span>
              <span>
                <span className="block text-5xl font-bold leading-tight">Take the challenge</span>
                <span className="mt-3 block max-w-[380px] text-lg text-white/90">
                  10 questions in your field, 3 of them about what AI can do today. Your skill map, a course pick, and a free session at 70%.
                </span>
              </span>
            </div>
          </motion.button>
        </div>

        <motion.p
          className="mt-5 text-center text-xl font-semibold tracking-wide text-white/80"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tap a card to start
        </motion.p>
      </div>
    </div>
  )
}

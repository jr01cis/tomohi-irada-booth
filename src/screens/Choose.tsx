import { motion } from 'motion/react'
import BorderBeam from '@/components/smoothui/border-beam'
import PerCharacterRise from '@/components/smoothui/per-character-rise'
import { Logo } from '@/components/booth/Logo'

interface Props {
  onWheel: () => void
  onChallenge: () => void
  onBack: () => void
}

export function Choose({ onWheel, onChallenge, onBack }: Props) {
  return (
    <div className="flex h-full flex-col bg-brand-deep px-10 py-10 text-white">
      <div className="flex items-center justify-between">
        <Logo tone="light" className="h-11" />
        <button onClick={onBack} className="rounded-full bg-white/10 px-5 py-3 text-base font-medium text-white/80">
          Back
        </button>
      </div>

      <div className="mt-14 text-center">
        <h2 className="text-6xl font-bold tracking-tight">
          <PerCharacterRise stagger={18}>Pick your game</PerCharacterRise>
        </h2>
        <p className="mt-4 text-2xl text-white/70">Both end with something to take home.</p>
      </div>

      <div className="mt-14 grid flex-1 grid-cols-2 gap-8 pb-6">
        <BorderBeam colorFrom="#fc694f" colorTo="#fcc24a" duration={5} size={140} borderWidth={2} radius={32} className="h-full">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onWheel}
            className="flex h-full w-full flex-col items-start justify-end rounded-[32px] bg-gradient-to-br from-coral to-[#ff9a7a] p-8 text-left"
          >
            <span className="text-7xl">🎡</span>
            <span className="mt-6 text-4xl font-bold leading-tight">Spin the wheel</span>
            <span className="mt-2 text-lg text-white/85">10%, 20%, 30% off any course, or a whole course for free. 20 seconds.</span>
          </motion.button>
        </BorderBeam>

        <BorderBeam colorFrom="#66d1ff" colorTo="#ffffff" duration={5} delay={2.5} size={140} borderWidth={2} radius={32} className="h-full">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onChallenge}
            className="flex h-full w-full flex-col items-start justify-end rounded-[32px] bg-gradient-to-br from-brand to-[#3887f5] p-8 text-left"
          >
            <span className="text-7xl">⚡</span>
            <span className="mt-6 text-4xl font-bold leading-tight">Take the challenge</span>
            <span className="mt-2 text-lg text-white/85">10 questions, 60 seconds, your skill map and a course pick. Score 70% and the first session is on us.</span>
          </motion.button>
        </BorderBeam>
      </div>
    </div>
  )
}

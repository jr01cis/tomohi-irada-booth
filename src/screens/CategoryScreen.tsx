import { motion } from 'motion/react'
import { Logo } from '@/components/booth/Logo'
import { CATEGORIES, type Category } from '@/data/questions'
import { sfx } from '@/lib/sound'

interface Props {
  onPick: (cat: Category) => void
  onBack: () => void
}

export function CategoryScreen({ onPick, onBack }: Props) {
  return (
    <div className="flex h-full flex-col bg-brand-deep px-12 py-8 text-white">
      <div className="flex items-center justify-between">
        <Logo tone="light" className="h-12" />
        <button onClick={onBack} className="rounded-full bg-white/10 px-6 py-3 text-base font-medium text-white/80">
          Back
        </button>
      </div>

      <div className="mt-6 flex items-end justify-between gap-8">
        <div>
          <h2 className="text-6xl font-bold tracking-tight">Pick your field</h2>
          <p className="mt-2 text-xl text-white/70">10 questions in 60 seconds. Three of them are about what AI can do in your field today.</p>
        </div>
        <p className="max-w-[380px] shrink-0 text-right text-lg text-white/60">Everyone gets a free demo. 8/10 adds 10% off, 9/10 15%, 10/10 20%.</p>
      </div>

      <div className="mt-7 grid flex-1 grid-cols-4 grid-rows-2 gap-4">
        {CATEGORIES.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sfx.play('tap')
              onPick(c.id)
            }}
            className="flex flex-col items-start justify-between rounded-[28px] bg-white p-6 text-left text-ink"
          >
            <span className="text-5xl">{c.emoji}</span>
            <span>
              <span className="block text-2xl font-bold leading-tight">{c.label}</span>
              <span className="mt-1 block text-base text-body">{c.tagline}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

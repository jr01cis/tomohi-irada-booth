import { motion } from 'motion/react'
import { Logo } from '@/components/booth/Logo'
import { CATEGORIES, type Category } from '@/data/questions'

interface Props {
  onPick: (cat: Category) => void
  onBack: () => void
}

export function CategoryScreen({ onPick, onBack }: Props) {
  return (
    <div className="flex h-full flex-col bg-brand-deep px-10 py-10 text-white">
      <div className="flex items-center justify-between">
        <Logo tone="light" className="h-11" />
        <button onClick={onBack} className="rounded-full bg-white/10 px-5 py-3 text-base font-medium text-white/80">
          Back
        </button>
      </div>

      <div className="mt-12">
        <h2 className="text-6xl font-bold tracking-tight">Pick your field</h2>
        <p className="mt-3 text-2xl text-white/70">10 questions in 60 seconds. Three of them are about what AI can do in your field today.</p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-5">
        {CATEGORIES.map((c, i) => (
          <motion.button
            key={c.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onPick(c.id)}
            className="flex min-h-40 items-center gap-6 rounded-[28px] bg-white p-7 text-left text-ink"
          >
            <span className="text-6xl">{c.emoji}</span>
            <span>
              <span className="block text-3xl font-bold leading-tight">{c.label}</span>
              <span className="mt-1 block text-lg text-body">{c.tagline}</span>
            </span>
          </motion.button>
        ))}
        <div className="flex min-h-40 items-center justify-center rounded-[28px] border-2 border-dashed border-white/25 p-7 text-center text-xl text-white/60">
          Score 70% or more and your first session is free.
        </div>
      </div>
    </div>
  )
}

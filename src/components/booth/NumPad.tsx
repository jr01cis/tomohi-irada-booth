import { motion } from 'motion/react'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/utils'
import { BigButton } from './BigButton'

interface Props {
  value: string
  unit?: string
  onChange: (v: string) => void
  onSubmit: () => void
  disabled?: boolean
  /** after answering: the right value, shown in the display */
  outcome?: { correct: boolean; answer: number } | null
}

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '⌫']

export function NumPad({ value, unit, onChange, onSubmit, disabled, outcome }: Props) {
  const press = (k: string) => {
    if (disabled) return
    sfx.play('key')
    if (k === '⌫') return onChange(value.slice(0, -1))
    if (k === '.' && (value.includes('.') || value === '')) return
    if (value.length >= 8) return
    onChange(value + k)
  }
  return (
    <div className="flex h-full flex-col gap-3">
      <div
        className={cn(
          'flex min-h-[84px] items-center justify-between rounded-3xl border-2 bg-white px-6 text-4xl font-semibold tabular-nums',
          outcome ? (outcome.correct ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-coral bg-coral-soft text-coral') : 'border-line text-ink',
        )}
      >
        <span>{value || <span className="text-2xl font-normal text-body/60">Type the number</span>}</span>
        <span className="text-xl text-body">
          {outcome && !outcome.correct ? `answer ${outcome.answer}${unit ? ' ' + unit : ''}` : unit}
        </span>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2.5">
        {KEYS.map((k) => (
          <motion.button
            key={k}
            whileTap={{ scale: 0.94 }}
            onClick={() => press(k)}
            disabled={disabled}
            className="min-h-[56px] rounded-2xl border-2 border-line bg-white text-2xl font-semibold text-ink disabled:opacity-40"
          >
            {k}
          </motion.button>
        ))}
      </div>
      <BigButton size="md" variant="primary" onClick={onSubmit} disabled={disabled || value === '' || value === '.'} className="w-full">
        Answer
      </BigButton>
    </div>
  )
}

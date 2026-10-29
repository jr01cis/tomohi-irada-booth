import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import BorderBeam from '@/components/smoothui/border-beam'
import SiriOrb from '@/components/smoothui/siri-orb'
import TypewriterText from '@/components/smoothui/typewriter-text'
import { Countdown } from '@/components/booth/Countdown'
import { CATEGORIES, type Category } from '@/data/questions'
import { ROUND_SECONDS, buildRound, type Answer, type RoundQuestion } from '@/lib/engine'
import { cn } from '@/lib/utils'

interface Props {
  category: Category
  onFinish: (round: RoundQuestion[], answers: Answer[], elapsedMs: number) => void
}

const TOTAL_MS = ROUND_SECONDS * 1000
const FEEDBACK_MS = 650
const REVEAL_MS = 3200
const LETTERS = ['A', 'B', 'C', 'D']

export function QuizScreen({ category, onFinish }: Props) {
  const [round] = useState(() => buildRound(category))
  const [i, setI] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [phase, setPhase] = useState<'ask' | 'feedback' | 'reveal'>('ask')
  const [leftMs, setLeftMs] = useState(TOTAL_MS)

  const clock = useRef({ running: true, last: 0, left: TOTAL_MS, qStart: 0 })
  const answers = useRef<Answer[]>([])
  const finished = useRef(false)
  const cat = CATEGORIES.find((c) => c.id === category)!
  const q = round[i]

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    const all = answers.current.slice()
    for (let k = all.length; k < round.length; k++) {
      all.push({ qid: round[k].id, skill: round[k].skill, level: round[k].level, chosen: null, correct: false, ms: 0 })
    }
    onFinish(round, all, TOTAL_MS - Math.max(0, clock.current.left))
  }, [onFinish, round])

  useEffect(() => {
    let raf = 0
    let shownTenth = -1
    clock.current.last = performance.now()
    clock.current.qStart = performance.now()
    const tick = (now: number) => {
      const c = clock.current
      if (c.running) c.left -= now - c.last
      c.last = now
      const tenth = Math.ceil(c.left / 100)
      if (tenth !== shownTenth) {
        shownTenth = tenth
        setLeftMs(Math.max(0, c.left))
      }
      if (c.left <= 0) {
        finish()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [finish])

  const next = useCallback(() => {
    if (i + 1 >= round.length) {
      finish()
      return
    }
    setI(i + 1)
    setChosen(null)
    setPhase('ask')
    clock.current.qStart = performance.now()
    clock.current.running = true
  }, [finish, i, round.length])

  const choose = (opt: number) => {
    if (phase !== 'ask' || finished.current) return
    const now = performance.now()
    const correct = opt === q.answer
    answers.current.push({ qid: q.id, skill: q.skill, level: q.level, chosen: opt, correct, ms: Math.round(now - clock.current.qStart) })
    setChosen(opt)
    if (q.reveal) {
      clock.current.running = false
      setPhase('reveal')
      setTimeout(next, REVEAL_MS)
    } else {
      setPhase('feedback')
      setTimeout(next, FEEDBACK_MS)
    }
  }

  const isAi = q.skill === 'ai'
  if (import.meta.env.DEV) (window as unknown as { __correct?: number }).__correct = q.answer

  return (
    <div className="relative flex h-full flex-col bg-[#f1f2f4] px-10 pb-10 pt-6 text-ink">
      <div className="flex justify-center">
        <div className="rounded-full bg-brand-deep text-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-4 px-5 py-2.5">
              <Countdown leftMs={leftMs} totalMs={TOTAL_MS} size={56} className="text-white" />
              <div className="leading-tight">
                <p className="text-sm text-white/60">{cat.label}</p>
                <p className="text-xl font-semibold tabular-nums">
                  {i + 1} <span className="text-white/50">/ {round.length}</span>
                </p>
              </div>
              <div className="ml-2 flex gap-1.5">
                {round.map((r, k) => {
                  const a = answers.current[k]
                  return (
                    <span
                      key={r.id}
                      className={cn(
                        'h-2.5 w-2.5 rounded-full',
                        a ? (a.correct ? 'bg-emerald-400' : 'bg-coral') : k === i ? 'bg-white' : 'bg-white/25',
                      )}
                    />
                  )
                })}
              </div>
            </div>
        </div>
      </div>

      <div className="mt-8 flex flex-1 flex-col justify-center pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col gap-6"
          >
            <BorderBeam active={phase === 'ask'} colorFrom={isAi ? '#fc694f' : '#2e36b8'} colorTo="#ffffff" duration={4} size={160} borderWidth={2} radius={28}>
              <div className="rounded-[28px] bg-white p-8">
                <div className="mb-4 flex items-center gap-3">
                  {isAi ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-coral-soft px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-coral">
                      <SiriOrb size="22px" state="thinking" colors={{ bg: '#ffefea', c1: '#fc694f', c2: '#2e36b8', c3: '#fcc24a', c4: '#3887f5' }} />
                      AI question
                    </span>
                  ) : (
                    <span className="rounded-full bg-brand-soft px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-brand">
                      {q.level === 1 ? 'Warm-up' : q.level === 2 ? 'Core' : 'Pro'}
                    </span>
                  )}
                </div>
                <p className="min-h-[2.4em] text-[38px] font-semibold leading-tight tracking-tight">{q.q}</p>
              </div>
            </BorderBeam>

            <div className="grid grid-cols-2 gap-4">
              {q.options.map((opt, k) => {
                const isCorrect = k === q.answer
                const isChosen = chosen === k
                const show = phase !== 'ask'
                return (
                  <motion.button
                    key={k}
                    whileTap={phase === 'ask' ? { scale: 0.97 } : undefined}
                    onClick={() => choose(k)}
                    className={cn(
                      'flex min-h-28 items-center gap-4 rounded-3xl border-2 bg-white px-6 py-4 text-left text-2xl font-medium transition-colors',
                      !show && 'border-line',
                      show && isCorrect && 'border-emerald-500 bg-emerald-50 text-emerald-800',
                      show && isChosen && !isCorrect && 'border-coral bg-coral-soft text-coral',
                      show && !isChosen && !isCorrect && 'border-line opacity-40',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold',
                        show && isCorrect ? 'bg-emerald-500 text-white' : show && isChosen ? 'bg-coral text-white' : 'bg-brand-soft text-brand',
                      )}
                    >
                      {LETTERS[k]}
                    </span>
                    {opt}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {phase === 'reveal' && q.reveal && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
            className="absolute inset-x-10 bottom-10 z-30 flex items-center gap-6 rounded-[28px] bg-brand-deep p-7 text-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
          >
            <SiriOrb size="88px" state="streaming" colors={{ bg: '#0a2952', c1: '#fc694f', c2: '#2e36b8', c3: '#fcc24a', c4: '#66d1ff' }} />
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-coral">{chosen === q.answer ? 'Correct, and yes, this is real' : 'Yes, this is real today'}</p>
              <p className="mt-1 text-2xl leading-snug">
                <TypewriterText speed={14}>{q.reveal}</TypewriterText>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

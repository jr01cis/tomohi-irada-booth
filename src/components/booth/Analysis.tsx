import { motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import AIReasoning from '@/components/smoothui/ai-reasoning'
import AIResponse from '@/components/smoothui/ai-response'
import SiriOrb from '@/components/smoothui/siri-orb'
import type { Course } from '@/data/courses'
import { CATEGORIES, SKILL_LABELS, type Category } from '@/data/questions'
import type { Analysis as AnalysisData } from '@/lib/engine'
import { cn } from '@/lib/utils'

interface Props {
  name: string
  category: Category
  analysis: AnalysisData
  courses: Course[]
  elapsedMs: number
  onDone?: () => void
}

const STEP_MS = 520
const WORD_MS = 42

const label = (s: string) => SKILL_LABELS[s] ?? s
const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`)

/** Reasoning trace, streamed verdict and the skill map. Course picks live in `CoursePicks` so screens can place them. */
export function Analysis({ name, category, analysis, courses, elapsedMs, onDone }: Props) {
  const cat = CATEGORIES.find((c) => c.id === category)!
  const first = name.split(' ')[0]
  const weak = analysis.weak.map((s) => label(s.skill))
  const strong = analysis.strong.map((s) => label(s.skill))

  const steps = useMemo(
    () => [
      `Reading ${analysis.total} answers across ${analysis.bySkill.length} skills`,
      `Average answer time ${(analysis.avgMs / 1000).toFixed(1)} s, round done in ${Math.round(elapsedMs / 1000)} s`,
      strong.length ? `Strong signal on ${list(strong)}` : 'No skill at 100% yet',
      weak.length ? `Gaps found in ${list(weak)}` : 'No gaps worth naming',
      `Matching gaps against the Tomohi catalog`,
      `Shortlisting ${courses.length} courses`,
    ],
    [analysis, strong, weak, courses.length, elapsedMs],
  )

  const text = useMemo(() => {
    const tier =
      analysis.pct >= 90 ? 'top tier' : analysis.pct >= 70 ? 'solid' : analysis.pct >= 40 ? 'a good base' : 'plenty of room, which is the fun part'
    const parts = [`${first}, ${analysis.score} out of ${analysis.total} in ${cat.label}. That is ${analysis.pct}%, ${tier}.`]
    if (strong.length) parts.push(`You are sharp on ${list(strong)}.`)
    parts.push(weak.length ? `The gaps are in ${list(weak)}.` : 'No gaps worth naming, so the next level is the target.')
    if (analysis.aiAsked) {
      parts.push(
        analysis.aiCorrect === analysis.aiAsked
          ? 'You also got every AI question, which puts you ahead of most of the room.'
          : `You missed ${analysis.aiAsked - analysis.aiCorrect} of ${analysis.aiAsked} AI questions. Each one was something AI can already do for you today.`,
      )
    }
    if (courses[0]) parts.push(`Start with ${courses[0].name}: ${courses[0].blurb.toLowerCase()}.`)
    return parts.join(' ')
  }, [analysis, cat.label, courses, first, strong, weak])

  const words = useMemo(() => text.split(' '), [text])
  const [shownSteps, setShownSteps] = useState(0)
  const [shownWords, setShownWords] = useState(0)
  const reasoning = shownSteps < steps.length
  const streaming = !reasoning && shownWords < words.length
  const finished = !reasoning && !streaming

  useEffect(() => {
    if (shownSteps < steps.length) {
      const t = setTimeout(() => setShownSteps((s) => s + 1), STEP_MS)
      return () => clearTimeout(t)
    }
    if (shownWords < words.length) {
      const t = setTimeout(() => setShownWords((w) => w + 1), WORD_MS)
      return () => clearTimeout(t)
    }
    onDone?.()
  }, [shownSteps, shownWords, steps.length, words.length, onDone])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <SiriOrb size="64px" state={finished ? 'idle' : 'thinking'} colors={{ bg: '#e9ebfa', c1: '#2e36b8', c2: '#fc694f', c3: '#3887f5', c4: '#fcc24a' }} />
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-coral">Tomohi analysis</p>
          <p className="text-2xl font-semibold text-ink">{finished ? 'Here is where you stand' : 'Reading your round'}</p>
        </div>
      </div>

      <AIReasoning isStreaming={reasoning} collapseWhenDone defaultOpen className="rounded-2xl bg-white/70 px-4 py-2">
        <ul className="space-y-1 text-base text-body">
          {steps.slice(0, shownSteps).map((s) => (
            <motion.li key={s} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
              {s}
            </motion.li>
          ))}
        </ul>
      </AIReasoning>

      {!reasoning && <AIResponse text={words.slice(0, shownWords).join(' ')} isStreaming={streaming} className="text-xl leading-relaxed text-ink" />}

      {finished && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-white p-5">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-body">Skill map</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {analysis.bySkill.map((s, i) => (
              <li key={s.skill}>
                <div className="mb-1 flex justify-between text-base">
                  <span className="font-medium text-ink">{label(s.skill)}</span>
                  <span className="tabular-nums text-body">
                    {s.correct}/{s.asked}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-line">
                  <motion.div
                    className={cn('h-full rounded-full', s.pct === 100 ? 'bg-brand' : s.pct === 0 ? 'bg-coral' : 'bg-brand-light')}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(6, s.pct)}%` }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}

export function CoursePicks({ courses }: { courses: Course[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold uppercase tracking-widest text-coral">Recommended for you</p>
      {courses.map((c, i) => (
        <motion.div
          key={c.name}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.12 }}
          className={cn('rounded-3xl border-2 p-5', i === 0 ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink')}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-xl font-semibold leading-tight">{c.name}</p>
            {i === 0 && <span className="shrink-0 rounded-full bg-coral px-3 py-1 text-xs font-bold uppercase tracking-wider">Start here</span>}
          </div>
          <p className={cn('mt-1 text-base', i === 0 ? 'text-white/80' : 'text-body')}>
            {c.blurb}. {c.sessions} sessions with a mentor.
          </p>
        </motion.div>
      ))}
    </div>
  )
}

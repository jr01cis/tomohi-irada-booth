import { QUESTIONS, type Category, type QKind, type Question } from '@/data/questions'

export const ROUND_SIZE = 10
export const AI_PER_ROUND = 3
export const ROUND_SECONDS = 60

export type RoundQuestion = Question

export interface Answer {
  qid: string
  skill: string
  level: number
  kind: QKind
  /** mcq: option index. number: the typed value. null = not reached before the bell. */
  chosen: number | null
  correct: boolean
  ms: number
}

export interface SkillStat {
  skill: string
  asked: number
  correct: number
  pct: number
  /** points lost and points at stake on answered questions, weighted by level */
  lost: number
  max: number
}

export interface Analysis {
  /** right answers out of the whole round: drives the reward */
  score: number
  total: number
  pct: number
  answered: number
  /** questions the bell cut off: neither right nor wrong */
  missed: number
  /** right answers out of answered ones: drives the verdict and course level */
  accuracy: number
  /** 1 under 40%, 2 up to 79%, 3 from 80%, on accuracy */
  tier: 1 | 2 | 3
  bySkill: SkillStat[]
  /** skills that only had unanswered questions */
  notReached: string[]
  weak: SkillStat[]
  strong: SkillStat[]
  aiCorrect: number
  aiAsked: number
  avgMs: number
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** n questions from the pool, spreading skills before repeating one. */
function pickDistinct(pool: Question[], n: number, rng: () => number): Question[] {
  const shuffled = shuffle(pool, rng)
  const out: Question[] = []
  const seen = new Set<string>()
  for (const q of shuffled) {
    if (out.length >= n) break
    if (!seen.has(q.skill)) {
      out.push(q)
      seen.add(q.skill)
    }
  }
  for (const q of shuffled) {
    if (out.length >= n) break
    if (!out.includes(q)) out.push(q)
  }
  return out
}

function withShuffledOptions(q: Question, rng: () => number): RoundQuestion {
  if (q.kind !== 'mcq' || !q.options) return q
  const idx = shuffle([0, 1, 2, 3], rng)
  return {
    ...q,
    options: idx.map((i) => q.options![i]) as [string, string, string, string],
    answer: idx.indexOf(q.answer),
  }
}

/** Difficulty rises through the round: 2 warm-up, 3 core, 1 typed number, 1 pro, with the 3 AI questions at slots 3, 6, 9. */
export function buildRound(cat: Category, rng: () => number = Math.random): RoundQuestion[] {
  const pool = QUESTIONS.filter((q) => q.cat === cat)
  const ai = shuffle(pool.filter((q) => q.skill === 'ai'), rng).slice(0, AI_PER_ROUND)
  const topic = pool.filter((q) => q.skill !== 'ai')
  const l1 = pickDistinct(topic.filter((q) => q.level === 1), 2, rng)
  const l2 = pickDistinct(topic.filter((q) => q.level === 2), 3, rng)
  const num = shuffle(topic.filter((q) => q.kind === 'number'), rng).slice(0, 1)
  const l3 = shuffle(topic.filter((q) => q.level === 3 && q.kind === 'mcq'), rng).slice(0, 1)

  const seq = [l1[0], l1[1], ai[0], l2[0], l2[1], ai[1], l2[2], num[0], ai[2], l3[0]].filter(Boolean) as Question[]
  if (seq.length < ROUND_SIZE) {
    for (const q of shuffle(topic, rng)) {
      if (seq.length >= ROUND_SIZE) break
      if (!seq.includes(q)) seq.push(q)
    }
  }
  return seq.map((q) => withShuffledOptions(q, rng))
}

export function isCorrectNumber(q: Question, typed: number): boolean {
  return Math.abs(typed - q.answer) <= (q.tolerance ?? 0.0001)
}

export function analyze(answers: Answer[]): Analysis {
  const total = answers.length
  const done = answers.filter((a) => a.chosen !== null)
  const score = done.filter((a) => a.correct).length
  const answered = done.length
  const accuracy = answered ? Math.round((score / answered) * 100) : 0

  const map = new Map<string, SkillStat>()
  for (const a of done) {
    const s = map.get(a.skill) ?? { skill: a.skill, asked: 0, correct: 0, pct: 0, lost: 0, max: 0 }
    s.asked += 1
    s.max += a.level
    if (a.correct) s.correct += 1
    else s.lost += a.level
    map.set(a.skill, s)
  }
  const bySkill = [...map.values()].map((s) => ({ ...s, pct: Math.round((s.correct / s.asked) * 100) }))
  const notReached = [...new Set(answers.filter((a) => a.chosen === null).map((a) => a.skill))].filter((s) => !map.has(s))
  const weak = bySkill
    .filter((s) => s.lost > 0)
    .sort((a, b) => b.lost - a.lost || a.pct - b.pct)
    .slice(0, 2)
  const strong = bySkill
    .filter((s) => s.lost === 0)
    .sort((a, b) => b.max - a.max)
    .slice(0, 2)
  const aiStats = bySkill.find((s) => s.skill === 'ai')

  return {
    score,
    total,
    pct: total ? Math.round((score / total) * 100) : 0,
    answered,
    missed: total - answered,
    accuracy,
    tier: accuracy < 40 ? 1 : accuracy < 80 ? 2 : 3,
    bySkill,
    notReached,
    weak,
    strong,
    aiCorrect: aiStats?.correct ?? 0,
    aiAsked: aiStats?.asked ?? 0,
    avgMs: answered ? Math.round(done.reduce((s, a) => s + a.ms, 0) / answered) : 0,
  }
}

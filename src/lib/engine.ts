import { QUESTIONS, type Category, type Question } from '@/data/questions'

export const ROUND_SIZE = 10
export const AI_PER_ROUND = 3
export const ROUND_SECONDS = 60
export const FREE_SESSION_PCT = 70

export interface RoundQuestion extends Omit<Question, 'options' | 'answer'> {
  options: string[]
  answer: number
}

export interface Answer {
  qid: string
  skill: string
  level: number
  chosen: number | null
  correct: boolean
  ms: number
}

export interface SkillStat {
  skill: string
  asked: number
  correct: number
  pct: number
}

export interface Analysis {
  score: number
  total: number
  pct: number
  freeSession: boolean
  bySkill: SkillStat[]
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

function withShuffledOptions(q: Question, rng: () => number): RoundQuestion {
  const idx = shuffle([0, 1, 2, 3], rng)
  return {
    ...q,
    options: idx.map((i) => q.options[i]),
    answer: idx.indexOf(q.answer),
  }
}

/** 7 topic questions (one per skill first, then random), 3 AI questions at positions 3, 6, 9. */
export function buildRound(cat: Category, rng: () => number = Math.random): RoundQuestion[] {
  const pool = QUESTIONS.filter((q) => q.cat === cat)
  const ai = shuffle(pool.filter((q) => q.skill === 'ai'), rng).slice(0, AI_PER_ROUND)
  const topic = shuffle(pool.filter((q) => q.skill !== 'ai'), rng)

  const picked: Question[] = []
  const seenSkill = new Set<string>()
  for (const q of topic) {
    if (!seenSkill.has(q.skill)) {
      seenSkill.add(q.skill)
      picked.push(q)
    }
  }
  for (const q of topic) {
    if (picked.length >= ROUND_SIZE - AI_PER_ROUND) break
    if (!picked.includes(q)) picked.push(q)
  }
  const ordered = shuffle(picked, rng)

  const out: Question[] = []
  let aiIdx = 0
  for (let i = 0; i < ROUND_SIZE; i++) {
    const isAiSlot = (i + 1) % 3 === 0 && aiIdx < ai.length
    out.push(isAiSlot ? ai[aiIdx++] : ordered.shift()!)
  }
  return out.map((q) => withShuffledOptions(q, rng))
}

export function analyze(answers: Answer[]): Analysis {
  const total = answers.length
  const score = answers.filter((a) => a.correct).length
  const pct = total ? Math.round((score / total) * 100) : 0

  const map = new Map<string, SkillStat>()
  for (const a of answers) {
    const s = map.get(a.skill) ?? { skill: a.skill, asked: 0, correct: 0, pct: 0 }
    s.asked += 1
    if (a.correct) s.correct += 1
    map.set(a.skill, s)
  }
  const bySkill = [...map.values()].map((s) => ({ ...s, pct: Math.round((s.correct / s.asked) * 100) }))
  const sorted = bySkill.slice().sort((a, b) => a.pct - b.pct || b.asked - a.asked)
  const weak = sorted.filter((s) => s.pct < 100).slice(0, 2)
  const strong = sorted.filter((s) => s.pct === 100).slice(-2).reverse()
  const aiStats = bySkill.find((s) => s.skill === 'ai')
  const answered = answers.filter((a) => a.chosen !== null)

  return {
    score,
    total,
    pct,
    freeSession: pct >= FREE_SESSION_PCT,
    bySkill,
    weak,
    strong,
    aiCorrect: aiStats?.correct ?? 0,
    aiAsked: aiStats?.asked ?? 0,
    avgMs: answered.length ? Math.round(answered.reduce((s, a) => s + a.ms, 0) / answered.length) : 0,
  }
}

/**
 * Rewards match marketing's printed voucher cards (2026-10-30): 10%, 15%, 20% off a full course, and 1 free session.
 * Wheel prizes are 10 / 15 / 20 / SESSION. Challenge rewards are a free demo (marketing's quiz card), plus a discount for 8, 9 or 10 out of 10.
 */
export type Prize = '10' | '15' | '20' | 'SESSION' | 'DEMO' | 'DEMO10' | 'DEMO15' | 'DEMO20'
export type WheelPrize = '10' | '15' | '20' | 'SESSION'

export const VALID_UNTIL = '14 Nov 2026'

export interface Slice {
  prize: WheelPrize
  label: string
  weight: number
}

/** Weighted outcome. Weights are the real odds, independent of how many visual slices show each prize. */
export const OUTCOMES: Slice[] = [
  { prize: '10', label: '10% off a full course', weight: 48 },
  { prize: '15', label: '15% off a full course', weight: 30 },
  { prize: '20', label: '20% off a full course', weight: 12 },
  { prize: 'SESSION', label: 'A free session', weight: 10 },
]

/** What the wheel shows, clockwise from the top. */
export const WHEEL_SLICES: WheelPrize[] = ['10', '15', '10', '20', '10', '15', '10', 'SESSION']

export const PRIZE_HEADLINE: Record<Prize, string> = {
  '10': '10% off a full course',
  '15': '15% off a full course',
  '20': '20% off a full course',
  SESSION: 'A free session, on us',
  DEMO: 'A free demo session',
  DEMO10: 'Free demo + 10% off a full course',
  DEMO15: 'Free demo + 15% off a full course',
  DEMO20: 'Free demo + 20% off a full course',
}

/** Read after "I'd like to claim my". */
export const PRIZE_CLAIM: Record<Prize, string> = {
  '10': '10% off a full course',
  '15': '15% off a full course',
  '20': '20% off a full course',
  SESSION: 'free session',
  DEMO: 'free demo session',
  DEMO10: 'free demo + 10% off a full course',
  DEMO15: 'free demo + 15% off a full course',
  DEMO20: 'free demo + 20% off a full course',
}

/** Marketing's card artwork for each prize, in public/vouchers/. Every challenge reward uses the quiz card (free 30 min session). */
export type CardArt = 'session' | '10' | '15' | '20' | 'quiz'
export const PRIZE_CARD: Record<Prize, CardArt> = {
  '10': '10',
  '15': '15',
  '20': '20',
  SESSION: 'session',
  DEMO: 'quiz',
  DEMO10: 'quiz',
  DEMO15: 'quiz',
  DEMO20: 'quiz',
}

/** The discount a strong round adds on top of the quiz card's free session. */
export const BONUS_LINE: Partial<Record<Prize, string>> = {
  DEMO10: '+ 10% off a full course',
  DEMO15: '+ 15% off a full course',
  DEMO20: '+ 20% off a full course',
}

export const isBigPrize = (p: Prize) => p === '20' || p === 'SESSION' || p === 'DEMO15' || p === 'DEMO20'

/** Everyone who plays gets a free demo. 8/10 adds 10%, 9/10 adds 15%, 10/10 adds 20%. */
export function challengePrize(score: number, total: number): Prize {
  if (score >= total) return 'DEMO20'
  if (score >= total - 1) return 'DEMO15'
  if (score >= total - 2) return 'DEMO10'
  return 'DEMO'
}

export function spinOutcome(rng: () => number = Math.random): WheelPrize {
  const total = OUTCOMES.reduce((s, o) => s + o.weight, 0)
  let r = rng() * total
  for (const o of OUTCOMES) {
    r -= o.weight
    if (r < 0) return o.prize
  }
  return OUTCOMES[0].prize
}

/** Picks one of the visual slices that carries the prize, so the pointer lands on a matching label. */
export function sliceIndexFor(prize: WheelPrize, rng: () => number = Math.random): number {
  const candidates = WHEEL_SLICES.map((p, i) => (p === prize ? i : -1)).filter((i) => i >= 0)
  return candidates[Math.floor(rng() * candidates.length)]
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

const CODE_TOKEN: Record<Prize, string> = { '10': '10', '15': '15', '20': '20', SESSION: 'SESS', DEMO: 'DEMO', DEMO10: 'D10', DEMO15: 'D15', DEMO20: 'D20' }

export function makeCode(prize: Prize, rng: () => number = Math.random): string {
  let tail = ''
  for (let i = 0; i < 4; i++) tail += ALPHABET[Math.floor(rng() * ALPHABET.length)]
  return `IRD-${CODE_TOKEN[prize]}-${tail}`
}

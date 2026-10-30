/** Wheel prizes are 10 / 20 / 30 / SESSION. Challenge rewards are a free demo, plus a discount for 8, 9 or 10 out of 10. */
export type Prize = '10' | '20' | '30' | 'SESSION' | 'DEMO' | 'DEMO10' | 'DEMO20' | 'DEMO30'
export type WheelPrize = '10' | '20' | '30' | 'SESSION'

export const VALID_UNTIL = '14 Nov 2026'

export interface Slice {
  prize: WheelPrize
  label: string
  weight: number
}

/** Weighted outcome. Weights are the real odds, independent of how many visual slices show each prize. */
export const OUTCOMES: Slice[] = [
  { prize: '10', label: '10% off a full course', weight: 48 },
  { prize: '20', label: '20% off a full course', weight: 30 },
  { prize: '30', label: '30% off a full course', weight: 12 },
  { prize: 'SESSION', label: 'A free session', weight: 10 },
]

/** What the wheel shows, clockwise from the top. */
export const WHEEL_SLICES: WheelPrize[] = ['10', '20', '10', '30', '10', '20', '10', 'SESSION']

export const PRIZE_HEADLINE: Record<Prize, string> = {
  '10': '10% off a full course',
  '20': '20% off a full course',
  '30': '30% off a full course',
  SESSION: 'A free session, on us',
  DEMO: 'A free demo session',
  DEMO10: 'Free demo + 10% off a full course',
  DEMO20: 'Free demo + 20% off a full course',
  DEMO30: 'Free demo + 30% off a full course',
}

/** Read after "I'd like to claim my". */
export const PRIZE_CLAIM: Record<Prize, string> = {
  '10': '10% off a full course',
  '20': '20% off a full course',
  '30': '30% off a full course',
  SESSION: 'free session',
  DEMO: 'free demo session',
  DEMO10: 'free demo + 10% off a full course',
  DEMO20: 'free demo + 20% off a full course',
  DEMO30: 'free demo + 30% off a full course',
}

export const isBigPrize = (p: Prize) => p === '30' || p === 'SESSION' || p === 'DEMO20' || p === 'DEMO30'

/** Everyone who plays gets a free demo. 8/10 adds 10%, 9/10 adds 20%, 10/10 adds 30%. */
export function challengePrize(score: number, total: number): Prize {
  if (score >= total) return 'DEMO30'
  if (score >= total - 1) return 'DEMO20'
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

const CODE_TOKEN: Record<Prize, string> = { '10': '10', '20': '20', '30': '30', SESSION: 'SESS', DEMO: 'DEMO', DEMO10: 'D10', DEMO20: 'D20', DEMO30: 'D30' }

export function makeCode(prize: Prize, rng: () => number = Math.random): string {
  let tail = ''
  for (let i = 0; i < 4; i++) tail += ALPHABET[Math.floor(rng() * ALPHABET.length)]
  return `IRD-${CODE_TOKEN[prize]}-${tail}`
}

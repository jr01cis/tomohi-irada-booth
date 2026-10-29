export type Prize = '10' | '20' | '30' | 'FREE' | 'SESSION'

export const VALID_UNTIL = '14 Nov 2026'

export interface Slice {
  prize: Prize
  label: string
  weight: number
}

/** Weighted outcome. Weights are the real odds, independent of how many visual slices show each prize. */
export const OUTCOMES: Slice[] = [
  { prize: '10', label: '10% off', weight: 52 },
  { prize: '20', label: '20% off', weight: 30 },
  { prize: '30', label: '30% off', weight: 15 },
  { prize: 'FREE', label: 'Free course', weight: 3 },
]

/** What the wheel shows, clockwise from the top. */
export const WHEEL_SLICES: Prize[] = ['10', '20', '10', '30', '10', '20', '10', 'FREE']

export const PRIZE_LABEL: Record<Prize, string> = {
  '10': '10% off',
  '20': '20% off',
  '30': '30% off',
  FREE: 'Free course',
  SESSION: 'Free session',
}

export const PRIZE_HEADLINE: Record<Prize, string> = {
  '10': '10% off any course',
  '20': '20% off any course',
  '30': '30% off any course',
  FREE: 'A whole course, on us',
  SESSION: 'A free session, on us',
}

export function spinOutcome(rng: () => number = Math.random): Prize {
  const total = OUTCOMES.reduce((s, o) => s + o.weight, 0)
  let r = rng() * total
  for (const o of OUTCOMES) {
    r -= o.weight
    if (r < 0) return o.prize
  }
  return OUTCOMES[0].prize
}

/** Picks one of the visual slices that carries the prize, so the pointer lands on a matching label. */
export function sliceIndexFor(prize: Prize, rng: () => number = Math.random): number {
  const candidates = WHEEL_SLICES.map((p, i) => (p === prize ? i : -1)).filter((i) => i >= 0)
  return candidates[Math.floor(rng() * candidates.length)]
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

const CODE_TOKEN: Record<Prize, string> = { '10': '10', '20': '20', '30': '30', FREE: 'FREE', SESSION: 'SESS' }

export function makeCode(prize: Prize, rng: () => number = Math.random): string {
  let tail = ''
  for (let i = 0; i < 4; i++) tail += ALPHABET[Math.floor(rng() * ALPHABET.length)]
  return `IRD-${CODE_TOKEN[prize]}-${tail}`
}

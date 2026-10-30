import { CATEGORIES } from '@/data/questions'
import type { Session } from '@/lib/session'
import { PRIZE_CLAIM, PRIZE_HEADLINE, VALID_UNTIL } from '@/lib/voucher'

/** Tomohi's WhatsApp number, international format without the plus. Overridable per build. */
export const TOMOHI_WHATSAPP = (import.meta.env.VITE_TOMOHI_WHATSAPP as string | undefined) || '96179333147'

/** Wording from Joe, 2026-10-30. */
export function buildMessage(s: Session): string {
  const name = s.lead?.name ?? ''
  const intro = 'Hi Tomohi, I was at your booth at Irada.'

  if (s.mode === 'challenge' && s.analysis) {
    const cat = CATEGORIES.find((c) => c.id === s.category)?.label ?? ''
    const lines = [intro, `My name is: ${name}`, `I did this challenge: ${cat}, ${s.analysis.score}/${s.analysis.total}`]
    if (s.courses?.[0]) lines.push(`My recommended course is: ${s.courses[0].course.name}`)
    if (s.prize && s.code) lines.push(`I'd like to claim my ${PRIZE_CLAIM[s.prize]} (code ${s.code}, valid until ${VALID_UNTIL})`)
    return lines.join('\n')
  }

  const lines = [intro, `My name: ${name}`]
  if (s.prize && s.code) lines.push(`My reward is: ${PRIZE_HEADLINE[s.prize]} (code ${s.code}) valid until ${VALID_UNTIL}`)
  lines.push("I'd like to claim it please.")
  return lines.join('\n')
}

export function waLink(s: Session): string {
  return `https://wa.me/${TOMOHI_WHATSAPP}?text=${encodeURIComponent(buildMessage(s))}`
}

import { CATEGORIES } from '@/data/questions'
import type { Session } from '@/lib/session'
import { PRIZE_HEADLINE, VALID_UNTIL } from '@/lib/voucher'

/** Tomohi's WhatsApp number, international format without the plus. Overridable per build. */
export const TOMOHI_WHATSAPP = (import.meta.env.VITE_TOMOHI_WHATSAPP as string | undefined) || '96179333147'

export function buildMessage(s: Session): string {
  const lines = ['Hi Tomohi, I was at your Irada booth.']
  if (s.prize && s.code) lines.push(`My reward: ${PRIZE_HEADLINE[s.prize]}. Code ${s.code}, valid until ${VALID_UNTIL}.`)
  if (s.mode === 'challenge' && s.analysis) {
    const cat = CATEGORIES.find((c) => c.id === s.category)?.label ?? ''
    lines.push(`Challenge: ${cat} ${s.analysis.score}/${s.analysis.total}.`)
    if (s.courses?.[0]) lines.push(`Recommended course: ${s.courses[0].name}.`)
  }
  if (s.lead?.name) lines.push(`Name: ${s.lead.name}`)
  return lines.join('\n')
}

export function waLink(s: Session): string {
  return `https://wa.me/${TOMOHI_WHATSAPP}?text=${encodeURIComponent(buildMessage(s))}`
}

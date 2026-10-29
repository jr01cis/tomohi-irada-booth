import type { Category } from '@/data/questions'
import type { Analysis, Answer, RoundQuestion } from '@/lib/engine'
import type { Mode } from '@/lib/queue'
import type { Prize } from '@/lib/voucher'
import type { Course } from '@/data/courses'

export type Screen =
  | 'attract'
  | 'wheel'
  | 'category'
  | 'quiz'
  | 'score'
  | 'form'
  | 'result'
  | 'voucher'

export interface LeadData {
  name: string
  phone: string
  industry: string
  audience: 'me' | 'team'
}

export interface Session {
  mode?: Mode
  prize?: Prize
  code?: string
  category?: Category
  round?: RoundQuestion[]
  answers?: Answer[]
  elapsedMs?: number
  analysis?: Analysis
  courses?: Course[]
  lead?: LeadData
}

export const LITE = new URLSearchParams(location.search).has('lite')

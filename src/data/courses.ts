import { CATEGORIES, SKILL_LABELS, type Category } from '@/data/questions'
import type { Analysis } from '@/lib/engine'

export interface Course {
  name: string
  blurb: string
  sessions: number
  /** the challenge category it serves, or 'ai' for the cross-field AI courses */
  cat: Category | 'ai'
  /** challenge skills this course fixes */
  skills: string[]
  /** 1 beginner, 2 intermediate, 3 advanced */
  level: 1 | 2 | 3
  team?: boolean
}

export interface Pick {
  course: Course
  reason: string
}

/** All names verified Active in the Tomohi Courses module on 2026-10-29. */
const C = (name: string, blurb: string, sessions: number, cat: Course['cat'], skills: string[], level: Course['level'], team = false): Course => ({
  name,
  blurb,
  sessions,
  cat,
  skills,
  level,
  team,
})

export const COURSES = {
  // Marketing
  dmm: C('Digital Marketing Mastery', 'Strategy, funnels and channels, end to end', 20, 'marketing', ['strategy', 'paid', 'analytics'], 2),
  sma: C('Social Media Advertising', 'Meta and TikTok ads that actually convert', 16, 'marketing', ['paid', 'analytics'], 2),
  seo: C('Search Engine Optimization (SEO)', 'Rank on Google without paying for every click', 18, 'marketing', ['seo'], 1),
  copy: C('Copywriting Essentials', 'Words that make people click, book and buy', 16, 'marketing', ['content'], 1),
  cms: C('Content Marketing Strategies', 'Plan content that builds an audience', 16, 'marketing', ['content', 'strategy'], 2),
  ccae: C('The Content Creator AI Engine', 'A month of content from one afternoon with AI', 10, 'ai', ['content', 'ai'], 2),
  geo: C('Generative Engine Optimization (GEO)', 'Get ChatGPT and Perplexity to recommend you', 10, 'ai', ['seo', 'ai'], 3),
  // Project management
  epm: C('Effective Project Management', 'Scope, plan, deliver, without the chaos', 18, 'pm', ['scope', 'risk', 'time', 'stakeholders'], 1),
  cpd: C('CPD Certified - Effective Project Management Essentials', 'Certified PM essentials in 10 sessions', 10, 'pm', ['scope', 'risk', 'agile', 'time'], 2, true),
  teams: C('Building High-Performance Teams', 'Lead people who deliver', 16, 'pm', ['stakeholders', 'agile'], 2, true),
  time: C('Mastering Time Management', 'Own your calendar, ship on time', 16, 'pm', ['time'], 1),
  events: C('Successful Event Management', 'Run events that run on time and on budget', 18, 'pm', ['time', 'stakeholders'], 1),
  // Business
  nego: C('Negotiation Skills Crash Course', 'Anchor, trade, close, in 3 sessions', 3, 'business', ['negotiation', 'sales'], 1),
  sales: C('Sales Fundamentals & Communication Skills', 'Discovery, objections, closing', 20, 'business', ['sales', 'negotiation'], 1),
  fin: C('Financial Accounting Basics', 'Read a P&L and a cash-flow without fear', 18, 'business', ['finance'], 1),
  corpfin: C('Introduction to Corporate Finance', 'Budgets, valuation, decisions', 16, 'business', ['finance', 'strategy'], 2),
  growth: C('Small Business Growth Strategies', 'From surviving to scaling', 18, 'business', ['strategy', 'sales'], 2),
  hr: C('Human Resources Essentials Crash Course!', 'Hiring, onboarding, reviews, in 3 sessions', 3, 'business', ['hr'], 1),
  perf: C('Performance Management & Employee Development', 'Reviews that develop people', 16, 'business', ['hr'], 2, true),
  speak: C('Public Speaking Crash Course!', 'Stand up and own the room', 3, 'business', ['sales'], 1),
  // Business English
  bec: C('Business English Communication', 'Emails, calls and meetings that sound professional', 18, 'english', ['email', 'meetings', 'vocabulary'], 2),
  ewm: C('English Writing Mastery', 'Clear, correct, confident writing', 18, 'english', ['email', 'grammar'], 2),
  spf: C('Speaking & Pronunciation Fluency', 'Speak up without hesitating', 18, 'english', ['meetings', 'pitching'], 2),
  egm: C('English Grammar Mastery', 'Fix the mistakes you keep making', 18, 'english', ['grammar', 'vocabulary'], 1),
  cv: C('CV Writing and Personal Branding Crash Course!', 'A CV that gets the interview, in 3 sessions', 3, 'english', ['pitching', 'email'], 1),
  // Design
  gde: C('Graphic Design Essentials', 'Type, color, layout, the foundations', 18, 'design', ['typography', 'color', 'layout'], 1),
  canva: C('Mastering Canva', 'Professional visuals without a design degree', 16, 'design', ['tools', 'layout'], 1),
  logo: C('Logo Design and Branding', 'Marks and identities that last', 16, 'design', ['color', 'typography'], 2),
  ui: C('User Interface (UI) Design', 'Screens people enjoy using', 16, 'design', ['layout', 'ux', 'tools'], 2),
  ux: C('User Experience (UX) Design', 'Research, flows and usability', 18, 'design', ['ux'], 2),
  figma: C('Prototyping with Figma', 'Clickable prototypes from sketch to handoff', 16, 'design', ['tools', 'ux'], 2),
  // AI, cross-field
  learnai: C('Learn AI!', 'The 8-session starting point', 8, 'ai', ['ai'], 1),
  agentic: C('Agentic AI', 'AI that does the work, not just the talking', 5, 'ai', ['ai'], 3),
  prompt: C('Prompt Engineering', 'Get usable output, every time', 16, 'ai', ['ai'], 2),
  promptcc: C('Prompt Engineering Crash Course!', 'The essentials in 2 sessions', 2, 'ai', ['ai'], 1),
  gpt: C('ChatGPT AI Mastery', 'ChatGPT as a daily colleague', 16, 'ai', ['ai'], 1),
  n8n: C('n8n Workflow Automation', 'Connect your apps, automate the boring part', 20, 'ai', ['ai'], 2, true),
  copilot: C('Microsoft Copilot Mastery', 'AI inside Word, Excel, Outlook and Teams', 20, 'ai', ['ai'], 1, true),
  excelai: C('Excel AI', 'Spreadsheets that answer questions', 16, 'ai', ['ai', 'analytics', 'finance'], 2),
  claude: C('Claude AI', 'Long documents, contracts and analysis with Claude', 10, 'ai', ['ai'], 2),
  canvaai: C('Canva AI', 'Let Canva do the heavy lifting', 16, 'ai', ['ai', 'tools'], 2),
  mj: C('Midjourney AI', 'Generate visuals that look designed', 16, 'ai', ['ai'], 2),
} satisfies Record<string, Course>

type Key = keyof typeof COURSES

/** The AI course for each field, first choice then the alternative. */
const FIELD_AI: Record<Category, Key[]> = {
  marketing: ['ccae', 'geo'],
  pm: ['agentic', 'n8n'],
  business: ['agentic', 'excelai'],
  english: ['gpt', 'promptcc'],
  design: ['canvaai', 'mj'],
}

/** Headline when nothing was lost on the topic questions. */
const NEXT_LEVEL: Record<Category, Key> = {
  marketing: 'dmm',
  pm: 'cpd',
  business: 'corpfin',
  english: 'spf',
  design: 'ux',
}

const label = (s: string) => SKILL_LABELS[s] ?? s
const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`)

/** One course that fixes the biggest gaps, the field's AI course, and a team course when they asked for the team. */
export function recommend(cat: Category, analysis: Analysis, audience: 'me' | 'team'): Pick[] {
  const field = CATEGORIES.find((c) => c.id === cat)?.label ?? cat
  const lost = new Map(analysis.bySkill.map((s) => [s.skill, s.lost]))
  const anyLost = analysis.bySkill.some((s) => s.skill !== 'ai' && s.lost > 0)
  const picks: Pick[] = []

  const fieldCourses = Object.values(COURSES).filter((c) => c.cat === cat)
  let fixer: Course | undefined
  if (anyLost) {
    const scored = fieldCourses
      .map((c) => {
        const covered = c.skills.filter((s) => (lost.get(s) ?? 0) > 0)
        const points = covered.reduce((sum, s) => sum + (lost.get(s) ?? 0), 0)
        const levelFit = c.level === analysis.tier ? 1.5 : c.level === analysis.tier - 1 ? 0.5 : 0
        const teamFit = audience === 'team' && c.team ? 1 : 0
        return { c, covered, score: points * 2 + levelFit + teamFit }
      })
      .filter((x) => x.covered.length > 0)
      .sort((a, b) => b.score - a.score)
    const best = scored[0]
    if (best) {
      fixer = best.c
      picks.push({ course: best.c, reason: `Fixes ${list(best.covered.map(label))}` })
    }
  }
  if (!fixer) {
    fixer = COURSES[NEXT_LEVEL[cat]]
    picks.push({ course: fixer, reason: 'A clean round. This is the next level.' })
  }

  const aiKey = FIELD_AI[cat].find((k) => COURSES[k] !== fixer) ?? FIELD_AI[cat][0]
  const missed = analysis.aiAsked - analysis.aiCorrect
  picks.push({
    course: COURSES[aiKey],
    reason:
      missed > 0
        ? `You missed ${missed} AI question${missed > 1 ? 's' : ''}. This is the one that pays back first in ${field}.`
        : 'You already see what AI can do. This is where you make it do the work.',
  })

  if (audience === 'team') {
    const teamCourse = fieldCourses.find((c) => c.team && c !== fixer) ?? COURSES.copilot
    if (!picks.some((p) => p.course === teamCourse)) picks.push({ course: teamCourse, reason: 'Built for a team, which is what you asked for.' })
  }

  return picks.slice(0, 3)
}

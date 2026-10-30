import { DEMO_MENTORS_BY_COURSE } from '@/data/mentors'
import { CATEGORIES, SKILL_LABELS, type Category } from '@/data/questions'
import type { Analysis } from '@/lib/engine'

export interface Course {
  name: string
  blurb: string
  sessions: number
  /** the challenge categories whose gaps this course can fix */
  cats: Category[]
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

/** All names verified Active in the Tomohi Courses module on 2026-10-29 and 2026-10-30. */
const C = (name: string, blurb: string, sessions: number, cats: Category[], skills: string[], level: Course['level'], team = false): Course => ({
  name,
  blurb,
  sessions,
  cats,
  skills,
  level,
  team,
})

export const COURSES = {
  // Marketing
  dmm: C('Digital Marketing Mastery', 'Strategy, funnels and channels, end to end', 20, ['marketing'], ['strategy', 'paid', 'analytics'], 2),
  sma: C('Social Media Advertising', 'Meta and TikTok ads that actually convert', 16, ['marketing'], ['paid', 'analytics'], 2),
  seo: C('Search Engine Optimization (SEO)', 'Rank on Google without paying for every click', 18, ['marketing'], ['seo'], 1),
  copy: C('Copywriting Essentials', 'Words that make people click, book and buy', 16, ['marketing'], ['content'], 1),
  cms: C('Content Marketing Strategies', 'Plan content that builds an audience', 16, ['marketing'], ['content', 'strategy'], 2),
  ccae: C('The Content Creator AI Engine', 'A month of content from one afternoon with AI', 10, ['marketing'], ['content'], 2),
  geo: C('Generative Engine Optimization (GEO)', 'Get ChatGPT and Perplexity to recommend you', 10, ['marketing'], ['seo'], 3),
  // Project management
  epm: C('Effective Project Management', 'Scope, plan, deliver, without the chaos', 18, ['pm'], ['scope', 'risk', 'time', 'stakeholders'], 1),
  cpd: C('CPD Certified - Effective Project Management Essentials', 'Certified PM essentials in 10 sessions', 10, ['pm'], ['scope', 'risk', 'agile', 'time'], 2, true),
  teams: C('Building High-Performance Teams', 'Lead people who deliver', 16, ['pm'], ['stakeholders', 'agile'], 2, true),
  time: C('Mastering Time Management', 'Own your calendar, ship on time', 16, ['pm', 'career'], ['time', 'productivity'], 1),
  events: C('Successful Event Management', 'Run events that run on time and on budget', 18, ['pm'], ['time', 'stakeholders'], 1),
  // Business
  nego: C('Negotiation Skills Crash Course', 'Anchor, trade, close, in 3 sessions', 3, ['business'], ['negotiation', 'sales'], 1),
  sales: C('Sales Fundamentals & Communication Skills', 'Discovery, objections, closing', 20, ['business'], ['sales', 'negotiation'], 1),
  fin: C('Financial Accounting Basics', 'Read a P&L and a cash-flow without fear', 18, ['business'], ['finance'], 1),
  corpfin: C('Introduction to Corporate Finance', 'Budgets, valuation, decisions', 16, ['business'], ['finance', 'strategy'], 2),
  growth: C('Small Business Growth Strategies', 'From surviving to scaling', 18, ['business'], ['strategy', 'sales'], 2),
  hr: C('Human Resources Essentials Crash Course!', 'Hiring, onboarding, reviews, in 3 sessions', 3, ['business'], ['hr'], 1),
  perf: C('Performance Management & Employee Development', 'Reviews that develop people', 16, ['business'], ['hr'], 2, true),
  speak: C('Public Speaking Crash Course!', 'Stand up and own the room', 3, ['business', 'career'], ['sales', 'interview', 'branding'], 1),
  excelai: C('Excel AI', 'Spreadsheets that answer questions', 16, ['business'], ['finance'], 2),
  // Business English
  bec: C('Business English Communication', 'Emails, calls and meetings that sound professional', 18, ['english'], ['email', 'meetings', 'vocabulary'], 2),
  ewm: C('English Writing Mastery', 'Clear, correct, confident writing', 18, ['english'], ['email', 'grammar'], 2),
  spf: C('Speaking & Pronunciation Fluency', 'Speak up without hesitating', 18, ['english'], ['meetings', 'pitching'], 2),
  egm: C('English Grammar Mastery', 'Fix the mistakes you keep making', 18, ['english'], ['grammar', 'vocabulary'], 1),
  cv: C('CV Writing and Personal Branding Crash Course!', 'A CV that gets the interview, in 3 sessions', 3, ['english', 'career'], ['pitching', 'email', 'cv', 'branding'], 1),
  // Design
  gde: C('Graphic Design Essentials', 'Type, color, layout, the foundations', 18, ['design'], ['typography', 'color', 'layout'], 1),
  canva: C('Mastering Canva', 'Professional visuals without a design degree', 16, ['design'], ['tools', 'layout'], 1),
  logo: C('Logo Design and Branding', 'Marks and identities that last', 16, ['design'], ['color', 'typography'], 2),
  ui: C('User Interface (UI) Design', 'Screens people enjoy using', 16, ['design'], ['layout', 'ux', 'tools'], 2),
  ux: C('User Experience (UX) Design', 'Research, flows and usability', 18, ['design'], ['ux'], 2),
  figma: C('Prototyping with Figma', 'Clickable prototypes from sketch to handoff', 16, ['design'], ['tools', 'ux'], 2),
  canvaai: C('Canva AI', 'Let Canva do the heavy lifting', 16, ['design'], ['tools'], 2),
  mj: C('Midjourney AI', 'Generate visuals that look designed', 16, ['design'], ['tools'], 2),
  // AI & Automation
  learnai: C('Learn AI!', 'The 8-session starting point', 8, ['ai'], ['ai', 'models', 'prompting', 'mlbasics'], 1),
  aimastery: C('AI Mastery', 'From curious to fluent with AI at work', 20, ['ai'], ['ai', 'models', 'prompting', 'agents'], 2),
  aisp: C('Artificial Intelligence (AI) for Specific Purposes', 'AI applied to your own job', 10, ['ai'], ['ai', 'models', 'prompting'], 1),
  mlc: C('Machine Learning Concepts', 'How models learn, without drowning in maths', 18, ['ai'], ['mlbasics'], 2),
  prompt: C('Prompt Engineering', 'Get usable output, every time', 16, ['ai'], ['ai', 'prompting'], 2),
  promptcc: C('Prompt Engineering Crash Course!', 'The essentials in 2 sessions', 2, ['ai'], ['ai', 'prompting'], 1),
  gpt: C('ChatGPT AI Mastery', 'ChatGPT as a daily colleague', 16, ['ai'], ['ai', 'models'], 1),
  claude: C('Claude AI', 'Long documents, contracts and code with Claude', 10, ['ai', 'tech'], ['ai', 'models'], 2),
  agentic: C('Agentic AI', 'AI that does the work, not just the talking', 5, ['ai'], ['ai', 'agents', 'automation'], 3),
  n8n: C('n8n Workflow Automation', 'Connect your apps, automate the boring part', 20, ['ai'], ['ai', 'automation', 'agents'], 2, true),
  make: C('Make Workflow Automation', 'Visual automations, no code', 20, ['ai'], ['automation'], 1),
  copilot: C('Microsoft Copilot Mastery', 'AI inside Word, Excel, Outlook and Teams', 20, ['ai'], ['ai', 'models'], 1, true),
  // Career & Interviews
  freelance: C('Freelance Fundamentals Crash Course!', 'Land your first clients, in 4 sessions', 4, ['career'], ['freelance'], 1),
  dft: C('The Digital Freelancing Toolkit', 'The tools to sell your skills online', 10, ['career'], ['freelance', 'branding'], 1),
  lead: C('Coaching for Leadership Development', 'From doing the work to leading it', 18, ['career'], ['interview', 'productivity'], 2, true),
  entre: C('Coaching for Entrepreneurs', 'From idea to a business that pays', 16, ['career'], ['freelance', 'branding'], 2),
  recruit: C('Recruitment and Talent Acquisition', 'Hire well, from both sides of the table', 16, ['career'], ['interview', 'cv'], 2, true),
  // Coding & Tech
  py: C('Python Programming', 'Your first real programming language', 18, ['tech'], ['python', 'logic'], 1),
  web: C('HTML, CSS, and JavaScript', 'Build and style your first web pages', 18, ['tech'], ['web'], 1),
  fullstack: C('Full-Stack Web Development', 'Front end, back end and the database', 20, ['tech'], ['web', 'cloud'], 2),
  java: C('Java Programming', 'Object-oriented programming, properly', 18, ['tech'], ['logic'], 1),
  node: C('Back-End Development with Node.js', 'APIs and servers in JavaScript', 18, ['tech'], ['web', 'cloud'], 2),
  dsa: C('Data Structures and Algorithms', 'Think like an engineer', 20, ['tech'], ['logic'], 3),
  cyber: C('Mastering Cybersecurity', 'Protect systems, people and data', 20, ['tech'], ['security'], 2),
  cloud: C('Mastering Cloud Computing', 'Servers, storage and scale in the cloud', 18, ['tech'], ['cloud'], 2),
  flutter: C('Developing Mobile Apps with Flutter', 'One codebase for iPhone and Android', 18, ['tech'], ['web'], 2),
} satisfies Record<string, Course>

type Key = keyof typeof COURSES

/** The AI course for each field, first choice then the alternative. */
const FIELD_AI: Record<Category, Key[]> = {
  marketing: ['ccae', 'geo'],
  pm: ['agentic', 'n8n'],
  business: ['agentic', 'excelai'],
  english: ['gpt', 'promptcc'],
  design: ['canvaai', 'mj'],
  ai: ['agentic', 'n8n'],
  career: ['gpt', 'promptcc'],
  tech: ['claude', 'agentic'],
}

/** Headline when nothing was lost on the topic questions. */
const NEXT_LEVEL: Record<Category, Key> = {
  marketing: 'dmm',
  pm: 'cpd',
  business: 'corpfin',
  english: 'spf',
  design: 'ux',
  ai: 'aimastery',
  career: 'lead',
  tech: 'fullstack',
}

const label = (s: string) => SKILL_LABELS[s] ?? s
const list = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`)

/** One course that fixes the biggest gaps, the field's AI course, and a team course when they asked for the team. */
export function recommend(cat: Category, analysis: Analysis, audience: 'me' | 'team'): Pick[] {
  const field = CATEGORIES.find((c) => c.id === cat)?.label ?? cat
  const lost = new Map(analysis.bySkill.map((s) => [s.skill, s.lost]))
  const anyLost = analysis.bySkill.some((s) => s.skill !== 'ai' && s.lost > 0)
  const picks: Pick[] = []

  const fieldCourses = Object.values(COURSES).filter((c) => c.cats.includes(cat))
  let fixer: Course | undefined
  if (anyLost) {
    const scored = fieldCourses
      .map((c) => {
        const covered = c.skills.filter((s) => s !== 'ai' && (lost.get(s) ?? 0) > 0)
        const points = covered.reduce((sum, s) => sum + (lost.get(s) ?? 0), 0)
        const levelFit = c.level === analysis.tier ? 1.5 : c.level === analysis.tier - 1 ? 0.5 : 0
        const teamFit = audience === 'team' && c.team ? 1 : 0
        /* the reward is a free demo, so a course nobody demos drops down the list */
        const demoFit = (DEMO_MENTORS_BY_COURSE[c.name]?.length ?? 0) > 0 ? 1 : -3
        return { c, covered, score: points * 2 + levelFit + teamFit + demoFit }
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
        ? `${missed} AI question${missed > 1 ? 's' : ''} went the wrong way. This is the one that pays back first in ${field}.`
        : 'You already see what AI can do. This is where you make it do the work.',
  })

  if (audience === 'team') {
    const teamCourse = fieldCourses.find((c) => c.team && !picks.some((p) => p.course === c)) ?? COURSES.copilot
    if (!picks.some((p) => p.course === teamCourse)) picks.push({ course: teamCourse, reason: 'Built for a team, which is what you asked for.' })
  }

  return picks.slice(0, 3)
}

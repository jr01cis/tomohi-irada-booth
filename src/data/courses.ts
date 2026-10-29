import type { Category } from '@/data/questions'

export interface Course {
  name: string
  blurb: string
  sessions: number
}

/** All names verified Active in the Tomohi Courses module on 2026-10-29. */
const C = (name: string, blurb: string, sessions: number): Course => ({ name, blurb, sessions })

export const COURSES = {
  // Marketing
  dmm: C('Digital Marketing Mastery', 'Strategy, funnels and channels, end to end', 20),
  sma: C('Social Media Advertising', 'Meta and TikTok ads that actually convert', 16),
  seo: C('Search Engine Optimization (SEO)', 'Rank on Google without paying for every click', 18),
  copy: C('Copywriting Essentials', 'Words that make people click, book and buy', 16),
  cms: C('Content Marketing Strategies', 'Plan content that builds an audience', 16),
  ccae: C('The Content Creator AI Engine', 'A month of content from one afternoon with AI', 10),
  geo: C('Generative Engine Optimization (GEO)', 'Get ChatGPT and Perplexity to recommend you', 10),
  // Project management
  epm: C('Effective Project Management', 'Scope, plan, deliver, without the chaos', 18),
  cpd: C('CPD Certified - Effective Project Management Essentials', 'Certified PM essentials in 10 sessions', 10),
  teams: C('Building High-Performance Teams', 'Lead people who deliver', 16),
  time: C('Mastering Time Management', 'Own your calendar, ship on time', 16),
  events: C('Successful Event Management', 'Run events that run on time and on budget', 18),
  // Business
  nego: C('Negotiation Skills Crash Course', 'Anchor, trade, close, in 3 sessions', 3),
  sales: C('Sales Fundamentals & Communication Skills', 'Discovery, objections, closing', 20),
  fin: C('Financial Accounting Basics', 'Read a P&L and a cash-flow without fear', 18),
  corpfin: C('Introduction to Corporate Finance', 'Budgets, valuation, decisions', 16),
  growth: C('Small Business Growth Strategies', 'From surviving to scaling', 18),
  hr: C('Human Resources Essentials Crash Course!', 'Hiring, onboarding, reviews, in 3 sessions', 3),
  perf: C('Performance Management & Employee Development', 'Reviews that develop people', 16),
  speak: C('Public Speaking Crash Course!', 'Stand up and own the room', 3),
  // Business English
  bec: C('Business English Communication', 'Emails, calls and meetings that sound professional', 18),
  ewm: C('English Writing Mastery', 'Clear, correct, confident writing', 18),
  spf: C('Speaking & Pronunciation Fluency', 'Speak up without hesitating', 18),
  egm: C('English Grammar Mastery', 'Fix the mistakes you keep making', 18),
  cv: C('CV Writing and Personal Branding Crash Course!', 'A CV that gets the interview, in 3 sessions', 3),
  // Design
  gde: C('Graphic Design Essentials', 'Type, color, layout, the foundations', 18),
  canva: C('Mastering Canva', 'Professional visuals without a design degree', 16),
  canvaai: C('Canva AI', 'Let Canva do the heavy lifting', 16),
  logo: C('Logo Design and Branding', 'Marks and identities that last', 16),
  ui: C('User Interface (UI) Design', 'Screens people enjoy using', 16),
  ux: C('User Experience (UX) Design', 'Research, flows and usability', 18),
  figma: C('Prototyping with Figma', 'Clickable prototypes from sketch to handoff', 16),
  mj: C('Midjourney AI', 'Generate visuals that look designed', 16),
  // AI
  learnai: C('Learn AI!', 'The 8-session starting point', 8),
  agentic: C('Agentic AI', 'AI that does the work, not just the talking', 5),
  prompt: C('Prompt Engineering', 'Get usable output, every time', 16),
  promptcc: C('Prompt Engineering Crash Course!', 'The essentials in 2 sessions', 2),
  gpt: C('ChatGPT AI Mastery', 'ChatGPT as a daily colleague', 16),
  n8n: C('n8n Workflow Automation', 'Connect your apps, automate the boring part', 20),
  copilot: C('Microsoft Copilot Mastery', 'AI inside Word, Excel, Outlook and Teams', 20),
  excelai: C('Excel AI', 'Spreadsheets that answer questions', 16),
  claude: C('Claude AI', 'Long documents, contracts and analysis with Claude', 10),
} satisfies Record<string, Course>

type Key = keyof typeof COURSES

/** Weak skill -> the course to fix it. First entry is the headline recommendation. */
export const SKILL_TO_COURSES: Record<Category, Record<string, Key[]>> = {
  marketing: {
    strategy: ['dmm', 'cms'],
    content: ['cms', 'copy', 'ccae'],
    paid: ['sma', 'dmm'],
    seo: ['seo', 'geo'],
    analytics: ['dmm', 'excelai'],
    ai: ['ccae', 'geo', 'prompt'],
  },
  pm: {
    scope: ['epm', 'cpd'],
    risk: ['epm', 'cpd'],
    agile: ['epm', 'cpd'],
    stakeholders: ['teams', 'epm'],
    time: ['time', 'epm'],
    ai: ['agentic', 'n8n', 'promptcc'],
  },
  business: {
    finance: ['fin', 'corpfin'],
    sales: ['sales', 'nego'],
    negotiation: ['nego', 'sales'],
    hr: ['hr', 'perf'],
    strategy: ['growth', 'speak'],
    ai: ['agentic', 'claude', 'excelai'],
  },
  english: {
    email: ['bec', 'ewm'],
    meetings: ['bec', 'spf'],
    vocabulary: ['bec', 'egm'],
    grammar: ['egm', 'ewm'],
    pitching: ['spf', 'speak'],
    ai: ['gpt', 'promptcc', 'cv'],
  },
  design: {
    typography: ['gde', 'canva'],
    color: ['gde', 'logo'],
    layout: ['gde', 'ui'],
    ux: ['ux', 'figma'],
    tools: ['canva', 'figma'],
    ai: ['canvaai', 'mj', 'learnai'],
  },
}

/** Headline course when the player aced everything in a category. */
export const NEXT_LEVEL: Record<Category, Key[]> = {
  marketing: ['geo', 'ccae'],
  pm: ['agentic', 'cpd'],
  business: ['claude', 'growth'],
  english: ['spf', 'gpt'],
  design: ['mj', 'canvaai'],
}

export function recommend(cat: Category, weakSkills: string[]): Course[] {
  const keys: Key[] = []
  for (const skill of weakSkills) {
    for (const k of SKILL_TO_COURSES[cat][skill] ?? []) {
      if (!keys.includes(k)) keys.push(k)
    }
  }
  if (keys.length === 0) keys.push(...NEXT_LEVEL[cat])
  return keys.slice(0, 3).map((k) => COURSES[k])
}

export type Category = 'marketing' | 'pm' | 'business' | 'english' | 'design' | 'ai' | 'career' | 'tech'
export type QKind = 'mcq' | 'number'

export interface Question {
  id: string
  cat: Category
  skill: string
  /** 1 warm-up, 2 core, 3 pro. Also the points the question is worth. */
  level: 1 | 2 | 3
  kind: QKind
  q: string
  /** mcq only; shuffled at runtime */
  options?: [string, string, string, string]
  /** mcq: index into options. number: the value to type. */
  answer: number
  unit?: string
  tolerance?: number
  /** AI questions only: shown for a beat after answering */
  reveal?: string
}

export const CATEGORIES: { id: Category; label: string; tagline: string; emoji: string }[] = [
  { id: 'marketing', label: 'Marketing', tagline: 'Ads, content, SEO, analytics', emoji: '📣' },
  { id: 'pm', label: 'Project Management', tagline: 'Scope, risk, agile, people', emoji: '🗂️' },
  { id: 'business', label: 'Business', tagline: 'Finance, sales, negotiation, HR', emoji: '📈' },
  { id: 'english', label: 'Business English', tagline: 'Email, meetings, pitching', emoji: '💬' },
  { id: 'design', label: 'Design', tagline: 'Type, color, layout, UX', emoji: '🎨' },
  { id: 'ai', label: 'AI & Automation', tagline: 'Prompts, agents, automation', emoji: '🤖' },
  { id: 'career', label: 'Career & Interviews', tagline: 'CVs, interviews, freelancing', emoji: '🎯' },
  { id: 'tech', label: 'Coding & Tech', tagline: 'Code, web, security, cloud', emoji: '💻' },
]

export const SKILL_LABELS: Record<string, string> = {
  strategy: 'Strategy',
  content: 'Content',
  paid: 'Paid ads',
  seo: 'SEO',
  analytics: 'Analytics',
  scope: 'Scope',
  risk: 'Risk',
  agile: 'Agile',
  stakeholders: 'Stakeholders',
  time: 'Planning',
  finance: 'Finance',
  sales: 'Sales',
  negotiation: 'Negotiation',
  hr: 'People & HR',
  email: 'Email writing',
  meetings: 'Meetings',
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  pitching: 'Pitching',
  typography: 'Typography',
  color: 'Color',
  layout: 'Layout',
  ux: 'UX',
  tools: 'Tools',
  ai: 'AI at work',
  prompting: 'Prompting',
  models: 'Models & tools',
  automation: 'Automation',
  agents: 'Agents',
  mlbasics: 'How AI works',
  cv: 'CV',
  interview: 'Interviews',
  branding: 'Personal brand',
  productivity: 'Productivity',
  freelance: 'Freelancing',
  web: 'Web',
  python: 'Python',
  logic: 'Logic & data',
  security: 'Security',
  cloud: 'Cloud & networks',
}

const M = (
  id: string,
  cat: Category,
  skill: string,
  level: 1 | 2 | 3,
  q: string,
  options: [string, string, string, string],
  reveal?: string,
): Question => ({ id, cat, skill, level, kind: 'mcq', q, options, answer: 0, reveal })

const N = (id: string, cat: Category, skill: string, q: string, answer: number, unit?: string, tolerance?: number): Question => ({
  id,
  cat,
  skill,
  level: 3,
  kind: 'number',
  q,
  answer,
  unit,
  tolerance,
})

/** The first option is always the right one; the engine shuffles. */
export const QUESTIONS: Question[] = [
  // Marketing: warm-up
  M('mk01', 'marketing', 'strategy', 1, 'A "lead" is…', ['Someone who shared their details and showed interest', 'A paying customer', 'Anyone who saw your ad', 'A returning visitor']),
  M('mk02', 'marketing', 'content', 1, 'A call to action is…', ['The line that tells the reader the next step', 'The headline of the ad', 'The brand slogan', 'The legal disclaimer']),
  M('mk03', 'marketing', 'paid', 1, 'CPC stands for…', ['Cost per click', 'Cost per conversion', 'Clicks per campaign', 'Cost per customer']),
  M('mk04', 'marketing', 'analytics', 1, 'Bounce rate measures…', ['Visitors who leave after one page', 'Emails that were not delivered', 'Ads rejected by the platform', 'Customers who ask for a refund']),
  // Marketing: core
  M('mk05', 'marketing', 'analytics', 2, 'CTR is…', ['Clicks divided by impressions', 'Clicks divided by conversions', 'Impressions divided by reach', 'Conversions divided by visits']),
  M('mk06', 'marketing', 'strategy', 2, 'The 4 Ps: Product, Price, Place and…', ['Promotion', 'People', 'Positioning', 'Process']),
  M('mk07', 'marketing', 'content', 2, 'Which format reaches the most new accounts on Instagram today?', ['Reels', 'Carousels', 'Stories', 'Single images']),
  M('mk08', 'marketing', 'seo', 2, 'Which signal matters most for ranking on Google?', ['Links and mentions from trusted sites', 'Keyword density', 'Page word count', 'The meta keywords tag']),
  M('mk09', 'marketing', 'paid', 2, 'A lookalike audience is built from…', ["Your existing customers' traits", 'People who searched your brand', "Your competitors' followers", 'Random users in your city']),
  // Marketing: pro
  M('mk10', 'marketing', 'paid', 3, 'High CTR, no sales. First suspect?', ['The landing page', 'The ad creative', 'The bid strategy', 'The audience size']),
  M('mk11', 'marketing', 'analytics', 3, 'CAC rising while LTV stays flat means…', ['Growth is getting more expensive', 'Customers churn faster', 'Revenue per customer is rising', 'The product is underpriced']),
  M('mk12', 'marketing', 'seo', 3, 'A page ranks first but gets few clicks. Most likely fix?', ['Rewrite the title and description', 'Add more keywords to the page', 'Buy backlinks', 'Shorten the page']),
  M('mk13', 'marketing', 'strategy', 3, 'Your best channel is saturating. The right move?', ['Test the next channel with a small budget', 'Double the budget on the same channel', 'Pause all spend for a month', 'Lower prices across the board']),
  // Marketing: numeric
  N('mkn1', 'marketing', 'analytics', '1,000 visits, 50 sign-ups. Conversion rate?', 5, '%'),
  N('mkn2', 'marketing', 'paid', 'CPC $0.40, 500 clicks. Total spend?', 200, '$'),
  N('mkn3', 'marketing', 'paid', '$3,000 revenue from $1,200 of ads. ROAS?', 2.5, 'x', 0.01),
  N('mkn4', 'marketing', 'analytics', 'CAC $40, LTV $200. LTV to CAC ratio?', 5, 'x', 0.01),
  // Marketing: AI
  M('mka1', 'marketing', 'ai', 2, 'Which of these can AI do today in under 5 minutes?', ['All three', 'Write 30 ad variations only', 'Draft a month of content only', 'Summarize 500 reviews only'],
    'All three. One prompt, 30 ad variations scored by hook strength. That is week one of The Content Creator AI Engine.'),
  M('mka2', 'marketing', 'ai', 2, 'GEO stands for…', ['Generative Engine Optimization', 'Google Engine Optimization', 'Geographic Email Outreach', 'Growth Experiment Output'],
    'GEO is how you get ChatGPT and Perplexity to recommend your brand when people ask. Tomohi has a course on exactly that.'),
  M('mka3', 'marketing', 'ai', 2, 'Can AI build a customer persona from your Instagram comments?', ['Yes, in minutes', 'Only with 10,000+ comments', 'No, it needs surveys', 'Only for verified accounts'],
    'Paste the comments, ask for patterns, get a persona with objections and buying triggers. Prompt Engineering, week two.'),
  M('mka4', 'marketing', 'ai', 3, 'An "AI agent" in marketing is…', ['Software that plans and runs multi-step tasks on its own', 'A chatbot that answers FAQs', 'A scheduled post', 'An ad format'],
    'An agent can watch your ad spend, pause the losers and write the report before you wake up. Agentic AI course.'),
  M('mka5', 'marketing', 'ai', 1, 'One prompt can turn a blog post into…', ['10 platform-ready social posts in your voice', 'A single tweet', 'Only a summary', 'Nothing without a designer'],
    'One post in, ten platform-ready versions out, in your voice. ChatGPT AI Mastery.'),

  // Project management: warm-up
  M('pm01', 'pm', 'scope', 1, '"Scope creep" is…', ['Work growing without approval or budget', 'A project finishing early', 'Cutting features to hit a date', 'An approved change request']),
  M('pm02', 'pm', 'time', 1, 'A Gantt chart shows…', ['Tasks against time', 'Costs against budget', 'Risks against impact', 'People against roles']),
  M('pm03', 'pm', 'agile', 1, 'A sprint usually lasts…', ['1 to 4 weeks', '1 day', '2 to 3 months', 'One quarter']),
  M('pm04', 'pm', 'stakeholders', 1, 'A stakeholder is…', ['Anyone affected by or influencing the project', 'Only the client', 'Only the sponsor', 'Only the delivery team']),
  // Project management: core
  M('pm05', 'pm', 'risk', 2, 'The best time to identify risks is…', ['At the start, then continuously', 'At the kickoff only', 'When the first one hits', 'At the final review']),
  M('pm06', 'pm', 'scope', 2, 'The triple constraint: scope, time and…', ['Cost', 'Quality', 'Risk', 'Resources']),
  M('pm07', 'pm', 'agile', 2, 'Who owns the product backlog in Scrum?', ['The Product Owner', 'The Scrum Master', 'The developers', 'The sponsor']),
  M('pm08', 'pm', 'time', 2, 'A milestone is…', ['A zero-duration checkpoint', 'The longest task', 'The weekly status meeting', 'A budget line']),
  M('pm09', 'pm', 'stakeholders', 2, 'A daily stand-up should last about…', ['15 minutes', '5 minutes', '45 minutes', 'As long as it takes']),
  // Project management: pro
  M('pm10', 'pm', 'risk', 3, 'A high-impact, very unlikely risk should be…', ['Monitored with a contingency plan', 'Escalated to the sponsor today', 'Given a full-time owner', 'Removed from the register']),
  M('pm11', 'pm', 'time', 3, 'The critical path is…', ['The longest chain of dependent tasks', 'The riskiest task sequence', 'The most expensive work package', "The client's priority list"]),
  M('pm12', 'pm', 'stakeholders', 3, 'High power, low interest stakeholder: keep them…', ['Satisfied with light-touch updates', 'Managed closely every day', 'Informed only at the end', 'Out of the loop']),
  M('pm13', 'pm', 'agile', 3, 'Velocity drops two sprints in a row. First thing to check?', ['Interruptions and unplanned work', 'Team salaries', 'The tool licence', 'The sprint length']),
  // Project management: numeric
  N('pmn1', 'pm', 'time', 'Task A 3 days, then B 4 days. C takes 2 days beside B. Project length?', 7, 'days'),
  N('pmn2', 'pm', 'agile', 'Backlog 150 points, velocity 30 per sprint. Sprints needed?', 5, 'sprints'),
  N('pmn3', 'pm', 'risk', 'Risk probability 20%, impact $10,000. Expected cost?', 2000, '$'),
  N('pmn4', 'pm', 'time', 'Task B has 2 days of float and slips 3. The end date moves by?', 1, 'day'),
  // Project management: AI
  M('pma1', 'pm', 'ai', 2, 'Can AI turn a 2-hour meeting recording into tasks with owners and deadlines?', ['Yes, in a few minutes', 'Only with a human note-taker', 'Only in English', 'No'],
    'Record, transcribe, extract the actions, push them to Jira. Fully automatic. Agentic AI course.'),
  M('pma2', 'pm', 'ai', 2, 'From a one-page brief, AI can draft…', ['A WBS, estimates and a risk list', 'Only the risk list', 'Only a timeline', 'Nothing usable yet'],
    'One brief in, a full starting plan out in two minutes. You refine instead of starting from zero. Effective Project Management, AI module.'),
  M('pma3', 'pm', 'ai', 1, 'n8n is…', ['A tool that connects apps and automates work, no code', 'A Gantt template', 'A project methodology', 'A CRM'],
    'Connect Jira, WhatsApp, Sheets and AI in one flow. Tomohi runs on it. n8n Workflow Automation course.'),
  M('pma4', 'pm', 'ai', 2, 'Can AI write your weekly status report from Jira automatically?', ['Yes', 'Only with Microsoft Project', 'Only for small teams', 'No'],
    'Every Friday at 5 pm the report writes itself and lands in the sponsor inbox. Workflow Automation.'),
  M('pma5', 'pm', 'ai', 1, 'The best way to brief an AI assistant is…', ['Role, context, task, format', 'One short sentence', 'Keywords only', 'Every detail, in any order'],
    'Four lines and the output goes from generic to usable. Prompt Engineering Crash Course.'),

  // Business: warm-up
  M('bz01', 'business', 'finance', 1, 'Revenue minus costs equals…', ['Profit', 'Cash', 'Equity', 'Margin rate']),
  M('bz02', 'business', 'sales', 1, 'A "cold call" is…', ['Contact with someone who has not shown interest yet', 'A call to an unhappy customer', 'A follow-up after a demo', 'A call from a referral']),
  M('bz03', 'business', 'strategy', 1, 'SWOT: strengths, weaknesses, opportunities and…', ['Threats', 'Targets', 'Trends', 'Tactics']),
  M('bz04', 'business', 'hr', 1, 'Onboarding is…', ['Integrating a new hire', 'A salary review', 'Exit paperwork', 'Annual training']),
  // Business: core
  M('bz05', 'business', 'negotiation', 2, 'BATNA is…', ['Your best alternative if the deal fails', 'Your opening offer', "The buyer's maximum price", 'A standard legal clause']),
  M('bz06', 'business', 'finance', 2, 'A profitable company can still fail because of…', ['Cash flow', 'Too many customers', 'High margins', 'Low debt']),
  M('bz07', 'business', 'sales', 2, 'The most important part of a discovery call is…', ['Asking questions and listening', 'Presenting the features', 'Giving the price early', 'Sending the brochure after']),
  M('bz08', 'business', 'strategy', 2, 'A unique value proposition answers…', ['Why customers should choose you', 'How much you pay staff', 'Where you sell', 'Who funds you']),
  M('bz09', 'business', 'hr', 2, 'The main purpose of a performance review is…', ['Development and alignment', 'Deciding bonuses', 'Documenting mistakes', 'Meeting a legal requirement']),
  // Business: pro
  M('bz10', 'business', 'negotiation', 3, 'Making the first offer…', ['Can anchor the discussion in your favor', 'Always weakens your position', 'Is only for buyers', 'Ends the negotiation early']),
  M('bz11', 'business', 'sales', 3, 'A prospect says "send me a proposal" after 5 minutes. Best move?', ['Ask what they need to see in it before writing', 'Send the standard one today', 'Offer a discount to close faster', 'End the call politely']),
  M('bz12', 'business', 'strategy', 3, 'One client is 60% of your revenue. Priority?', ['Diversify the client base', 'Raise their price', 'Reduce service to the others', 'Hire more people for that client']),
  M('bz13', 'business', 'hr', 3, 'Your best employee asks for a raise you cannot give. First move?', ['Ask what else matters to them and set a review date', 'Say no and move on', 'Promise a raise next year', 'Offer extra vacation instead']),
  // Business: numeric
  N('bzn1', 'business', 'finance', 'Price 50, cost 30. Gross margin?', 40, '%'),
  N('bzn2', 'business', 'finance', 'Fixed costs 6,000, contribution 15 per unit. Break-even units?', 400, 'units'),
  N('bzn3', 'business', 'sales', '20 calls a day, 25% answer, 1 in 5 answered books a demo. Demos per day?', 1, 'demos'),
  N('bzn4', 'business', 'finance', 'Revenue 10,000, costs 7,500. Profit?', 2500, '$'),
  // Business: AI
  M('bza1', 'business', 'ai', 2, 'Can AI read a 40-page contract and flag the risky clauses?', ['Yes, in a couple of minutes', 'Only for lawyers', 'Only in English', 'No'],
    'Upload it, ask for risks ranked by severity, get a table. Then review with your lawyer in a fraction of the time. Claude AI course.'),
  M('bza2', 'business', 'ai', 2, 'With your Excel sales sheet, AI can…', ['Find the trend, forecast next quarter and draft the summary email', 'Only sort the rows', 'Only make charts', 'Nothing without a developer'],
    'Your spreadsheet starts answering questions. Excel AI course.'),
  M('bza3', 'business', 'ai', 2, 'An AI agent can qualify a WhatsApp lead and book the meeting for you.', ['True', 'Only on weekdays', 'Only with a human approving each step', 'False'],
    "Tomohi's own leads are qualified by an AI agent on WhatsApp, 24/7. Agentic AI course."),
  M('bza4', 'business', 'ai', 1, 'Can AI draft a full business plan from a 10-line idea?', ['Yes, a solid first draft', 'Only the executive summary', 'Only if you provide the financials', 'No'],
    'Draft in 10 minutes, then your judgement makes it real. Small Business Growth Strategies, AI module.'),
  M('bza5', 'business', 'ai', 1, '"Prompt engineering" is…', ['Writing instructions so AI gives useful results', 'Building prompts for engineers', 'A programming language', 'Training a model'],
    'The skill that decides whether AI saves you 10 hours a week or wastes 10 minutes. Prompt Engineering.'),

  // Business English: warm-up
  M('en01', 'english', 'email', 1, 'Best opening for a formal email to someone you know by name:', ['Dear Mr. Khalil,', 'Hi Khalil!', 'Hello there,', 'To whom it may concern,']),
  M('en02', 'english', 'vocabulary', 1, '"Deadline" means…', ['The latest time something must be done', 'The start of a project', 'A line in a contract', 'A strict manager']),
  M('en03', 'english', 'grammar', 1, 'Choose the correct sentence:', ["She doesn't work here.", "She don't work here.", "She doesn't works here.", 'She not works here.']),
  M('en04', 'english', 'meetings', 1, 'The polite way to interrupt in a meeting:', ['Sorry to interrupt, may I add something?', "Wait, that's wrong.", 'Let me speak now.', 'Excuse me, you are mistaken.']),
  // Business English: core
  M('en05', 'english', 'vocabulary', 2, '"To follow up" means…', ['To check on something after a first contact', 'To agree with someone', 'To finish a task', 'To delegate a task']),
  M('en06', 'english', 'email', 2, 'Most appropriate closing for a business email:', ['Kind regards,', 'Yours lovingly,', 'Cheers mate,', 'Best of luck,']),
  M('en07', 'english', 'pitching', 2, 'An "elevator pitch" is…', ['A 30-second summary of your idea', 'A pitch to investors in a lift', 'A sales brochure', 'A product demo']),
  M('en08', 'english', 'grammar', 2, 'Choose the correct sentence:', ['We met him yesterday.', 'We have met him yesterday.', 'We meet him yesterday.', 'We were met him yesterday.']),
  M('en09', 'english', 'meetings', 2, '"Let\'s table this" in an American meeting means…', ['Postpone it', 'Decide it now', 'Approve it', 'Take it to the board']),
  // Business English: pro
  M('en10', 'english', 'pitching', 3, 'The strongest way to open a presentation:', ['A surprising fact or question', 'Your name and title', 'An apology for the time', 'The agenda slide']),
  M('en11', 'english', 'email', 3, 'A client declined your offer. Best reply opener:', ['Thank you for letting me know. May I ask what tipped the decision?', 'That is disappointing to hear.', 'We can lower the price if that helps.', 'Noted.']),
  M('en12', 'english', 'vocabulary', 3, '"We need to circle back on this" means…', ['Return to it later', 'Cancel it', 'Approve it', 'Escalate it']),
  M('en13', 'english', 'grammar', 3, 'Which is correct?', ['The report, which took two weeks, is ready.', 'The report which took two weeks, is ready.', 'The report, that took two weeks, is ready.', 'The report, took two weeks, is ready.']),
  // Business English: numeric
  N('enn1', 'english', 'vocabulary', '"A fortnight" is how many days?', 14, 'days'),
  N('enn2', 'english', 'vocabulary', '"Net 30" on an invoice means payment within how many days?', 30, 'days'),
  N('enn3', 'english', 'vocabulary', '"A dozen" is how many?', 12),
  N('enn4', 'english', 'vocabulary', '"Half past three" is how many minutes past the hour?', 30, 'min'),
  // Business English: AI
  M('ena1', 'english', 'ai', 1, 'Can AI turn rough Arabic notes into a polished English email?', ['Yes, in seconds', 'Only short notes', 'Only with a translator', 'No'],
    'Notes in, a professional email out, tone adjusted to the reader. Business English Communication, AI module.'),
  M('ena2', 'english', 'ai', 2, 'For your English, AI can…', ['Correct grammar, explain the error and run a mock interview out loud', 'Only correct spelling', 'Only translate', 'Nothing without a teacher'],
    'Practice an interview with an AI that pushes back, then get feedback. Speaking & Pronunciation Fluency.'),
  M('ena3', 'english', 'ai', 2, 'AI can rehearse a sales call with you, playing a difficult client.', ['True', 'Only by text', 'Only in English', 'False'],
    'Voice mode, a tough client, five rounds. You walk into the real call warmed up.'),
  M('ena4', 'english', 'ai', 1, '"Rewrite this in a formal tone" makes AI…', ['Change the style and keep the meaning', 'Translate it', 'Shorten it to one line', 'Correct only the spelling'],
    'Casual to formal, long to short, English to French: style is now one instruction. Prompt Engineering.'),
  M('ena5', 'english', 'ai', 2, 'Can AI check whether your CV matches a job description?', ['Yes, and list the missing keywords', 'Only on LinkedIn', 'Only for tech jobs', 'No'],
    'Paste both, get a match score and the missing keywords. CV Writing and Personal Branding Crash Course.'),

  // Design: warm-up
  M('ds01', 'design', 'typography', 1, 'A clean layout usually uses how many typefaces?', ['One or two', 'Three or four', 'Five', 'One per section']),
  M('ds02', 'design', 'color', 1, 'Complementary colors sit…', ['Opposite each other on the color wheel', 'Next to each other on the wheel', 'In the same hue family', 'At the same brightness']),
  M('ds03', 'design', 'layout', 1, '"White space" is…', ['Empty space that lets the design breathe', 'Wasted space to fill', 'Only the margins of a print', 'A white background']),
  M('ds04', 'design', 'ux', 1, 'UX stands for…', ['User experience', 'User exchange', 'Unified experience', 'User execution']),
  // Design: core
  M('ds05', 'design', 'tools', 2, 'Built for UI design and prototyping:', ['Figma', 'Illustrator', 'Canva', 'PowerPoint']),
  M('ds06', 'design', 'typography', 2, 'A serif font has…', ['Small strokes at the ends of letters', 'Equal stroke width everywhere', 'Only capital letters', 'Rounded terminals']),
  M('ds07', 'design', 'color', 2, 'Most used in branding for trust and calm:', ['Blue', 'Red', 'Yellow', 'Purple']),
  M('ds08', 'design', 'layout', 2, 'Visual hierarchy means…', ['Guiding the eye to what matters first', 'Equal weight for every element', 'Using one color only', 'Aligning everything to the left']),
  M('ds09', 'design', 'ux', 2, 'A good call-to-action button is…', ['Clear, visible and action-worded', 'Subtle so it does not distract', 'The same color as the background', 'Placed below the fold']),
  // Design: pro
  M('ds10', 'design', 'tools', 3, 'Keeps a logo sharp at any size:', ['SVG', 'PNG', 'JPG', 'GIF']),
  M('ds11', 'design', 'ux', 3, 'Users keep missing the Save button. First thing to test?', ['Its contrast, size and position', 'A new icon', 'A longer label', 'A tooltip']),
  M('ds12', 'design', 'typography', 3, 'Body text at 14px, light grey on white. What fails first?', ['Contrast', 'Alignment', 'Kerning', 'Line height']),
  M('ds13', 'design', 'layout', 3, 'A 12-column grid is popular because…', ['It divides evenly into 2, 3, 4 and 6', 'It is what Bootstrap chose', 'It fits any logo', 'It hides alignment errors']),
  // Design: numeric
  N('dsn1', 'design', 'ux', 'WCAG AA minimum contrast ratio for body text?', 4.5, ':1', 0.01),
  N('dsn2', 'design', 'typography', 'Type scale base 16px, ratio 1.25. Next size?', 20, 'px'),
  N('dsn3', 'design', 'tools', 'A 1920px wide design exported at 2x is how wide?', 3840, 'px'),
  N('dsn4', 'design', 'layout', 'A4 paper width?', 210, 'mm'),
  // Design: AI
  M('dsa1', 'design', 'ai', 1, 'Can AI create 10 logo concepts from a text description?', ['Yes, in minutes', 'Only rough sketches', 'Only with reference images', 'No'],
    'Midjourney for the concepts, a designer refines the winner. Logo Design and Branding.'),
  M('dsa2', 'design', 'ai', 2, 'Inside Canva today, AI can…', ['Remove backgrounds, write the copy and resize to 20 formats', 'Only remove backgrounds', 'Only suggest fonts', 'Nothing without the Pro plan'],
    'One design, every platform size, one click. Canva AI course.'),
  M('dsa3', 'design', 'ai', 2, 'AI can turn a hand-drawn sketch into a clickable app prototype.', ['True', 'Only with Figma Pro', 'Only in black and white', 'False'],
    'Photo of a napkin sketch in, a working prototype out. Prototyping with Figma, AI module.'),
  M('dsa4', 'design', 'ai', 1, 'Can AI generate a full brand palette from one photo?', ['Yes, with hex codes and usage rules', 'Only two colors', 'Only in Photoshop', 'No'],
    'Upload the photo, ask for a palette with hex codes and usage rules. Graphic Design Essentials.'),
  M('dsa5', 'design', 'ai', 2, '"Generative fill" does what?', ['Extends or replaces parts of an image with AI', 'Fills a form automatically', 'Fills a shape with a color', 'Changes the font'],
    'Extend a photo, remove a person, change the sky. Photo Editing using Photoshop.'),

  // AI & Automation: warm-up
  M('ai01', 'ai', 'models', 1, 'ChatGPT, Claude and Gemini are…', ['Large language models', 'Search engines', 'Social networks', 'Operating systems']),
  M('ai02', 'ai', 'prompting', 1, 'A "prompt" is…', ['The instruction you give the AI', "The AI's answer", 'A paid plan', 'A type of chatbot']),
  M('ai03', 'ai', 'automation', 1, 'n8n, Make and Zapier are tools to…', ['Connect apps and automate tasks', 'Design logos', 'Edit videos', 'Host websites']),
  M('ai04', 'ai', 'mlbasics', 1, 'An AI "hallucination" is…', ['A confident answer that is wrong or made up', 'A slow response', 'A refused request', 'A generated image']),
  // AI & Automation: core
  M('ai05', 'ai', 'prompting', 2, 'Best way to get a specific format from AI?', ['Show an example of the output you want', 'Ask the same thing twice', 'Write in capital letters', 'Use as few words as possible']),
  M('ai06', 'ai', 'models', 2, 'Which task needs an image model, not a text model?', ['A product photo from a description', 'Summarizing a contract', 'Writing an email', 'Translating a menu']),
  M('ai07', 'ai', 'mlbasics', 2, 'AI models learn mainly from…', ['Large amounts of example data', 'Rules typed one by one by programmers', 'Live browsing only', 'Their users\' passwords']),
  M('ai08', 'ai', 'automation', 2, 'In an automation, a "trigger" is…', ['The event that starts the workflow', 'The last step', 'An error message', 'The monthly bill']),
  M('ai09', 'ai', 'agents', 2, 'An AI agent differs from a chatbot because it…', ['Takes actions with tools, step by step', 'Speaks with a voice', 'Is always free', 'Only answers yes or no']),
  // AI & Automation: pro
  M('ai10', 'ai', 'mlbasics', 3, 'Why can the same prompt give two different answers?', ['The model samples words with some randomness', 'The internet changed in between', 'It remembers other users', 'It is a bug']),
  M('ai11', 'ai', 'prompting', 3, 'Your AI keeps inventing facts about your company. Best fix?', ['Give it your documents and tell it to answer only from them', 'Ask it to try harder', 'Use a shorter prompt', 'Switch to another language']),
  M('ai12', 'ai', 'agents', 3, 'Before letting an agent send emails for you, you should…', ['Approve each send yourself at first', 'Share your password with it', 'Let it run alone from day one', 'Turn off its logs']),
  M('ai13', 'ai', 'automation', 3, 'A workflow fails silently every night. What was missing?', ['An error alert', 'A faster server', 'More triggers', 'A bigger AI model']),
  // AI & Automation: numeric
  N('ain1', 'ai', 'automation', 'A task takes 15 min, 4 times a day. Hours saved per 5-day week if automated?', 5, 'hours'),
  N('ain2', 'ai', 'models', 'One AI reply costs $0.002. Cost of 1,000 replies?', 2, '$'),
  N('ain3', 'ai', 'automation', 'A workflow runs every 15 minutes. Runs per day?', 96, 'runs'),
  N('ain4', 'ai', 'mlbasics', 'A model gets 90 of 100 test questions right. Accuracy?', 90, '%'),
  // AI & Automation: AI reveals
  M('aia1', 'ai', 'ai', 2, 'Can AI build a working web app from a plain-English description?', ['Yes, a working first version in minutes', 'Only a mock-up image', 'Only with a developer typing', 'No'],
    'Describe it, get a working app, then improve it in plain English. Claude AI course.'),
  M('aia2', 'ai', 'ai', 1, 'AI can turn a voice note into a to-do list.', ['True', 'Only in English', 'Only for notes under a minute', 'False'],
    'Voice note in, tasks out, straight into your calendar. Agentic AI course.'),
  M('aia3', 'ai', 'ai', 2, "Can AI answer questions using only your company's own documents?", ['Yes, and cite the page it used', 'Only with a custom-built model', 'Only for large companies', 'No'],
    'Upload the handbook, ask anything, get answers with the page they came from. AI Mastery.'),
  M('aia4', 'ai', 'ai', 2, 'An n8n workflow can read new emails, sort them and draft replies with AI.', ['True', 'Only for Gmail', 'Only with code', 'False'],
    "Tomohi's own inbox runs on flows like this. n8n Workflow Automation."),
  M('aia5', 'ai', 'ai', 3, 'Can AI agents work as a team, one researching while another writes?', ['Yes, multi-agent setups do exactly that', 'Only in research labs', 'Only one agent can run at a time', 'No'],
    'One agent researches, one writes, one checks. Agentic AI course.'),

  // Career & Interviews: warm-up
  M('ca01', 'career', 'cv', 1, 'A CV for a job application should usually be…', ['One to two pages', 'Five pages or more', 'Half a page', 'As long as possible']),
  M('ca02', 'career', 'interview', 1, '"Tell me about yourself" is best answered with…', ['A short story linking your experience to the job', 'Your full life story', 'Your hobbies only', 'A list of your weaknesses']),
  M('ca03', 'career', 'branding', 1, 'Your LinkedIn headline should…', ['Say what you do and for whom', 'Show only your job title', 'Stay empty', 'List every past employer']),
  M('ca04', 'career', 'productivity', 1, 'Time-blocking means…', ['Reserving calendar slots for specific work', 'Blocking people on social media', 'Working without breaks', 'Arriving early every day']),
  // Career & Interviews: core
  M('ca05', 'career', 'interview', 2, 'The STAR method stands for…', ['Situation, Task, Action, Result', 'Skills, Talent, Ambition, Results', 'Start, Try, Adapt, Repeat', 'Strategy, Team, Action, Review']),
  M('ca06', 'career', 'cv', 2, 'An ATS is…', ['Software that screens CVs before a human sees them', 'A type of job contract', 'A cover letter template', 'A salary scale']),
  M('ca07', 'career', 'freelance', 2, 'Your first freelance price should be based on…', ['The value to the client and market rates', 'Whatever the client offers', 'The lowest price online', 'Your old salary divided by 30']),
  M('ca08', 'career', 'productivity', 2, 'The Eisenhower matrix sorts tasks by…', ['Urgent and important', 'Easy and hard', 'Cheap and expensive', 'Morning and evening']),
  M('ca09', 'career', 'branding', 2, 'The LinkedIn post most likely to get you noticed:', ['A short lesson from your own work', 'Your CV as an image', 'A repost with no comment', 'A link with no text']),
  // Career & Interviews: pro
  M('ca10', 'career', 'interview', 3, '"What is your biggest weakness?" Best answer:', ['A real weakness and what you are doing about it', '"I am a perfectionist"', '"I have none"', '"I work too hard"']),
  M('ca11', 'career', 'cv', 3, 'The strongest CV bullet:', ['Cut onboarding time by 30% by redesigning the process', 'Responsible for onboarding', 'Hard-working team player', 'Worked on many projects']),
  M('ca12', 'career', 'freelance', 3, 'A client asks for work outside the agreed scope. You…', ['Quote it as a change before starting', 'Do it free to keep them happy', 'End the contract', 'Do it and bill later without warning']),
  M('ca13', 'career', 'interview', 3, 'You are asked for your salary expectation first. Best move?', ['Give a researched range', 'Say any amount is fine', 'Name one low number', 'Refuse to answer']),
  // Career & Interviews: numeric
  N('can1', 'career', 'cv', 'Salary $1,200 a month. A 15% raise brings it to?', 1380, '$'),
  N('can2', 'career', 'productivity', 'Pomodoro: 25 min work + 5 min break. Full work blocks in 2 hours?', 4, 'blocks'),
  N('can3', 'career', 'freelance', 'You want $3,000 a month and can bill 60 hours. Hourly rate?', 50, '$'),
  N('can4', 'career', 'interview', 'Interview at 10:00, 40 min away, you want to arrive 10 min early. Leave how many minutes before 10:00?', 50, 'min'),
  // Career & Interviews: AI reveals
  M('caa1', 'career', 'ai', 1, 'Can AI tailor your CV to a specific job ad in a minute?', ['Yes, and list the missing keywords', 'Only for tech jobs', 'Only in English', 'No'],
    'Paste the CV and the ad, get a tailored version and the gaps. CV Writing and Personal Branding Crash Course.'),
  M('caa2', 'career', 'ai', 2, 'AI can run a mock interview out loud and grade your answers.', ['True', 'Only by text', 'Only for managers', 'False'],
    'Voice mode, tough questions, honest feedback. Practice ten times before the real one.'),
  M('caa3', 'career', 'ai', 2, 'From your notes, AI can draft a month of LinkedIn posts in your voice.', ['True', 'Only one post at a time', 'Only with a premium account', 'False'],
    'Your notes in, a month of posts out, in your own tone. ChatGPT AI Mastery.'),
  M('caa4', 'career', 'ai', 2, 'Can AI find which skills are rising in job ads for your field?', ['Yes, by reading hundreds of ads at once', 'Only LinkedIn can', 'Only for large countries', 'No'],
    'Feed it the ads, get the skills ranked by demand. Then you know what to learn next.'),
  M('caa5', 'career', 'ai', 3, 'An AI assistant can plan your week from your goals and your calendar.', ['True', 'Only with Outlook', 'Only for executives', 'False'],
    'Goals in, a realistic week out, time blocks included. Mastering Time Management, AI module.'),

  // Coding & Tech: warm-up
  M('te01', 'tech', 'web', 1, 'HTML is used to…', ['Structure the content of a web page', 'Style colors and fonts', 'Store passwords', 'Run the server']),
  M('te02', 'tech', 'python', 1, 'In Python, print("Hi") does what?', ['Shows Hi on the screen', 'Sends Hi to a printer', 'Saves a file named Hi', 'Creates a variable called Hi']),
  M('te03', 'tech', 'security', 1, 'A strong password is…', ['Long and unique for each account', 'Your birthday', 'The same everywhere so you remember it', 'Short and simple']),
  M('te04', 'tech', 'cloud', 1, '"The cloud" means…', ['Servers you rent over the internet', 'Wi-Fi from satellites', 'A type of hard drive', 'A weather service']),
  // Coding & Tech: core
  M('te05', 'tech', 'web', 2, 'CSS controls…', ['How a page looks', 'What a page says', 'Where data is stored', 'Who can log in']),
  M('te06', 'tech', 'logic', 2, 'A "bug" is…', ['An error in the code', 'A virus', 'A new feature', 'A slow connection']),
  M('te07', 'tech', 'security', 2, 'Phishing is…', ['Tricking people into giving away their data', 'A firewall setting', 'A backup method', 'A type of network cable']),
  M('te08', 'tech', 'python', 2, 'A list in Python is written with…', ['Square brackets [ ]', 'Curly braces { }', 'Angle brackets < >', 'Double quotes " "']),
  M('te09', 'tech', 'cloud', 2, 'An API lets…', ['Two programs talk to each other', 'Users reset their password', 'A site load faster', 'Code run offline']),
  // Coding & Tech: pro
  M('te10', 'tech', 'logic', 3, 'Finding a name in a sorted list of 1 million by halving each time takes about…', ['20 steps', '1,000 steps', '500,000 steps', '1 million steps']),
  M('te11', 'tech', 'security', 3, 'Two-factor authentication protects you mainly when…', ['Your password leaks', 'Your phone battery dies', 'The site is slow', 'You forget your username']),
  M('te12', 'tech', 'web', 3, 'A site works on desktop but breaks on phones. What is missing?', ['Responsive design', 'A bigger server', 'More JavaScript', 'A new domain']),
  M('te13', 'tech', 'cloud', 3, 'HTTP status 404 means…', ['Page not found', 'Server crashed', 'Access granted', 'Too many requests']),
  // Coding & Tech: numeric
  N('ten1', 'tech', 'logic', 'Binary 1010 in decimal?', 10),
  N('ten2', 'tech', 'python', 'In Python, what is 7 // 2?', 3),
  N('ten3', 'tech', 'cloud', 'Default port for HTTPS?', 443),
  N('ten4', 'tech', 'logic', 'How many bits in a byte?', 8),
  // Coding & Tech: AI reveals
  M('tea1', 'tech', 'ai', 1, 'Can AI write working code from a plain-English request?', ['Yes, and explain it line by line', 'Only pseudo-code', 'Only short snippets', 'No'],
    'Describe the function, get the code and the explanation. Claude AI course.'),
  M('tea2', 'tech', 'ai', 2, 'Can AI find the bug in your code and explain it?', ['Yes, paste the code and the error', 'Only for Python', 'Only with paid tools', 'No'],
    'Paste the error, get the cause and the fix. Debugging drops from hours to minutes.'),
  M('tea3', 'tech', 'ai', 2, 'AI can turn a screenshot of a website into working HTML and CSS.', ['True', 'Only black-and-white pages', 'Only inside Figma', 'False'],
    'Screenshot in, code out. HTML, CSS, and JavaScript, AI module.'),
  M('tea4', 'tech', 'ai', 2, 'Can AI write the tests for your code?', ['Yes, including edge cases you missed', 'Only for Java', 'Only one test at a time', 'No'],
    'Ask for tests, get the edge cases too. Software Testing and Debugging.'),
  M('tea5', 'tech', 'ai', 3, 'An AI agent can build, test and fix a small app while you only review.', ['True, coding agents do this today', 'Only in research labs', 'Only for games', 'False'],
    'Coding agents plan, write, run and fix. You review and steer. Agentic AI course.'),
]

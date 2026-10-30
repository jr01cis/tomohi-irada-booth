import { useCallback, useEffect, useRef, useState } from 'react'
import PrismSweepTransition from '@/components/smoothui/prism-sweep-transition'
import { demoMentorsFor } from '@/components/booth/Mentors'
import { recommend } from '@/data/courses'
import { CATEGORIES, SKILL_LABELS, type Category } from '@/data/questions'
import { analyze, type Answer, type RoundQuestion } from '@/lib/engine'
import { deviceId, enqueue, newId, startAutoFlush, type Submission } from '@/lib/queue'
import { LITE, type LeadData, type Screen, type Session } from '@/lib/session'
import { sfx } from '@/lib/sound'
import { useIdle } from '@/lib/useIdle'
import { PRIZE_HEADLINE, VALID_UNTIL, challengePrize, makeCode, type WheelPrize } from '@/lib/voucher'
import { AdminPanel } from '@/screens/AdminPanel'
import { Attract } from '@/screens/Attract'
import { CategoryScreen } from '@/screens/CategoryScreen'
import { FormScreen } from '@/screens/FormScreen'
import { QuizScreen } from '@/screens/QuizScreen'
import { ResultScreen } from '@/screens/ResultScreen'
import { RewardScreen } from '@/screens/RewardScreen'
import { ScoreScreen } from '@/screens/ScoreScreen'
import { VoucherScreen } from '@/screens/VoucherScreen'
import { WheelScreen } from '@/screens/WheelScreen'

const IDLE_MS = 90_000

function toSubmission(s: Session): Submission {
  const lead = s.lead!
  const base: Submission = {
    id: newId(),
    ts: new Date().toISOString(),
    device: deviceId(),
    mode: s.mode ?? 'wheel',
    name: lead.name,
    phone: lead.phone,
    industry: lead.industry,
    audience: lead.audience,
    prize: s.prize ? PRIZE_HEADLINE[s.prize] : undefined,
    voucher: s.code,
    validUntil: s.code ? VALID_UNTIL : undefined,
  }
  if (s.mode === 'challenge' && s.analysis) {
    const firstDemo = s.courses?.find((p) => demoMentorsFor(p.course.name).length > 0)
    base.category = CATEGORIES.find((c) => c.id === s.category)?.label
    base.score = s.analysis.score
    base.total = s.analysis.total
    base.pct = s.analysis.pct
    base.missed = s.analysis.missed
    base.weak = s.analysis.weak.map((w) => SKILL_LABELS[w.skill] ?? w.skill)
    base.strong = s.analysis.strong.map((w) => SKILL_LABELS[w.skill] ?? w.skill)
    base.recommended = s.courses?.map((p) => p.course.name)
    base.mentors = firstDemo ? demoMentorsFor(firstDemo.course.name).map((m) => m.name) : []
    base.answers = s.answers?.map((a) => ({ qid: a.qid, skill: a.skill, correct: a.correct, missed: a.chosen === null, ms: a.ms }))
  }
  return base
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('attract')
  const [session, setSession] = useState<Session>({})
  const [admin, setAdmin] = useState(false)
  const firstScreen = useRef(true)

  useEffect(() => startAutoFlush(), [])

  /* iOS only lets audio start inside a gesture, and suspends it again after a while */
  useEffect(() => {
    const unlock = () => sfx.unlock()
    window.addEventListener('pointerdown', unlock, { capture: true, passive: true })
    return () => window.removeEventListener('pointerdown', unlock, { capture: true })
  }, [])

  useEffect(() => {
    if (firstScreen.current) {
      firstScreen.current = false
      return
    }
    sfx.play('whoosh')
  }, [screen])

  const reset = useCallback(() => {
    setSession({})
    setScreen('attract')
  }, [])
  useIdle(IDLE_MS, reset, screen !== 'attract' && screen !== 'quiz')

  const onPrize = (prize: WheelPrize) => {
    setSession({ mode: 'wheel', prize, code: makeCode(prize) })
    setScreen('form')
  }

  const onCategory = (category: Category) => {
    setSession({ mode: 'challenge', category })
    setScreen('quiz')
  }

  const onQuizFinish = useCallback((round: RoundQuestion[], answers: Answer[], elapsedMs: number) => {
    const analysis = analyze(answers)
    const prize = challengePrize(analysis.score, analysis.total)
    setSession((s) => ({ ...s, round, answers, elapsedMs, analysis, prize, code: makeCode(prize) }))
    setScreen('score')
  }, [])

  const onLead = (lead: LeadData) => {
    /* picks wait for the form: "for my team" changes the third course */
    const courses = session.mode === 'challenge' && session.category && session.analysis ? recommend(session.category, session.analysis, lead.audience) : undefined
    const s = { ...session, lead, courses }
    setSession(s)
    enqueue(toSubmission(s))
    setScreen(s.mode === 'wheel' ? 'voucher' : 'result')
  }

  let content: React.ReactNode
  switch (screen) {
    case 'attract':
      content = (
        <Attract
          onWheel={() => {
            setSession({ mode: 'wheel' })
            setScreen('wheel')
          }}
          onChallenge={() => {
            setSession({ mode: 'challenge' })
            setScreen('category')
          }}
          onSecret={() => setAdmin(true)}
        />
      )
      break
    case 'wheel':
      content = <WheelScreen onPrize={onPrize} onBack={reset} />
      break
    case 'category':
      content = <CategoryScreen onPick={onCategory} onBack={reset} />
      break
    case 'quiz':
      content = <QuizScreen key={session.category} category={session.category!} onFinish={onQuizFinish} />
      break
    case 'score':
      content = <ScoreScreen analysis={session.analysis!} prize={session.prize!} elapsedMs={session.elapsedMs ?? 0} onContinue={() => setScreen('form')} />
      break
    case 'form':
      content =
        session.mode === 'wheel' ? (
          <FormScreen
            title={`Claim your ${session.prize ? PRIZE_HEADLINE[session.prize].toLowerCase() : 'prize'}`}
            subtitle="We save the voucher under your WhatsApp number so nobody else can use it."
            cta="Get my voucher"
            onSubmit={onLead}
          />
        ) : (
          <FormScreen
            title="Unlock your analysis"
            subtitle="Your skill map, where to improve, the course that fixes it and your reward. Sent to your WhatsApp too."
            cta="Show my analysis"
            onSubmit={onLead}
          />
        )
      break
    case 'result':
      content = <ResultScreen session={session} onClaim={() => setScreen('reward')} />
      break
    case 'reward':
      content = <RewardScreen session={session} onDone={reset} />
      break
    case 'voucher':
      content = <VoucherScreen session={session} onDone={reset} />
      break
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-brand-deep">
      {LITE ? (
        <div className="h-full w-full">{content}</div>
      ) : (
        <PrismSweepTransition transitionKey={screen} tone="prism" direction="right" duration={900} className="h-full w-full rounded-none bg-brand-deep">
          {content}
        </PrismSweepTransition>
      )}
      {admin && <AdminPanel onClose={() => setAdmin(false)} />}
    </div>
  )
}

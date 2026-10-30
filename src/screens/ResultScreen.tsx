import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Analysis, CoursePicks } from '@/components/booth/Analysis'
import { BigButton } from '@/components/booth/BigButton'
import { Logo } from '@/components/booth/Logo'
import { MentorBrowser } from '@/components/booth/Mentors'
import type { Session } from '@/lib/session'
import { PRIZE_CLAIM } from '@/lib/voucher'

interface Props {
  session: Session
  onClaim: () => void
}

export function ResultScreen({ session, onClaim }: Props) {
  const [ready, setReady] = useState(false)
  const [browse, setBrowse] = useState<string | null>(null)
  const { analysis, lead, category, courses, elapsedMs, prize } = session
  if (!analysis || !lead || !category || !courses) return null

  return (
    <div className="relative h-full">
      <div className="flex h-full flex-col overflow-y-auto bg-[#f1f2f4] px-12 py-7 text-ink">
        <Logo tone="dark" className="h-10" />

        <div className="mt-5 grid flex-1 grid-cols-[1.1fr_1fr] gap-8">
          <Analysis
            name={lead.name}
            category={category}
            industry={lead.industry}
            analysis={analysis}
            picks={courses}
            elapsedMs={elapsedMs ?? 0}
            onDone={() => setReady(true)}
          />

          {ready && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
              <CoursePicks picks={courses} onOpenMentors={setBrowse} />
              <BigButton size="lg" variant="coral" onClick={onClaim} className="mt-auto w-full">
                Claim my {prize ? PRIZE_CLAIM[prize] : 'reward'}
              </BigButton>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {browse && <MentorBrowser courses={courses.map((p) => p.course.name)} initialCourse={browse} onClose={() => setBrowse(null)} />}
      </AnimatePresence>
    </div>
  )
}

import { motion } from 'motion/react'
import { useState } from 'react'
import { Analysis, CoursePicks } from '@/components/booth/Analysis'
import { BigButton } from '@/components/booth/BigButton'
import { Logo } from '@/components/booth/Logo'
import { VoucherCard } from '@/components/booth/VoucherCard'
import { WhatsAppShare } from '@/components/booth/WhatsAppShare'
import type { Session } from '@/lib/session'

interface Props {
  session: Session
  onDone: () => void
}

export function ResultScreen({ session, onDone }: Props) {
  const [ready, setReady] = useState(false)
  const { analysis, lead, category, courses, elapsedMs, code } = session
  if (!analysis || !lead || !category || !courses) return null
  const shown = analysis.freeSession ? courses.slice(0, 2) : courses

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f1f2f4] px-12 py-7 text-ink">
      <div className="flex items-center justify-between">
        <Logo tone="dark" className="h-10" />
        {ready && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BigButton size="md" variant="dark" onClick={onDone}>
              Done
            </BigButton>
          </motion.div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-[1.1fr_1fr] gap-8">
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
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
            <CoursePicks picks={shown} />
            {analysis.freeSession && code && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-semibold uppercase tracking-widest text-coral">And because you scored {analysis.pct}%</p>
                <VoucherCard prize="SESSION" code={code} name={lead.name} compact />
              </div>
            )}
            <WhatsAppShare session={session} tone="light" />
          </motion.div>
        )}
      </div>
    </div>
  )
}

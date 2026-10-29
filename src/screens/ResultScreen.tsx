import { motion } from 'motion/react'
import { useState } from 'react'
import { Analysis } from '@/components/booth/Analysis'
import { BigButton } from '@/components/booth/BigButton'
import { Logo } from '@/components/booth/Logo'
import { VoucherCard } from '@/components/booth/VoucherCard'
import type { Session } from '@/lib/session'

interface Props {
  session: Session
  onDone: () => void
}

export function ResultScreen({ session, onDone }: Props) {
  const [ready, setReady] = useState(false)
  const { analysis, lead, category, courses, elapsedMs, code } = session
  if (!analysis || !lead || !category || !courses) return null

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f1f2f4] px-10 py-8 text-ink">
      <Logo tone="dark" className="h-10" />
      <div className="mt-6 flex-1">
        <Analysis name={lead.name} category={category} analysis={analysis} courses={courses} elapsedMs={elapsedMs ?? 0} onDone={() => setReady(true)} />

        {ready && analysis.freeSession && code && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8 flex flex-col items-center gap-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-coral">And because you scored {analysis.pct}%</p>
            <VoucherCard prize="SESSION" code={code} name={lead.name} />
          </motion.div>
        )}
      </div>

      {ready && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 flex flex-col items-center gap-3 pb-4">
          <p className="text-lg text-body">We will WhatsApp you this result and your next step.</p>
          <BigButton size="xl" variant="primary" className="w-[520px]" onClick={onDone}>
            Done
          </BigButton>
        </motion.div>
      )}
    </div>
  )
}

import { motion } from 'motion/react'
import { BigButton } from '@/components/booth/BigButton'
import { Logo } from '@/components/booth/Logo'
import { MentorCards, demoMentorsFor } from '@/components/booth/Mentors'
import { VoucherCard } from '@/components/booth/VoucherCard'
import { WhatsAppShare } from '@/components/booth/WhatsAppShare'
import type { Session } from '@/lib/session'

interface Props {
  session: Session
  onDone: () => void
}

/** The challenge's reward: the voucher, who can give the free demo, and the WhatsApp hand-off. */
export function RewardScreen({ session, onDone }: Props) {
  const { prize, code, lead, courses } = session
  if (!prize || !code || !lead) return null
  const demoCourse = courses?.find((p) => demoMentorsFor(p.course.name).length > 0)?.course

  return (
    <div className="flex h-full flex-col bg-brand-deep px-12 py-8 text-white">
      <div className="flex items-center justify-between">
        <Logo tone="light" className="h-12" />
        <BigButton size="md" variant="light" onClick={onDone}>
          Done
        </BigButton>
      </div>

      <div className="mt-6 grid flex-1 grid-cols-[1fr_440px] items-center gap-10">
        <div className="flex flex-col items-start gap-6">
          <div>
            <h2 className="text-5xl font-bold tracking-tight">Yours, {lead.name.split(' ')[0]}</h2>
            <p className="mt-2 text-xl text-white/70">Tilt the iPad. Then take a photo of the card, or send it to your WhatsApp.</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 40, rotateX: 20 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ type: 'spring', bounce: 0.3, duration: 0.9 }}>
            <VoucherCard prize={prize} code={code} name={lead.name} />
          </motion.div>
          <p className="max-w-[560px] text-base text-white/60">The code is saved under your number. The Tomohi team will reach out on WhatsApp to book your demo.</p>
        </div>

        <div className="flex flex-col gap-5">
          {demoCourse && (
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-coral">Your free demo, with one of them</p>
                <p className="mt-1 text-lg text-white/80">{demoCourse.name}</p>
              </div>
              <MentorCards courseName={demoCourse.name} />
            </div>
          )}
          <WhatsAppShare session={session} tone="dark" />
        </div>
      </div>
    </div>
  )
}

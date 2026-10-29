import { motion } from 'motion/react'
import { BigButton } from '@/components/booth/BigButton'
import { Logo } from '@/components/booth/Logo'
import { VoucherCard } from '@/components/booth/VoucherCard'
import { WhatsAppShare } from '@/components/booth/WhatsAppShare'
import type { Session } from '@/lib/session'

interface Props {
  session: Session
  onDone: () => void
}

export function VoucherScreen({ session, onDone }: Props) {
  const { prize, code, lead } = session
  if (!prize || !code || !lead) return null
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
          <p className="max-w-[560px] text-base text-white/60">The code is saved under your number. The Tomohi team will reach out on WhatsApp to pick your course or book the session.</p>
        </div>
        <WhatsAppShare session={session} tone="dark" />
      </div>
    </div>
  )
}

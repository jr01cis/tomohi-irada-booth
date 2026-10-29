import { motion } from 'motion/react'
import { BigButton } from '@/components/booth/BigButton'
import { Logo } from '@/components/booth/Logo'
import { VoucherCard } from '@/components/booth/VoucherCard'
import type { Session } from '@/lib/session'

interface Props {
  session: Session
  onDone: () => void
}

export function VoucherScreen({ session, onDone }: Props) {
  const { prize, code, lead } = session
  if (!prize || !code || !lead) return null
  return (
    <div className="flex h-full flex-col items-center bg-brand-deep px-10 py-10 text-center text-white">
      <div className="w-full">
        <Logo tone="light" className="h-11" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <div>
          <h2 className="text-5xl font-bold tracking-tight">Yours, {lead.name.split(' ')[0]}</h2>
          <p className="mt-3 text-2xl text-white/70">Tilt the iPad. Then take a photo of the card.</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 40, rotateX: 20 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ type: 'spring', bounce: 0.3, duration: 0.9 }}>
          <VoucherCard prize={prize} code={code} name={lead.name} />
        </motion.div>
        <p className="max-w-[560px] text-lg text-white/60">We saved the code with your number. The Tomohi team will WhatsApp you to pick your course.</p>
      </div>
      <BigButton size="xl" variant="light" className="w-[520px]" onClick={onDone}>
        Done
      </BigButton>
    </div>
  )
}

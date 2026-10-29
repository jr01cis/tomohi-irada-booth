import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import QRCode from 'react-qr-code'
import type { Session } from '@/lib/session'
import { cn } from '@/lib/utils'
import { waLink } from '@/lib/whatsapp'
import { BigButton } from './BigButton'

interface Props {
  session: Session
  tone?: 'dark' | 'light'
  className?: string
}

const WaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.8 11.8 0 0 0 4.5 4c.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z" />
  </svg>
)

export function WhatsAppShare({ session, tone = 'dark', className }: Props) {
  const [open, setOpen] = useState(false)
  const link = waLink(session)
  const dark = tone === 'dark'
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <BigButton size="lg" variant="coral" onClick={() => setOpen((v) => !v)} className="w-full">
        <WaIcon />
        {open ? 'Hide the QR code' : 'Send it to my WhatsApp'}
      </BigButton>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className={cn('flex items-center gap-5 rounded-[28px] p-5', dark ? 'bg-white/10 text-white' : 'border border-line bg-white text-ink')}
          >
            <div className="shrink-0 rounded-2xl bg-white p-3">
              <QRCode value={link} size={164} fgColor="#0a2952" bgColor="#ffffff" level="M" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-coral">Scan with your phone</p>
              <p className={cn('mt-1 text-lg leading-snug', dark ? 'text-white/85' : 'text-body')}>
                WhatsApp opens with your voucher already written. Tap send and it is saved in your chat with Tomohi.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

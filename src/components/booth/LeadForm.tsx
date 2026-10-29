import { motion } from 'motion/react'
import { useState } from 'react'
import { AUDIENCE, INDUSTRIES } from '@/data/options'
import type { LeadData } from '@/lib/session'
import { cn } from '@/lib/utils'
import { BigButton } from './BigButton'

interface Props {
  cta: string
  onSubmit: (lead: LeadData) => void
}

const digitsOnly = (s: string) => s.replace(/\D/g, '')

function normalizePhone(raw: string): string | null {
  let d = digitsOnly(raw)
  if (d.startsWith('961')) d = d.slice(3)
  if (d.startsWith('0')) d = d.slice(1)
  if (d.length < 7 || d.length > 8) return null
  return `+961${d}`
}

const field =
  'w-full rounded-2xl border-2 border-line bg-white px-5 text-2xl text-ink outline-none transition focus:border-brand min-h-16 placeholder:text-body/50'
const label = 'text-sm font-semibold uppercase tracking-wider text-body'

export function LeadForm({ cta, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [industry, setIndustry] = useState('')
  const [audience, setAudience] = useState<'me' | 'team' | ''>('')
  const [touched, setTouched] = useState(false)

  const phoneOk = normalizePhone(phone) !== null
  const nameOk = name.trim().length >= 2
  const valid = nameOk && phoneOk && industry !== '' && audience !== ''

  const submit = () => {
    setTouched(true)
    if (!valid) return
    onSubmit({ name: name.trim(), phone: normalizePhone(phone)!, industry, audience: audience as 'me' | 'team' })
  }

  return (
    <div className="grid grid-cols-[1fr_1.25fr] gap-8">
      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className={label}>Your name</span>
          <input
            className={cn(field, touched && !nameOk && 'border-coral')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="next"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className={label}>WhatsApp number</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-body">+961</span>
            <input
              className={cn(field, 'pl-20 tabular-nums', touched && !phoneOk && 'border-coral')}
              value={phone}
              onChange={(e) => setPhone(digitsOnly(e.target.value).slice(0, 8))}
              placeholder="70 123 456"
              inputMode="numeric"
              autoComplete="off"
              enterKeyHint="done"
            />
          </div>
        </label>
        <div className="flex flex-col gap-2">
          <span className={label}>This is</span>
          <div className="grid grid-cols-2 gap-3">
            {AUDIENCE.map((a) => {
              const on = audience === a.id
              return (
                <motion.button
                  key={a.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setAudience(a.id)}
                  className={cn(
                    'flex min-h-16 flex-col items-start justify-center rounded-2xl border-2 px-4 text-left transition-colors',
                    on ? 'border-brand bg-brand-soft' : 'border-line bg-white',
                  )}
                >
                  <span className={cn('text-lg font-semibold', on ? 'text-brand' : 'text-ink')}>{a.label}</span>
                  <span className="text-xs text-body">{a.hint}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
        <BigButton size="xl" variant="primary" onClick={submit} disabled={touched && !valid} className="mt-1 w-full">
          {cta}
        </BigButton>
        {touched && !valid && <p className="text-base text-coral">Name, a Lebanese number, industry and who it is for, then we are good.</p>}
      </div>

      <div className="flex flex-col gap-2">
        <span className={label}>Industry</span>
        <div className="flex flex-wrap gap-2.5">
          {INDUSTRIES.map((it) => {
            const on = industry === it
            return (
              <motion.button
                key={it}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIndustry(it)}
                className={cn(
                  'min-h-14 rounded-full border-2 px-5 text-lg font-medium transition-colors',
                  on ? 'border-coral bg-coral text-white' : 'border-line bg-white text-ink',
                )}
              >
                {it}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { LeadForm } from '@/components/booth/LeadForm'
import { Logo } from '@/components/booth/Logo'
import type { LeadData } from '@/lib/session'

interface Props {
  title: string
  subtitle: string
  cta: string
  onSubmit: (lead: LeadData) => void
}

export function FormScreen({ title, subtitle, cta, onSubmit }: Props) {
  return (
    <div className="flex h-full flex-col bg-[#f1f2f4] px-12 py-7 text-ink">
      <div className="flex items-end justify-between gap-8">
        <div>
          <Logo tone="dark" className="h-10" />
          <h2 className="mt-4 text-5xl font-bold tracking-tight">{title}</h2>
        </div>
        <p className="max-w-[480px] text-right text-lg text-body">{subtitle}</p>
      </div>
      <div className="mt-6">
        <LeadForm cta={cta} onSubmit={onSubmit} />
      </div>
    </div>
  )
}

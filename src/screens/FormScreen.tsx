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
    <div className="flex h-full flex-col bg-[#f1f2f4] px-10 py-8 text-ink">
      <Logo tone="dark" className="h-10" />
      <div className="mt-6">
        <h2 className="text-5xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-xl text-body">{subtitle}</p>
      </div>
      <div className="mt-8">
        <LeadForm cta={cta} onSubmit={onSubmit} />
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { BigButton } from '@/components/booth/BigButton'
import { exportAll, flush, pending, sentLog } from '@/lib/queue'

interface Props {
  onClose: () => void
}

export function AdminPanel({ onClose }: Props) {
  const [left, setLeft] = useState(pending().length)
  const [sent, setSent] = useState(sentLog().length)
  const [msg, setMsg] = useState('')
  const [show, setShow] = useState(false)

  const refresh = () => {
    setLeft(pending().length)
    setSent(sentLog().length)
  }
  useEffect(refresh, [])

  const retry = async () => {
    setMsg('Sending...')
    const r = await flush()
    refresh()
    setMsg(`Sent ${r.sent}, ${r.left} still waiting`)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportAll())
      setMsg('Copied JSON to clipboard')
    } catch {
      setShow(true)
      setMsg('Clipboard blocked, select the text below')
    }
  }

  const endpoint = (import.meta.env.VITE_WEBHOOK_URL as string | undefined) ?? '(no webhook configured)'

  return (
    <div className="absolute inset-0 z-50 flex flex-col gap-6 bg-brand-deep/95 p-10 text-white backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Booth admin</h2>
        <button onClick={onClose} className="rounded-full bg-white/10 px-5 py-3">
          Close
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-2xl bg-white/10 p-6">
          <p className="text-5xl font-bold tabular-nums">{sent}</p>
          <p className="text-white/60">sent to n8n</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-6">
          <p className="text-5xl font-bold tabular-nums">{left}</p>
          <p className="text-white/60">waiting (offline)</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-6">
          <p className="text-xl font-semibold">{navigator.onLine ? 'online' : 'offline'}</p>
          <p className="truncate text-xs text-white/50">{endpoint}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <BigButton variant="coral" onClick={retry}>
          Retry sending
        </BigButton>
        <BigButton variant="ghost" onClick={copy}>
          Copy all as JSON
        </BigButton>
        <BigButton variant="ghost" onClick={() => location.reload()}>
          Reload app
        </BigButton>
      </div>
      {msg && <p className="text-lg text-white/80">{msg}</p>}
      {show && <textarea readOnly className="h-64 w-full rounded-xl bg-black/40 p-3 font-mono text-xs text-white" value={exportAll()} />}
      <p className="text-sm text-white/40">Queue lives in this iPad's browser storage. Clearing Safari data deletes unsent leads.</p>
    </div>
  )
}

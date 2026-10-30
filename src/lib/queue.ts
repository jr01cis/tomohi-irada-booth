const QUEUE_KEY = 'irada.queue.v1'
const SENT_KEY = 'irada.sent.v1'
const ENDPOINT = import.meta.env.VITE_WEBHOOK_URL as string | undefined
const BOOTH_KEY = import.meta.env.VITE_BOOTH_KEY as string | undefined
const DEVICE_KEY = 'irada.device'

export type Mode = 'wheel' | 'challenge'

export interface Submission {
  id: string
  ts: string
  device: string
  mode: Mode
  name: string
  phone: string
  industry: string
  audience: 'me' | 'team'
  prize?: string
  voucher?: string
  validUntil?: string
  category?: string
  score?: number
  total?: number
  pct?: number
  weak?: string[]
  strong?: string[]
  recommended?: string[]
  /** questions the bell cut off */
  missed?: number
  /** demo mentors offered for the first recommended course */
  mentors?: string[]
  answers?: { qid: string; skill: string; correct: boolean; missed: boolean; ms: number }[]
  attempts?: number
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or blocked: the in-memory copy still goes out this session */
  }
}

export function deviceId(): string {
  let id = read<string | null>(DEVICE_KEY, null)
  if (!id) {
    id = 'ipad-' + Math.random().toString(36).slice(2, 8)
    write(DEVICE_KEY, id)
  }
  return id
}

export function newId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7)
}

export function pending(): Submission[] {
  return read<Submission[]>(QUEUE_KEY, [])
}

export function sentLog(): Submission[] {
  return read<Submission[]>(SENT_KEY, [])
}

export function enqueue(s: Submission) {
  write(QUEUE_KEY, [...pending(), s])
  void flush()
}

let flushing = false

async function post(s: Submission): Promise<boolean> {
  if (!ENDPOINT) return false
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 8000)
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(BOOTH_KEY ? { 'X-Booth-Key': BOOTH_KEY } : {}) },
      body: JSON.stringify(s),
      signal: ctrl.signal,
    })
    /* a 4xx is the server rejecting this payload for good; retrying it forever would only block the queue */
    return res.ok || (res.status >= 400 && res.status < 500)
  } catch {
    return false
  } finally {
    clearTimeout(t)
  }
}

export async function flush(): Promise<{ sent: number; left: number }> {
  if (flushing) return { sent: 0, left: pending().length }
  flushing = true
  let sent = 0
  try {
    const queue = pending()
    const remaining: Submission[] = []
    for (const s of queue) {
      const ok = await post(s)
      if (ok) {
        sent += 1
        write(SENT_KEY, [...sentLog().slice(-199), s])
      } else {
        remaining.push({ ...s, attempts: (s.attempts ?? 0) + 1 })
      }
    }
    write(QUEUE_KEY, remaining)
    return { sent, left: remaining.length }
  } finally {
    flushing = false
  }
}

export function startAutoFlush() {
  const tick = () => void flush()
  window.addEventListener('online', tick)
  const h = setInterval(tick, 20_000)
  tick()
  return () => {
    window.removeEventListener('online', tick)
    clearInterval(h)
  }
}

export function exportAll(): string {
  return JSON.stringify({ pending: pending(), sent: sentLog() }, null, 2)
}

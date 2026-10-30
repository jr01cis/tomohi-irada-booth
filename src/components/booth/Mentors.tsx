import { ChevronLeft, ChevronRight, MapPin, Play, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { DEMO_MENTORS_BY_COURSE, MENTORS, type Mentor } from '@/data/mentors'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/utils'

export function demoMentorsFor(courseName: string): Mentor[] {
  return (DEMO_MENTORS_BY_COURSE[courseName] ?? []).map((id) => MENTORS[id]).filter(Boolean)
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')

function Avatar({ m, size, ring, className }: { m: Mentor; size: number; ring?: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const style = { width: size, height: size }
  if (!m.photo || failed) {
    return (
      <span style={style} className={cn('flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-bold text-brand', ring, className)}>
        <span style={{ fontSize: size * 0.36 }}>{initials(m.name)}</span>
      </span>
    )
  }
  return (
    <img
      src={m.photo}
      alt={m.name}
      style={style}
      referrerPolicy="no-referrer"
      draggable={false}
      onError={() => setFailed(true)}
      className={cn('shrink-0 rounded-full bg-brand-soft object-cover', ring, className)}
    />
  )
}

const firstName = (n: string) => n.split(' ')[0]

/** Overlapping faces plus "Free demo with ...", for a course pick card. Tap to browse. */
export function MentorStack({ courseName, onDark = false, onOpen }: { courseName: string; onDark?: boolean; onOpen?: () => void }) {
  const list = demoMentorsFor(courseName)
  if (!list.length) return null
  const shown = list.slice(0, 4)
  const names = list.slice(0, 2).map((m) => firstName(m.name))
  const more = list.length - names.length
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        sfx.play('blip')
        onOpen?.()
      }}
      className={cn('mt-3 flex w-full items-center gap-3 rounded-2xl px-2 py-1.5 text-left', onDark ? 'bg-white/10' : 'bg-brand-soft/60')}
    >
      <div className="flex -space-x-2.5">
        {shown.map((m) => (
          <Avatar key={m.name} m={m} size={34} ring={onDark ? 'ring-2 ring-brand' : 'ring-2 ring-white'} />
        ))}
      </div>
      <p className={cn('flex-1 text-sm font-medium', onDark ? 'text-white/90' : 'text-ink')}>
        Free demo with {names.join(', ')}
        {more > 0 ? ` and ${more} more` : ''}
      </p>
      <span className={cn('flex items-center gap-1 text-sm font-semibold', onDark ? 'text-white' : 'text-brand')}>
        Meet them <ChevronRight size={16} />
      </span>
    </button>
  )
}

/** Bigger cards for the reward screen. Tap one to open the browser on that mentor. */
export function MentorCards({ courseName, max = 4, onOpen }: { courseName: string; max?: number; onOpen?: (mentorIndex: number) => void }) {
  const all = demoMentorsFor(courseName)
  const list = all.slice(0, max)
  if (!list.length) return null
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {list.map((m, i) => (
          <motion.button
            key={m.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              sfx.play('blip')
              onOpen?.(i)
            }}
            className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-left"
          >
            <Avatar m={m} size={52} />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold leading-tight">{m.name}</p>
              <p className="truncate text-sm text-white/65">{m.languages.join(' · ')}</p>
            </div>
          </motion.button>
        ))}
      </div>
      {all.length > max && (
        <button onClick={() => onOpen?.(max)} className="self-start text-sm font-semibold text-white/80 underline underline-offset-4">
          See all {all.length} mentors
        </button>
      )}
    </div>
  )
}

function Chips({ items, tone = 'brand' }: { items: string[]; tone?: 'brand' | 'coral' | 'plain' }) {
  if (!items.length) return null
  const cls = tone === 'coral' ? 'bg-coral-soft text-coral' : tone === 'plain' ? 'bg-[#f1f2f4] text-ink' : 'bg-brand-soft text-brand'
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className={cn('rounded-full px-3 py-1 text-sm font-medium', cls)}>
          {t}
        </span>
      ))}
    </div>
  )
}

function Profile({ m }: { m: Mentor }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto pr-2 [&>*]:shrink-0">
      <div className="flex items-center gap-5">
        <Avatar m={m} size={112} className="ring-4 ring-brand-soft" />
        <div className="min-w-0">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">Free demo available</span>
          <h3 className="mt-2 text-4xl font-bold leading-tight tracking-tight text-ink">{m.name}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-lg text-body">
            <span>{m.title}</span>
            {m.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={16} /> {m.location}
              </span>
            )}
            <span>Speaks {m.languages.join(' and ')}</span>
          </p>
        </div>
      </div>

      {m.video && (
        <div className="relative aspect-video w-full max-w-[560px] overflow-hidden rounded-2xl bg-brand-deep">
          {playing ? (
            <video src={m.video} controls autoPlay playsInline className="h-full w-full object-contain" />
          ) : (
            <button onClick={() => setPlaying(true)} className="absolute inset-0 flex items-center justify-center">
              {m.photo && <img src={m.photo} alt="" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover opacity-40 blur-sm" />}
              <span className="relative flex items-center gap-3 rounded-full bg-white px-6 py-3 text-lg font-semibold text-brand shadow-lg">
                <Play size={22} fill="currentColor" /> Watch {firstName(m.name)}'s intro
              </span>
            </button>
          )}
        </div>
      )}

      {m.fields.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-body">Fields</p>
          <Chips items={m.fields} />
        </div>
      )}
      {m.specialties.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-body">Specialties and tools</p>
          <Chips items={m.specialties} tone="coral" />
        </div>
      )}
      {m.bio && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-body">About</p>
          <p className="whitespace-pre-line text-lg leading-relaxed text-ink">{m.bio}</p>
        </div>
      )}
      {m.courses.length > 0 && (
        <div className="flex flex-col gap-2 pb-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-body">Teaches on Tomohi</p>
          <Chips items={m.courses} tone="plain" />
        </div>
      )}
    </div>
  )
}

interface BrowserProps {
  courses: string[]
  initialCourse: string
  initialIndex?: number
  onClose: () => void
}

/** Full-screen popup to browse the demo mentors of the recommended courses. */
export function MentorBrowser({ courses, initialCourse, initialIndex = 0, onClose }: BrowserProps) {
  const tabs = courses.filter((c) => demoMentorsFor(c).length > 0)
  const [course, setCourse] = useState(tabs.includes(initialCourse) ? initialCourse : tabs[0])
  const [index, setIndex] = useState(initialIndex)
  const list = demoMentorsFor(course)
  const safe = Math.min(index, list.length - 1)
  const m = list[safe]
  if (!m) return null

  const go = (d: number) => {
    sfx.play('tap')
    setIndex((safe + d + list.length) % list.length)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-brand-deep/70 p-6 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 30, scale: 0.97 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-[1120px] flex-col overflow-hidden rounded-[32px] bg-white text-ink shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center justify-between gap-6 border-b border-line px-7 py-4">
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-widest text-coral">Free demo mentors</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tabs.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    sfx.play('tap')
                    setCourse(c)
                    setIndex(0)
                  }}
                  className={cn('rounded-full border-2 px-4 py-1.5 text-base font-semibold', c === course ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink')}
                >
                  {c} <span className={c === course ? 'text-white/70' : 'text-body'}>· {demoMentorsFor(c).length}</span>
                </button>
              ))}
            </div>
          </div>
          <button aria-label="Close" onClick={onClose} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f1f2f4] text-ink">
            <X size={24} />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[300px_1fr]">
          <div className="flex min-h-0 flex-col gap-1.5 overflow-y-auto border-r border-line p-3">
            {list.map((x, i) => (
              <button
                key={x.name}
                onClick={() => {
                  sfx.play('tap')
                  setIndex(i)
                }}
                className={cn('flex items-center gap-3 rounded-2xl p-2.5 text-left', i === safe ? 'bg-brand-soft' : 'hover:bg-[#f1f2f4]')}
              >
                <Avatar m={x} size={48} />
                <div className="min-w-0">
                  <p className={cn('truncate text-base font-semibold', i === safe ? 'text-brand' : 'text-ink')}>{x.name}</p>
                  <p className="truncate text-sm text-body">{x.fields[0] ?? x.title}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="flex min-h-0 flex-col p-7 pb-4">
            <div className="min-h-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={m.name}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.22 }}
                  className="h-full"
                >
                  <Profile m={m} />
                </motion.div>
              </AnimatePresence>
            </div>
            {list.length > 1 && (
              <div className="flex items-center justify-between border-t border-line pt-3">
                <button onClick={() => go(-1)} className="flex items-center gap-1 rounded-full px-4 py-2 text-base font-semibold text-brand">
                  <ChevronLeft size={20} /> Previous
                </button>
                <span className="text-sm text-body tabular-nums">
                  {safe + 1} / {list.length}
                </span>
                <button onClick={() => go(1)} className="flex items-center gap-1 rounded-full px-4 py-2 text-base font-semibold text-brand">
                  Next <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

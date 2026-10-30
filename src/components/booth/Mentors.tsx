import { motion } from 'motion/react'
import { useState } from 'react'
import { DEMO_MENTORS_BY_COURSE, MENTORS, type Mentor } from '@/data/mentors'
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

function Avatar({ m, size, ring }: { m: Mentor; size: number; ring?: string }) {
  const [failed, setFailed] = useState(false)
  const style = { width: size, height: size }
  if (!m.photo || failed) {
    return (
      <span style={style} className={cn('flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-bold text-brand', ring)}>
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
      className={cn('shrink-0 rounded-full bg-brand-soft object-cover', ring)}
    />
  )
}

const firstName = (n: string) => n.split(' ')[0]

/** Overlapping faces plus "Free demo with ...", for a course pick card. */
export function MentorStack({ courseName, onDark = false }: { courseName: string; onDark?: boolean }) {
  const list = demoMentorsFor(courseName)
  if (!list.length) return null
  const shown = list.slice(0, 4)
  const names = list.slice(0, 2).map((m) => firstName(m.name))
  const more = list.length - names.length
  return (
    <div className="mt-3 flex items-center gap-3">
      <div className="flex -space-x-2.5">
        {shown.map((m) => (
          <Avatar key={m.name} m={m} size={34} ring={onDark ? 'ring-2 ring-brand' : 'ring-2 ring-white'} />
        ))}
      </div>
      <p className={cn('text-sm font-medium', onDark ? 'text-white/85' : 'text-body')}>
        Free demo with {names.join(', ')}
        {more > 0 ? ` and ${more} more` : ''}
      </p>
    </div>
  )
}

/** Bigger cards for the reward screen. */
export function MentorCards({ courseName, max = 4 }: { courseName: string; max?: number }) {
  const list = demoMentorsFor(courseName).slice(0, max)
  if (!list.length) return null
  return (
    <div className="grid grid-cols-2 gap-3">
      {list.map((m, i) => (
        <motion.div
          key={m.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.08 }}
          className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"
        >
          <Avatar m={m} size={52} />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold leading-tight">{m.name}</p>
            <p className="truncate text-sm text-white/65">{m.languages.join(' · ')}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

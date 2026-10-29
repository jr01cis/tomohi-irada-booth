import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect } from 'react'

interface Props {
  value: number
  duration?: number
  delay?: number
  className?: string
  suffix?: string
}

export function CountUp({ value, duration = 1.4, delay = 0, className, suffix = '' }: Props) {
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => `${Math.round(v)}${suffix}`)
  useEffect(() => {
    const controls = animate(mv, value, { duration, delay, ease: [0.2, 0.8, 0.2, 1] })
    return () => controls.stop()
  }, [mv, value, duration, delay])
  return <motion.span className={className}>{text}</motion.span>
}

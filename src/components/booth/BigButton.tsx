import { motion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'
import { sfx } from '@/lib/sound'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'coral' | 'light' | 'ghost' | 'dark'
type Size = 'md' | 'lg' | 'xl'

interface Props extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white shadow-[0_12px_40px_-12px_rgba(46,54,184,0.7)]',
  coral: 'bg-coral text-white shadow-[0_12px_40px_-12px_rgba(252,105,79,0.7)]',
  light: 'bg-white text-ink border border-line',
  ghost: 'bg-white/10 text-white border border-white/20 backdrop-blur',
  dark: 'bg-brand-deep text-white',
}

const sizes: Record<Size, string> = {
  md: 'min-h-14 px-6 text-lg rounded-2xl',
  lg: 'min-h-18 px-8 text-xl rounded-3xl',
  xl: 'min-h-24 px-10 text-2xl rounded-[2rem]',
}

export function BigButton({ variant = 'primary', size = 'lg', className, children, onPointerDown, ...rest }: Props) {
  return (
    <motion.button
      onPointerDown={(e) => {
        sfx.play('tap')
        onPointerDown?.(e)
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.3 }}
      className={cn(
        'inline-flex items-center justify-center gap-3 font-semibold tracking-tight select-none disabled:opacity-40 disabled:pointer-events-none',
        sizes[size],
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

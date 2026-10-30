import confetti from 'canvas-confetti'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { BigButton } from '@/components/booth/BigButton'
import { CountUp } from '@/components/booth/CountUp'
import { Logo } from '@/components/booth/Logo'
import type { Analysis } from '@/lib/engine'
import { sfx } from '@/lib/sound'
import { PRIZE_HEADLINE, isBigPrize, type Prize } from '@/lib/voucher'

interface Props {
  analysis: Analysis
  prize: Prize
  elapsedMs: number
  onContinue: () => void
}

export function ScoreScreen({ analysis, prize, elapsedMs, onContinue }: Props) {
  const big = isBigPrize(prize)
  useEffect(() => {
    const t1 = setTimeout(() => sfx.play('yeah'), 250)
    const t2 = setTimeout(
      () =>
        confetti({
          particleCount: big ? 240 : 120,
          spread: big ? 110 : 80,
          startVelocity: 50,
          origin: { y: 0.5 },
          colors: ['#2e36b8', '#fc694f', '#fcc24a', '#ffffff'],
        }),
      1300,
    )
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [big])

  const line =
    analysis.score >= 10 ? 'A perfect round.' : analysis.score >= 8 ? 'Top of the room.' : analysis.score >= 6 ? 'Strong round.' : analysis.score >= 4 ? 'Decent. The gaps are fixable.' : 'Now you know where to start.'

  return (
    <div className="flex h-full flex-col items-center bg-brand-deep px-10 py-10 text-center text-white">
      <div className="w-full">
        <Logo tone="light" className="h-11" />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="text-2xl font-semibold uppercase tracking-widest text-coral">Your score</p>
        <p className="mt-2 flex items-baseline text-[200px] font-bold leading-none tracking-tight tabular-nums">
          <CountUp value={analysis.score} duration={1.2} />
          <span className="text-[72px] text-white/50">/{analysis.total}</span>
        </p>
        <p className="mt-2 text-3xl text-white/80">
          {analysis.missed
            ? `${analysis.missed} not reached before the bell. ${line}`
            : `All answered in ${Math.round(elapsedMs / 1000)} seconds. ${line}`}
        </p>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.3, type: 'spring', bounce: 0.5, duration: 0.8 }}
          className="mt-10 rounded-full bg-coral px-8 py-4 text-3xl font-bold"
        >
          You unlocked: {PRIZE_HEADLINE[prize].toLowerCase()}
        </motion.div>
      </div>
      <BigButton size="xl" variant="light" className="w-[520px]" onClick={onContinue}>
        See my analysis
      </BigButton>
    </div>
  )
}

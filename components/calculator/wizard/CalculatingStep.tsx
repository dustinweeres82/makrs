'use client'

import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StepLayout } from './StepLayout'

type RowState = 'done' | 'active' | 'pending'
type CalcRow = { label: string; value: string; status: string }

type CalculatingStepProps = {
  materials: number
  labour: number
  overhead: number
  fees: number
  hourlyRate: number
  onDone: () => void
}

function StatusDot({ state }: { state: RowState }) {
  if (state === 'done') {
    return (
      <span className="w-[30px] h-[30px] rounded-full bg-pear flex items-center justify-center shrink-0">
        <Check size={16} className="text-pine" strokeWidth={3} />
      </span>
    )
  }
  if (state === 'active') {
    return (
      <span className="w-[30px] h-[30px] rounded-full border-2 border-poppy bg-white flex items-center justify-center shrink-0">
        <span className="w-2 h-2 rounded-full bg-poppy" />
      </span>
    )
  }
  return <span className="w-[30px] h-[30px] rounded-full border-2 border-pine/15 bg-white shrink-0" />
}

export function CalculatingStep({
  materials,
  labour,
  overhead,
  fees,
  hourlyRate,
  onDone,
}: CalculatingStepProps) {
  const [done, setDone] = useState(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const rows: CalcRow[] = [
    { label: 'Adding up your materials', value: `$${materials.toFixed(2)}`, status: "Materials first — that's the easy part." },
    { label: `Costing your time at $${hourlyRate}/hr`, value: `$${labour.toFixed(2)}`, status: 'Counting the hours you usually forget to charge for.' },
    { label: 'Spreading your monthly overhead', value: `$${overhead.toFixed(2)}`, status: 'Rent, tools, subscriptions — divided across what you make.' },
    { label: 'Adding marketplace + payment fees', value: `$${fees.toFixed(2)}`, status: 'The fees that quietly eat the rest.' },
    { label: 'Checking a healthy margin range', value: '50–75%', status: 'Almost there. Sanity-checking against the market.' },
  ]

  useEffect(() => {
    if (done >= rows.length) {
      const t = setTimeout(() => onDoneRef.current(), 700)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setDone((d) => d + 1), 900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  const pct = 70 + done * 5 // 70% → 95%

  const left = (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="w-6 h-6 rounded-full border-2 border-poppy border-t-transparent animate-spin" />
        <span className="type-third text-sm text-poppy">Crunching your numbers</span>
      </div>
      <h1 className="type-heading text-page">
        Doing the math<br />you&rsquo;ve been <span className="text-poppy">avoiding.</span>
      </h1>
      <p className="text-pine text-lg mt-4 max-w-sm">
        Hang tight — we&rsquo;re putting every number you gave us in its place.
      </p>
      <p className="type-tagline italic text-pine/50 text-sm mt-3">
        Usually about five seconds. Don&rsquo;t refresh.
      </p>
    </div>
  )

  const right = (
    <div className="rounded-[26px] bg-white border border-pine/10 shadow-pop p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="type-third text-sm">What we&rsquo;re working out</span>
        <span className="type-secondary text-sm text-pine/50">{Math.min(done, rows.length)}/5</span>
      </div>
      <div>
        {rows.map((r, i) => {
          const st: RowState = i < done ? 'done' : i === done ? 'active' : 'pending'
          return (
            <div key={r.label} className={cn('flex items-center gap-3 py-3.5', i > 0 && 'border-t border-pine/10')}>
              <StatusDot state={st} />
              <span className={cn('flex-1 text-base', st === 'pending' ? 'text-pine/40' : 'text-pine font-medium')}>
                {r.label}
              </span>
              <span
                className={cn(
                  'text-base shrink-0',
                  st === 'done' ? 'font-semibold text-pine' : st === 'active' ? 'text-pine/40 italic' : 'text-transparent',
                )}
              >
                {st === 'done' ? r.value : st === 'active' ? 'working…' : ''}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-5 rounded-2xl bg-salt px-4 py-3">
        <p className="type-body text-sm">{rows[Math.min(done, rows.length - 1)].status}</p>
      </div>
    </div>
  )

  return (
    <div className="w-full bg-white flex flex-col">
      <div className="px-6 md:px-8 pt-2">
        <p className="type-third text-xs text-poppy mb-3">Calculating…</p>
        <div className="h-2 rounded-pill overflow-hidden" style={{ backgroundColor: 'var(--slider-track)' }}>
          <div
            className="h-full rounded-pill bg-pear transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="px-6 md:px-8 pt-6 pb-8">
        <StepLayout left={left} right={right} />
      </div>
    </div>
  )
}

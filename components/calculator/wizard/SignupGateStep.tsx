'use client'

import { useEffect, useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { StepLayout } from './StepLayout'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type SignupGateStepProps = {
  retail: number
  cost: number
  marginPct: number
  wholesale: number
  email: string
  onEmailChange: (v: string) => void
  onSubmit: () => void
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="type-third text-[11px] text-pine/50">{label}</p>
      <p className="type-secondary text-lg text-pine mt-0.5">{value}</p>
    </div>
  )
}

function Revealed({
  retail,
  cost,
  marginPct,
  wholesale,
}: {
  retail: number
  cost: number
  marginPct: number
  wholesale: number
}) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 20)
    return () => clearTimeout(t)
  }, [])
  return (
    <div className={cn('transition-opacity duration-[450ms]', show ? 'opacity-100' : 'opacity-0')}>
      <StepLayout
        left={
          <div>
            <h1 className="type-heading text-page">
              Here&rsquo;s the math.<br /><span className="text-poppy">You&rsquo;re welcome.</span>
            </h1>
            <p className="text-pine text-lg mt-4 max-w-sm">
              A copy is on its way, with an editable link so you can tweak it whenever your
              supply costs move.
            </p>
          </div>
        }
        right={
          <div className="rounded-2xl p-8" style={{ backgroundColor: '#EFE8DB' }}>
            <p className="type-third text-sm text-pine/60">Your suggested retail</p>
            <p className="type-heading text-6xl text-poppy mt-1">${retail}</p>
            <div className="grid grid-cols-3 gap-4 mt-6 border-t border-pine/10 pt-5">
              <Stat label="Cost" value={`$${cost.toFixed(2)}`} />
              <Stat label="Margin" value={`${marginPct}%`} />
              <Stat label="Wholesale" value={`$${wholesale}`} />
            </div>
          </div>
        }
      />
    </div>
  )
}

export function SignupGateStep({
  retail,
  cost,
  marginPct,
  wholesale,
  email,
  onEmailChange,
  onSubmit,
}: SignupGateStepProps) {
  const [revealed, setRevealed] = useState(false)
  const [earlyAccess, setEarlyAccess] = useState(true)
  const valid = EMAIL_RE.test(email)

  function submit() {
    if (!valid) return
    onSubmit()
    setRevealed(true)
  }

  if (revealed) {
    return <Revealed retail={retail} cost={cost} marginPct={marginPct} wholesale={wholesale} />
  }

  const left = (
    <div>
      <span className="type-third text-xs text-pine bg-pear/50 rounded-pill px-3 py-1 inline-flex items-center gap-1.5">
        <Check size={13} strokeWidth={3} /> Math done
      </span>
      <h1 className="type-heading text-page mt-4">
        Your price is<br /><span className="text-poppy">ready.</span>
      </h1>
      <p className="text-pine text-lg mt-4 max-w-sm">
        Tell us where to send it and we&rsquo;ll unlock your number — plus the full breakdown,
        saved so you&rsquo;re not rebuilding it at 11pm the night before a market.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {[
          'Retail and wholesale price',
          'Full cost breakdown, PDF + editable link',
          'Early access when the full app opens',
        ].map((t) => (
          <li key={t} className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full bg-candy flex items-center justify-center shrink-0">
              <Check size={12} className="text-white" strokeWidth={3} />
            </span>
            <span className="type-body text-base text-pine">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  const right = (
    <div>
      {/* Locked price panel */}
      <div className="relative rounded-2xl overflow-hidden">
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: '#EFE8DB', filter: 'blur(9px)', opacity: 0.75 }}
          aria-hidden
        >
          <p className="type-third text-sm text-pine/60">Your suggested retail</p>
          <p className="type-heading text-5xl text-poppy mt-1">${retail}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 type-body text-sm">
            <span>Cost ${cost.toFixed(2)}</span>
            <span>Margin {marginPct}%</span>
            <span>Wholesale ${wholesale}</span>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span className="w-14 h-14 rounded-full bg-white shadow-card flex items-center justify-center">
            <Lock size={22} className="text-pine" strokeWidth={2} />
          </span>
          <span className="type-third text-xs text-pine/60">Locked for one second</span>
        </div>
      </div>

      {/* Email form */}
      <div className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="gate-email" className="type-third text-xs text-pine/50 block mb-1.5">
            Email
          </label>
          <input
            id="gate-email"
            type="email"
            placeholder="you@yourshop.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            className="w-full rounded-2xl border-2 border-[#E0E6E2] px-4 py-3 text-pine text-base outline-none focus:border-pine transition-colors font-sans"
          />
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={earlyAccess}
            onChange={(e) => setEarlyAccess(e.target.checked)}
            className="w-5 h-5 rounded accent-pear"
          />
          <span className="type-body text-sm">Yes, send me early access and the odd pricing tip</span>
        </label>
        <Button variant="primary" size="lg" withChevron className="w-full" disabled={!valid} onClick={submit}>
          Show me my price
        </Button>
        <p className="type-body text-xs italic text-pine/50">
          No spam, unsubscribe anytime. Your numbers stay yours.
        </p>
      </div>
    </div>
  )

  return <StepLayout left={left} right={right} />
}

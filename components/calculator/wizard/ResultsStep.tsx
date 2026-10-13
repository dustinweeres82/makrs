'use client'

import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/Slider'
import { CostDonut, type CostItem } from '@/components/calculator/CostDonut'
import { StepLayout } from './StepLayout'
import { Callout } from './Callout'

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className={cn(
        'w-12 h-7 rounded-full relative transition-colors shrink-0',
        on ? 'bg-pear' : 'bg-pine/20',
      )}
    >
      <span
        className={cn(
          'w-5 h-5 rounded-full bg-white absolute top-1 transition-all',
          on ? 'left-6' : 'left-1',
        )}
      />
    </button>
  )
}

function marginHint(pct: number) {
  if (pct < 30) return 'tight · under 30%'
  if (pct < 50) return 'okay · 30–50%'
  if (pct <= 75) return 'healthy 50–75%'
  return 'high · over 75%'
}

type ResultsStepProps = {
  items: CostItem[]
  totalCost: number
  retail: number
  marginPct: number
  onMarginChange: (n: number) => void
  wholesaleOn: boolean
  onWholesaleToggle: () => void
  wholesalePct: number
}

export function ResultsStep({
  items,
  totalCost,
  retail,
  marginPct,
  onMarginChange,
  wholesaleOn,
  onWholesaleToggle,
  wholesalePct,
}: ResultsStepProps) {
  const wholesaleRevenue = retail * (1 - wholesalePct / 100)
  const wholesaleProfit = wholesaleRevenue - totalCost
  const wholesaleThin = wholesaleOn && wholesaleProfit < totalCost * 0.25

  const left = (
    <div>
      <h1 className="type-heading text-page">
        Here&rsquo;s the math.<br />
        <span className="text-poppy">You&rsquo;re welcome.</span>
      </h1>
      <p className="type-body text-base mt-4 max-w-sm">
        Nudge the margin and everything updates live. This is your price, doing the work.
      </p>
    </div>
  )

  const right = (
    <div className="flex flex-col gap-6">
      {/* Donut + legend */}
      <div className="flex items-center gap-6">
        <CostDonut items={items} total={totalCost} size={140} stroke={16} />
        <div className="flex-1 flex flex-col gap-2.5">
          {items.map((it) => (
            <div key={it.label} className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: it.color }} />
              <span className="type-tagline text-base flex-1">{it.label}</span>
              <span className="type-secondary text-sm">${it.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Margin */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-lg font-bold text-pine">
            Margin <span className="ml-1">{marginPct}%</span>
          </span>
          <span className="type-body text-sm">{marginHint(marginPct)}</span>
        </div>
        <Slider value={marginPct} onChange={onMarginChange} min={0} max={90} fillColor="#CCD580" />
      </div>

      {/* Suggested retail */}
      <div className="flex items-center justify-between rounded-card bg-candy/30 px-6 py-5">
        <span className="type-third text-sm text-poppy/70">Suggested retail</span>
        <span className="type-heading text-5xl text-poppy">${Math.round(retail)}</span>
      </div>

      {/* Wholesale toggle */}
      <div className="flex items-center justify-between rounded-2xl bg-thistle/20 px-5 py-4">
        <span className="type-third text-sm normal-case tracking-normal text-pine">
          Wholesale · store keeps {wholesalePct}%
        </span>
        <Toggle on={wholesaleOn} onChange={onWholesaleToggle} />
      </div>

      {wholesaleThin && (
        <Callout tone="thistle" icon={<AlertCircle size={22} strokeWidth={2} />}>
          <strong className="font-bold text-pine">We caught this:</strong> at a {wholesalePct}%
          wholesale cut you&rsquo;d clear a hair over your cost. Doable, but thin. A safer floor:
          bump retail or your wage.
        </Callout>
      )}
    </div>
  )

  return <StepLayout left={left} right={right} />
}

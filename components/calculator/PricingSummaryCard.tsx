'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/Slider'
import { cn } from '@/lib/utils'

export type CostItem = { label: string; value: number; color: string }

const EXAMPLE_ITEMS: CostItem[] = [
  { label: 'Materials', value: 5.0,  color: '#F5A7BC' }, // candy
  { label: 'Labour',    value: 8.33, color: '#E8A820' }, // honey
  { label: 'Fees',      value: 4.75, color: '#CCD580' }, // pear
  { label: 'Overhead',  value: 4.0,  color: '#D6B2CA' }, // thistle
]

// ── Cost donut ───────────────────────────────────────────────────────────────

function CostDonut({ items, total }: { items: CostItem[]; total: number }) {
  const r = 54
  const cx = 70
  const cy = 70
  const circ = 2 * Math.PI * r
  let offset = -90

  return (
    <div className="relative w-[140px] h-[140px] shrink-0">
      <svg width={140} height={140}>
        {items.map((it) => {
          const pct = total > 0 ? it.value / total : 0
          const dash = circ * pct
          const rotation = offset
          offset += pct * 360
          return (
            <circle
              key={it.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={it.color}
              strokeWidth={18}
              strokeDasharray={`${dash} ${circ - dash}`}
              transform={`rotate(${rotation} ${cx} ${cy})`}
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="type-heading text-2xl text-pine">${total.toFixed(2)}</span>
        <span className="type-third text-[10px] text-pine/50 mt-0.5">Cost</span>
      </div>
    </div>
  )
}

// ── Summary card ─────────────────────────────────────────────────────────────

type PricingSummaryCardProps = {
  items?: CostItem[]
  initialMargin?: number
  /** Shows the small "EXAMPLE" badge + caption used on the marketing landing. */
  example?: boolean
  className?: string
}

export function PricingSummaryCard({
  items = EXAMPLE_ITEMS,
  initialMargin = 43,
  example = false,
  className,
}: PricingSummaryCardProps) {
  const [margin, setMargin] = useState(initialMargin)

  const total = items.reduce((sum, i) => sum + i.value, 0)
  const retail = Math.round(total / (1 - Math.min(margin, 95) / 100))

  return (
    <div
      className={cn('rounded-card p-6 shadow-card', className)}
      style={{ backgroundColor: '#EFE8DB' }}
    >
      {example && (
        <div className="flex items-center justify-between mb-5">
          <span className="type-third text-xs text-pine/70 bg-honey/40 rounded-pill px-3 py-1">
            Example
          </span>
          <span className="type-tagline text-sm italic text-pine/50">
            one real product, priced
          </span>
        </div>
      )}

      {/* Donut + legend */}
      <div className="flex items-center gap-6">
        <CostDonut items={items} total={total} />
        <div className="flex-1 flex flex-col gap-3">
          {items.map((it) => (
            <div key={it.label} className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: it.color }} />
              <span className="type-tagline text-lg flex-1">{it.label}</span>
              <span className="type-secondary text-base">${it.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Margin slider */}
      <div className="mt-6">
        <Slider
          label="Margin"
          value={margin}
          onChange={setMargin}
          min={0}
          max={90}
          suffix="%"
          minLabel="tight"
          maxLabel="healthy"
        />
      </div>

      {/* Suggested retail */}
      <div className="mt-6 flex items-center justify-between rounded-card bg-candy/30 px-6 py-5">
        <span className="type-third text-sm text-poppy/70">Suggested retail</span>
        <span className="type-heading text-4xl text-poppy">${retail}</span>
      </div>
    </div>
  )
}

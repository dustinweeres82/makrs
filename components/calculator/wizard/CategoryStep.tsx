'use client'

import { Droplet, Gem, Coffee, Shirt, Cookie, Palette, Asterisk } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StepLayout } from './StepLayout'

/** Hand-drawn candle to match the mockup (Lucide has no candle). */
function Candle({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="8.5" y="9" width="7" height="12" rx="1" />
      <path d="M12 9V6" />
      <path d="M12 2c1.4 1.3 1.4 2.7 0 4-1.4-1.3-1.4-2.7 0-4Z" />
    </svg>
  )
}

export type CategoryId =
  | 'soap' | 'jewelry' | 'candles' | 'pottery'
  | 'clothing' | 'food' | 'art' | 'other'

type Category = { id: CategoryId; label: string; icon: React.ReactNode }

const iconProps = { size: 26, strokeWidth: 2 as const }

export const CATEGORIES: Category[] = [
  { id: 'soap',     label: 'Soap & bath', icon: <Droplet {...iconProps} /> },
  { id: 'jewelry',  label: 'Jewelry',     icon: <Gem {...iconProps} /> },
  { id: 'candles',  label: 'Candles',     icon: <Candle /> },
  { id: 'pottery',  label: 'Pottery',     icon: <Coffee {...iconProps} /> },
  { id: 'clothing', label: 'Clothing',    icon: <Shirt {...iconProps} /> },
  { id: 'food',     label: 'Food',        icon: <Cookie {...iconProps} /> },
  { id: 'art',      label: 'Art',         icon: <Palette {...iconProps} /> },
  { id: 'other',    label: 'Other',       icon: <Asterisk {...iconProps} /> },
]

type CategoryStepProps = {
  value: CategoryId | null
  onChange: (id: CategoryId) => void
}

export function CategoryStep({ value, onChange }: CategoryStepProps) {
  const left = (
    <div>
      <h1 className="type-heading text-page">
        What do<br />you <span className="text-poppy">make?</span>
      </h1>
      <p className="type-body text-base mt-4 max-w-sm">
        Make more than one thing? Start with your main one. Nothing&rsquo;s locked, you
        can&rsquo;t break it.
      </p>
    </div>
  )

  const right = (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {CATEGORIES.map((c) => {
        const selected = value === c.id
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(c.id)}
            className={cn(
              'flex flex-col items-center justify-center gap-2.5 min-h-[128px] py-6 rounded-2xl border transition-colors',
              selected
                ? 'border-2 border-poppy bg-candy/20 text-poppy'
                : 'border border-pine/15 text-pine hover:border-pine/40',
            )}
          >
            {c.icon}
            <span className="type-third text-xs normal-case tracking-normal">{c.label}</span>
          </button>
        )
      })}
    </div>
  )

  return <StepLayout left={left} right={right} />
}

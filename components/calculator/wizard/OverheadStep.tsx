'use client'

import { Asterisk, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StepLayout } from './StepLayout'
import { BoxField, fieldInputCls, parseAmount } from './BoxField'
import { Callout } from './Callout'

function Preset({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean
  tone: 'cornflower' | 'thistle'
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'type-third text-xs px-4 py-2 rounded-pill transition-all',
        tone === 'cornflower' ? 'bg-cornflower/40' : 'bg-thistle/40',
        active ? 'ring-2 ring-pine/40' : 'opacity-80 hover:opacity-100',
      )}
    >
      {children}
    </button>
  )
}

type OverheadStepProps = {
  categoryLabel: string
  overhead: number
  onOverheadChange: (n: number) => void
  items: number
  onItemsChange: (n: number) => void
  presetTypical: number
  presetNoRent: number
}

export function OverheadStep({
  categoryLabel,
  overhead,
  onOverheadChange,
  items,
  onItemsChange,
  presetTypical,
  presetNoRent,
}: OverheadStepProps) {
  const perItem = items > 0 ? overhead / items : 0

  const left = (
    <div>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-3.5 h-3.5 rounded-full bg-thistle" />
        <span className="type-third text-sm">Overhead</span>
      </div>
      <h1 className="type-heading text-page">
        Rent, tools,<br />the invisible <span className="text-poppy">stuff.</span>
      </h1>
      <p className="type-body text-base mt-4 max-w-sm">
        Utilities, insurance, rent, and subscriptions. The costs that always get forgot,
        but eat into your profit.
      </p>
    </div>
  )

  const right = (
    <div className="flex flex-col gap-4">
      <Callout tone="thistle" icon={<Asterisk size={22} strokeWidth={2.5} />}>
        We started you at <strong className="font-bold text-pine">${overhead}</strong>, the
        average for a {categoryLabel} maker. Keep it as an estimate, or enter your own.
      </Callout>

      <BoxField label="Your monthly overhead">
        <div className="flex items-center gap-1.5">
          <span className="text-lg text-pine/50">$</span>
          <input
            className={fieldInputCls}
            inputMode="decimal"
            value={overhead}
            onChange={(e) => onOverheadChange(parseAmount(e.target.value))}
          />
        </div>
      </BoxField>

      <div className="flex gap-2.5">
        <Preset active={overhead === presetNoRent} tone="cornflower" onClick={() => onOverheadChange(presetNoRent)}>
          No studio rent
        </Preset>
        <Preset active={overhead === presetTypical} tone="thistle" onClick={() => onOverheadChange(presetTypical)}>
          Typical
        </Preset>
      </div>

      <BoxField label="Items you make per month">
        <input
          className={fieldInputCls}
          inputMode="numeric"
          value={items}
          onChange={(e) => onItemsChange(parseAmount(e.target.value))}
        />
      </BoxField>

      <Callout tone="pear" icon={<Check size={22} strokeWidth={3} />}>
        So that&rsquo;s <strong className="font-bold text-pine">${perItem.toFixed(2)}</strong> of
        overhead per item. Applied for you.
      </Callout>
    </div>
  )

  return <StepLayout left={left} right={right} />
}

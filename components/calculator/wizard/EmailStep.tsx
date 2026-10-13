'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CostDonut, type CostItem } from '@/components/calculator/CostDonut'
import { StepLayout } from './StepLayout'
import { BoxField, fieldInputCls } from './BoxField'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type EmailStepProps = {
  items: CostItem[]
  totalCost: number
  retail: number
  email: string
  onEmailChange: (v: string) => void
  onSave: () => void
}

export function EmailStep({ items, totalCost, retail, email, onEmailChange, onSave }: EmailStepProps) {
  const valid = EMAIL_RE.test(email)

  const left = (
    <div>
      <h1 className="type-heading text-page">
        Don&rsquo;t lose<br />this math<span className="text-poppy">.</span>
      </h1>
      <p className="type-body text-base mt-4 max-w-sm">
        Drop your email and we&rsquo;ll keep your{' '}
        <strong className="font-bold text-pine">${Math.round(retail)}</strong> pricing safe. So
        you&rsquo;re not rebuilding it at 11pm the night before a market.
      </p>
    </div>
  )

  const right = (
    <div className="flex flex-col gap-5">
      {/* Summary */}
      <div className="rounded-2xl p-5 flex items-center gap-5" style={{ backgroundColor: '#EFE8DB' }}>
        <CostDonut
          items={items}
          total={totalCost}
          size={84}
          stroke={12}
          centerContent={<Check size={22} className="text-pine" strokeWidth={3} />}
        />
        <div>
          <p className="type-third text-sm text-pine/60">Your suggested retail</p>
          <p className="type-heading text-4xl text-poppy">${Math.round(retail)}</p>
        </div>
      </div>

      {/* Email */}
      <BoxField label="Email">
        <input
          className={fieldInputCls}
          type="email"
          placeholder="you@yourshop.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </BoxField>

      <Button
        variant="primary"
        size="lg"
        withChevron
        className="w-full"
        disabled={!valid}
        onClick={onSave}
      >
        Save my pricing
      </Button>

      <div className="flex justify-center">
        <span className="type-third text-xs text-pine bg-cornflower/40 rounded-pill px-4 py-2">
          PDF + editable link
        </span>
      </div>

      <p className="type-body text-xs text-center text-pine/50">
        Just your price. No spam, unsubscribe anytime. Plus early access.
      </p>
    </div>
  )

  return <StepLayout left={left} right={right} />
}

'use client'

import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

type WizardFrameProps = {
  step: number
  totalSteps: number
  onBack?: () => void
  backLabel?: string
  /** Hide the step counter + progress bar (terminal screens). */
  showProgress?: boolean
  /** The primary "next" action, rendered at the bottom-right of the card. */
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function WizardFrame({
  step,
  totalSteps,
  onBack,
  backLabel = 'Back',
  showProgress = true,
  footer,
  children,
  className,
}: WizardFrameProps) {
  const pct = Math.round((step / totalSteps) * 100)

  return (
    <div className={cn('w-full bg-white flex flex-col', className)}>
      {/* Progress */}
      {showProgress && (
        <div className="px-6 md:px-8 pt-2">
          <p className="type-third text-xs text-pine/60 mb-3">Step {step} of {totalSteps}</p>
          <div className="h-2 rounded-pill overflow-hidden" style={{ backgroundColor: 'var(--slider-track)' }}>
            <div
              className="h-full rounded-pill bg-pear transition-[width] duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 px-6 md:px-8 pt-6 pb-2">{children}</div>

      {/* Footer — back (left) + next (right) */}
      {(footer || onBack) && (
        <div className="px-6 md:px-8 pt-6 pb-8 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="self-start md:self-auto inline-flex items-center gap-1.5 type-third text-sm text-pine/60 hover:text-pine transition-colors"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
              {backLabel}
            </button>
          ) : (
            <span className="hidden md:block" aria-hidden />
          )}
          {footer}
        </div>
      )}
    </div>
  )
}

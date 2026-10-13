'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type SliderProps = {
  /** Controlled value. Omit to let the slider manage its own state (uncontrolled). */
  value?: number
  /** Starting value when uncontrolled. */
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Label shown above the track. When set, the current value is shown on the right. */
  label?: string
  /** Appended to the displayed value, e.g. '%'. */
  suffix?: string
  /** Small captions under the track ends, e.g. 'tight' / 'healthy'. */
  minLabel?: string
  maxLabel?: string
  /** Fill colour of the filled portion. Defaults to Pear. */
  fillColor?: string
  className?: string
  name?: string
  id?: string
}

export function Slider({
  value,
  defaultValue = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  suffix = '',
  minLabel,
  maxLabel,
  fillColor = '#CCD580',
  className,
  name,
  id,
}: SliderProps) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const pct = ((current - min) / (max - min)) * 100

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = Number(e.target.value)
    if (value === undefined) setInternal(next)
    onChange?.(next)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="type-third text-sm">{label}</span>
          <span className="type-secondary text-base">{current}{suffix}</span>
        </div>
      )}
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={handleChange}
        name={name}
        id={id}
        aria-label={label}
        style={{
          background: `linear-gradient(to right, ${fillColor} ${pct}%, var(--slider-track) ${pct}%)`,
        }}
      />
      {(minLabel || maxLabel) && (
        <div className="flex items-center justify-between">
          <span className="type-body text-xs">{minLabel}</span>
          <span className="type-body text-xs">{maxLabel}</span>
        </div>
      )}
    </div>
  )
}

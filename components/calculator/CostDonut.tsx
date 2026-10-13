import { cn } from '@/lib/utils'

export type CostItem = { label: string; value: number; color: string }

type CostDonutProps = {
  items: CostItem[]
  total: number
  size?: number
  stroke?: number
  centerLabel?: string
  /** Overrides the center number/label (e.g. a check icon). */
  centerContent?: React.ReactNode
  className?: string
}

export function CostDonut({
  items,
  total,
  size = 140,
  stroke = 18,
  centerLabel = 'Cost',
  centerContent,
  className,
}: CostDonutProps) {
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const gap = total > 0 ? 4 : 0
  let offset = -90

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {items.map((it) => {
          const pct = total > 0 ? it.value / total : 0
          const dash = Math.max(circ * pct - gap, 0)
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
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ - dash}`}
              transform={`rotate(${rotation} ${cx} ${cy})`}
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {centerContent ?? (
          <>
            <span className="type-heading text-2xl text-pine">${total.toFixed(2)}</span>
            <span className="type-third text-[10px] text-pine/50 mt-0.5">{centerLabel}</span>
          </>
        )}
      </div>
    </div>
  )
}

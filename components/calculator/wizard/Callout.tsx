import { cn } from '@/lib/utils'

type Tone = 'thistle' | 'pear' | 'cornflower' | 'candy'

const toneBg: Record<Tone, string> = {
  thistle: 'bg-thistle/25',
  pear: 'bg-pear/25',
  cornflower: 'bg-cornflower/25',
  candy: 'bg-candy/25',
}

const toneCircle: Record<Tone, string> = {
  thistle: 'bg-thistle/70',
  pear: 'bg-pear/80',
  cornflower: 'bg-cornflower/70',
  candy: 'bg-candy/70',
}

/** Tinted note box with an icon disc — used for wizard hints/results. */
export function Callout({
  tone = 'thistle',
  icon,
  children,
  className,
}: {
  tone?: Tone
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-4 rounded-2xl px-4 py-4', toneBg[tone], className)}>
      <span
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-pine',
          toneCircle[tone],
        )}
      >
        {icon}
      </span>
      <p className="type-body text-sm text-pine">{children}</p>
    </div>
  )
}

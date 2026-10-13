import { cn } from '@/lib/utils'

/** A bordered field with the label sitting inside the top of the box. */
export function BoxField({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-pine/15 px-4 py-2.5 focus-within:border-pine transition-colors',
        className,
      )}
    >
      <span className="type-third text-[11px] text-pine/50 block mb-0.5">{label}</span>
      {children}
    </div>
  )
}

export const fieldInputCls =
  'w-full bg-transparent outline-none text-pine text-lg placeholder:text-pine/30 font-sans'

/** Strip currency symbols/spaces and coerce to a number. */
export function parseAmount(s: string) {
  return Number(String(s).replace(/[^0-9.]/g, '')) || 0
}

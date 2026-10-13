import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'pine' | 'pear'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Optional icon element (e.g. <ChevronRight />). Omit for a text-only button. */
  icon?: React.ReactNode
  /** Which side the icon sits on. Defaults to the trailing edge. */
  iconPosition?: 'left' | 'right'
  /** Shorthand for the brand trailing chevron — no need to import an icon. Ignored if `icon` is set. */
  withChevron?: boolean
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const variants: Record<ButtonVariant, string> = {
  // Primary CTA — Poppy, per brand board
  primary:   'bg-poppy text-salt hover:bg-poppy/90 shadow-card',
  // Outlined anchor action
  secondary: 'bg-transparent text-pine border-2 border-pine hover:bg-pine hover:text-salt',
  // Low-emphasis
  ghost:     'bg-transparent text-pine hover:bg-pine/[0.06]',
  // Dark solid
  pine:      'bg-pine text-salt hover:bg-pine/90 shadow-card',
  // Pear solid — pine text; used for the wizard "next" CTA
  pear:      'bg-pear text-pine hover:bg-pear/90 shadow-card',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'text-xs px-4 py-2 gap-1.5',
  md: 'text-sm px-6 py-3 gap-2',
  lg: 'text-base px-8 py-4 gap-2.5',
}

const chevronSize: Record<ButtonSize, number> = { sm: 16, md: 18, lg: 20 }

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  withChevron = false,
  className,
  children,
  ...props
}: ButtonProps) {
  // Explicit `icon` wins; otherwise `withChevron` supplies the brand chevron.
  const resolvedIcon =
    icon ?? (withChevron ? <ChevronRight size={chevronSize[size]} strokeWidth={2.5} /> : null)

  return (
    <button
      className={cn(
        // H3 role: Inter 600 · uppercase · pill
        'inline-flex items-center justify-center font-semibold uppercase tracking-[0.03em] rounded-pill',
        'transition-colors disabled:opacity-40 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {resolvedIcon && iconPosition === 'left' && <span className="shrink-0 flex items-center">{resolvedIcon}</span>}
      {children}
      {resolvedIcon && iconPosition === 'right' && <span className="shrink-0 flex items-center">{resolvedIcon}</span>}
    </button>
  )
}

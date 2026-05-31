import { cn } from '@/lib/utils'

type StatusVariant = 'healthy' | 'warning' | 'low' | 'error' | 'info'

const config: Record<StatusVariant, string> = {
  healthy: 'bg-pear/30 text-[#3B6D11] border-pear',
  warning: 'bg-honey/20 text-[#854F0B] border-honey',
  low:     'bg-poppy/10 text-poppy border-poppy/40',
  error:   'bg-poppy/10 text-poppy border-poppy/40',
  info:    'bg-cornflower/30 text-pine border-cornflower',
}

export function StatusBadge({ variant, label }: { variant: StatusVariant; label: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      config[variant]
    )}>
      {label}
    </span>
  )
}

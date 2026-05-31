import { cn } from '@/lib/utils'

type CardProps = {
  variant?: 'white' | 'salt' | 'highlighted'
  className?: string
  children: React.ReactNode
}

export function Card({ variant = 'white', className, children }: CardProps) {
  return (
    <div className={cn(
      'rounded-card p-5',
      variant === 'white'       && 'bg-white shadow-sm',
      variant === 'salt'        && 'bg-salt border border-pine/10',
      variant === 'highlighted' && 'bg-white border-2 border-poppy shadow-md',
      className
    )}>
      {children}
    </div>
  )
}

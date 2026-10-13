import { cn } from '@/lib/utils'

type InputProps = {
  label?: string
  hint?: string
  error?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function Input({ label, hint, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="type-third text-xs">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-pill bg-white px-5 py-3 text-sm text-pine placeholder:text-pine/40',
          'border transition-colors',
          error
            ? 'border-poppy focus-visible:outline-poppy'
            : 'border-pine/15 focus-visible:border-pine',
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-poppy">{error}</p>
      ) : hint ? (
        <p className="type-body text-xs">{hint}</p>
      ) : null}
    </div>
  )
}

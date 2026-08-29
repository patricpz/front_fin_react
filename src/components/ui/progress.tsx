import * as React from 'react'

import { cn } from '@/lib/utils'

function Progress({ className, value, ...props }: React.ComponentProps<'div'> & { value?: number }) {
  return (
    <div
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value ?? 0))}%` }}
      />
    </div>
  )
}

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('animate-pulse rounded-xl bg-muted', className)} {...props} />
}

export { Progress, Skeleton }

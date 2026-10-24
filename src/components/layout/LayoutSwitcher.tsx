import { Monitor, Smartphone, Sparkles } from 'lucide-react'

import { useLayout, type LayoutMode } from '@/hooks/useLayout'
import { cn } from '@/lib/utils'

interface LayoutSwitcherProps {
  className?: string
  compact?: boolean
}

const modes: Array<{ id: LayoutMode; label: string; icon: typeof Smartphone }> = [
  { id: 'auto', label: 'Auto', icon: Sparkles },
  { id: 'web', label: 'Web', icon: Monitor },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
]

export function LayoutSwitcher({ className, compact = false }: LayoutSwitcherProps) {
  const { mode, setMode } = useLayout()

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-xl border bg-muted/50 p-1 text-xs',
        className,
      )}
      role="group"
      aria-label="Alternar layout"
    >
      {modes.map((item) => {
        const Icon = item.icon
        const isActive = mode === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            title={`Modo ${item.label}`}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all cursor-pointer',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="size-3.5" />
            {!compact && <span>{item.label}</span>}
          </button>
        )
      })}
    </div>
  )
}

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  isLoading?: boolean
  variant?: 'default' | 'destructive'
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  isLoading,
  variant = 'default',
}: AlertDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Fechar"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'relative w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl',
          'animate-in fade-in slide-in-from-bottom-4 duration-200',
        )}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Aguarde...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

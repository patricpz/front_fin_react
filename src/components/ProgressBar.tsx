interface ProgressBarProps {
  value: number // 0 a 100
  label: string // para leitores de tela
  tone?: 'default' | 'success' | 'danger'
}

export function ProgressBar({ value, label, tone = 'default' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)))
  const color = {
    default: 'bg-blue-600',
    success: 'bg-emerald-600',
    danger: 'bg-red-600',
  }[tone]

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ease-out ${color}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

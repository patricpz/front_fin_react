import { formatBRL, toNumber } from '@/lib/money'
import { formatShortDate } from '@/lib/dates'
import { ProgressBar } from '@/components/ProgressBar'
import type { Installment } from '@/types'

interface InstallmentCardProps {
  item: Installment
  onPay: (id: string) => void
}

export function InstallmentCard({ item, onPay }: InstallmentCardProps) {
  const done = item.is_completed

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">{item.description}</h3>
          <p className="text-sm text-slate-500">
            {formatBRL(item.installment_amount)} por parcela · {item.installment_count}x
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            done ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
          }`}
        >
          {done ? 'Concluída' : `${item.progress_percent}% · ${item.paid_installments}/${item.installment_count}`}
        </span>
      </header>

      <div className="mt-4">
        <ProgressBar
          value={typeof item.progress_percent === 'number' ? item.progress_percent : toNumber(item.progress_percent)}
          tone={done ? 'success' : 'default'}
          label={`${item.description}: ${item.paid_installments} de ${item.installment_count} parcelas pagas`}
        />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <dt className="text-slate-500">Pago</dt>
          <dd className="font-medium text-slate-900">{formatBRL(item.paid_amount)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Restante</dt>
          <dd className="font-medium text-slate-900">{formatBRL(item.remaining_amount)}</dd>
        </div>
      </dl>

      {!done && item.next_due_date && (
        <p className="mt-3 text-sm text-slate-600">
          Próxima parcela: <span className="font-medium">{formatShortDate(item.next_due_date)}</span>
        </p>
      )}

      {!done && (
        <button
          onClick={() => onPay(item.id)}
          className="mt-4 h-11 w-full rounded-xl bg-blue-600 font-semibold text-white active:scale-[0.99]"
        >
          Registrar pagamento de parcela
        </button>
      )}
    </article>
  )
}

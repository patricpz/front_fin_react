import { useInstallments, usePayInstallment } from '@/features/installments/hooks'
import { InstallmentCard } from '@/features/installments/InstallmentCard'

export function InstallmentList() {
  const { data: installments = [], isLoading, isError } = useInstallments()
  const { mutate: payInstallment } = usePayInstallment()

  if (isLoading) {
    return <p className="text-sm text-slate-500">Carregando parcelas...</p>
  }

  if (isError) {
    return <p className="text-sm text-red-600">Não foi possível carregar as parcelas.</p>
  }

  if (installments.length === 0) {
    return <p className="text-sm text-slate-500">Nenhuma despesa parcelada por enquanto.</p>
  }

  return (
    <div className="space-y-4">
      {installments.map((item) => (
        <InstallmentCard
          key={item.id}
          item={item}
          onPay={(id) => payInstallment(id)}
        />
      ))}
    </div>
  )
}

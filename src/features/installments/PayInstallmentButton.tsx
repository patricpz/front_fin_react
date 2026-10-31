import { usePayInstallment } from '@/features/installments/hooks'

export function PayInstallmentButton({ installmentId }: { installmentId: string }) {
  const { mutate: payInstallment, isPending } = usePayInstallment()

  return (
    <button
      onClick={() => payInstallment(installmentId)}
      disabled={isPending}
      className="mt-4 h-11 w-full rounded-xl bg-blue-600 font-semibold text-white active:scale-[0.99] disabled:opacity-50"
    >
      {isPending ? 'Processando...' : 'Registrar pagamento de parcela'}
    </button>
  )
}

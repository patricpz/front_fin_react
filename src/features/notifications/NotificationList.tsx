import { useNotifications } from '@/features/notifications/hooks'
import { NotificationItem } from '@/features/notifications/NotificationItem'

export function NotificationList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useNotifications()

  if (isLoading) {
    return <p className="px-4 py-8 text-center text-slate-500">Carregando...</p>
  }

  if (isError) {
    return <p className="px-4 py-8 text-center text-red-600">Não foi possível carregar os alertas.</p>
  }

  const items = data?.pages.flatMap((p) => p.items) ?? []

  if (items.length === 0) {
    return <p className="px-4 py-8 text-center text-slate-500">Nenhum alerta por enquanto.</p>
  }

  return (
    <div className="divide-y divide-slate-100">
      {items.map((item) => (
        <NotificationItem key={item.id} item={item} />
      ))}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full py-4 text-sm text-blue-600 hover:bg-slate-50"
        >
          {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}
    </div>
  )
}
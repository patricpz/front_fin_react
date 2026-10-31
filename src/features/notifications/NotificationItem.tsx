import { useMarkRead, useFeedback } from '@/features/notifications/hooks'
import { formatRelative } from '@/lib/dates'
import type { NotificationItem as NotificationItemType, FeedbackAction } from '@/types'

interface NotificationItemProps {
  item: NotificationItemType
}

export function NotificationItem({ item }: NotificationItemProps) {
  const { mutate: markRead } = useMarkRead()
  const { mutate: sendFeedback } = useFeedback()

  const handleClick = () => {
    if (item.status !== 'unread') return
    markRead(item.id)
    sendFeedback({ id: item.id, action: 'opened' })
    if (item.payload?.url) {
      window.location.href = String(item.payload.url)
    }
  }

  const handleFeedback = (action: FeedbackAction) => {
    sendFeedback({ id: item.id, action })
  }

  return (
    <div
      className={`flex flex-col p-4 ${item.status === 'unread' ? 'bg-blue-50' : ''}`}
      onClick={handleClick}
    >
      <h4 className="text-base font-semibold text-slate-900">{item.title}</h4>
      <p className="text-sm text-slate-600 mt-1">{item.body}</p>
      <div className="mt-2 flex items-center gap-3">
        {item.status === 'unread' && (
          <span className="h-2 w-1 rounded-full bg-red-500" aria-label="Não lida" />
        )}
        <span className="text-xs text-slate-400">{formatRelative(item.created_at)}</span>
      </div>
      <FeedbackButtons onFeedback={handleFeedback} />
    </div>
  )
}

interface FeedbackButtonsProps {
  onFeedback: (action: FeedbackAction) => void
}

function FeedbackButtons({ onFeedback }: FeedbackButtonsProps) {
  return (
    <div className="flex items-center justify-end gap-1 mt-2 flex-wrap">
      <button
        type="button"
        aria-label="Ajudou"
        onClick={() => onFeedback('helpful')}
        className="h-8 min-w-[44px] text-xs px-2 py-1 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 rounded"
      >
        Útil
      </button>
      <button
        type="button"
        aria-label="Não ajudou"
        onClick={() => onFeedback('not_helpful')}
        className="h-8 min-w-[44px] text-xs px-2 py-1 text-slate-500 hover:bg-red-50 hover:text-red-700 rounded"
      >
        Não útil
      </button>
      <button
        type="button"
        aria-label="Dispensar"
        onClick={() => onFeedback('dismissed')}
        className="h-8 min-w-[44px] text-xs px-2 py-1 text-slate-500 hover:bg-slate-80 hover:text-slate-800 rounded"
      >
        Dispensar
      </button>
    </div>
  )
}
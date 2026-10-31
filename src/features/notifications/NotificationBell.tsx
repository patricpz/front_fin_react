import { useUnreadCount } from '@/features/notifications/hooks'
import { useNotificationStore } from '@/store/notificationStore'

export function NotificationBell() {
  const { data: unreadCount = 0 } = useUnreadCount()
  const openPanel = useNotificationStore((state) => state.openPanel)

  const countNum = Number(unreadCount)
  const count = countNum > 9 ? '9+' : String(countNum)
  const label = `Notificações${countNum > 0 ? `, ${countNum} não lidas` : ''}`

  return (
    <button
      type="button"
      onClick={openPanel}
      aria-label={label}
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-slate-600 active:bg-slate-100"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {typeof unreadCount === 'number' && unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  )
}

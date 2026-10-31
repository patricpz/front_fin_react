import { useState } from 'react'
import { useMarkAllRead, usePreferences } from '@/features/notifications/hooks'
import { NotificationList } from '@/features/notifications/NotificationList'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { mutate: markAllRead } = useMarkAllRead()
  const { data: prefs } = usePreferences()
  const [showPrefs, setShowPrefs] = useState(false)

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white md:w-96 md:ml-auto md:h-full md:max-w-sm lg:w-96 shadow-xl transition-transform duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Painel de notificações"
    >
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sticky top-0 bg-white z-10">
        <h2 className="text-lg font-semibold text-slate-900">Alertas</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPrefs(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            Preferências
          </button>
          <button
            type="button"
            onClick={() => markAllRead()}
            className="text-sm text-blue-600 hover:underline"
          >
            Marcar todas
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="p-1 text-slate-500 hover:text-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <NotificationList />
      </div>

      {showPrefs && (
        <NotificationPreferencesDialog onClose={() => setShowPrefs(false)} prefs={prefs} />
      )}
    </div>
  )
}

interface NotificationPreferencesDialogProps {
  onClose: () => void
  prefs: ReturnType<typeof usePreferences>['data']
}

function NotificationPreferencesDialog({ onClose, prefs }: NotificationPreferencesDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-4 sm:items-center sm:justify-center sm:p-0" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-4 shadow-xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">Preferências de Notificação</h3>
        {prefs ? (
          <div className="space-y-3 text-sm text-slate-600">
            <p>Canal in-app: {prefs.channel_in_app ? 'Ativado' : 'Desativado'}</p>
            <p>Push: {prefs.channel_push ? 'Ativado' : 'Desativado'}</p>
            <p>Sensibilidade: {prefs.sensitivity}</p>
            <p>Limite diário: {prefs.daily_limit} notificações</p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Carregando preferências...</p>
        )}
        <button onClick={onClose} className="mt-4 w-full h-11 rounded-xl bg-slate-100 font-medium text-slate-900">
          Fechar
        </button>
      </div>
    </div>
  )
}

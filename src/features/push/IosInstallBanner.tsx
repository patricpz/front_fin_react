export function IosInstallBanner({ onDismiss }: { onDismiss: () => void }) {
  const STORAGE_KEY = 'ios-install-banner-dismissed'
  const DISMISS_DAYS = 7

  const isDismissed = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return false
    const dismissedAt = Number(stored)
    return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000
  }

  if (isDismissed()) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] animate-slide-up"
      role="dialog"
      aria-label="Como instalar no iPhone"
    >
      <div className="mx-auto max-w-md rounded-2xl bg-white p-4 shadow-xl border border-slate-200">
        <p className="text-sm text-slate-600 mb-3">
          Para receber alertas no iPhone, toque em <strong>Compartilhar</strong> e depois em <strong>Adicionar à Tela de Início</strong>.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, String(Date.now()))
              onDismiss()
            }}
            aria-label="Fechar"
            className="h-8 px-3 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  )
}
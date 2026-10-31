import { usePushPermission } from '@/features/push/usePushPermission'
import { subscribeToPush } from '@/features/push/subscribe'
import { IosInstallBanner } from '@/features/push/IosInstallBanner'
import { useState } from 'react'

export function ActivateAlertsButton() {
  const { status, isStandalone, isIOS, requestPermission } = usePushPermission()
  const [showIosBanner, setShowIosBanner] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleClick = async () => {
    if (status === 'unsupported') {
      alert('Navegador não suporta notificações push.')
      return
    }

    if (isIOS && !isStandalone) {
      setShowIosBanner(true)
      return
    }

    const permission = await requestPermission()
    if (permission === 'granted') {
      setIsSubscribing(true)
      try {
        await subscribeToPush()
        alert('Alertas ativados com sucesso!')
      } catch (e) {
        console.error(e)
        alert('Não foi possível ativar os alertas. Tente novamente.')
      } finally {
        setIsSubscribing(false)
      }
    }
  }

  if (status === 'granted') {
    return (
      <button
        type="button"
        disabled
        className="h-11 w-full rounded-xl bg-emerald-100 text-emerald-700 font-semibold text-white"
      >
        Alertas ativados
      </button>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isSubscribing}
        className="h-11 w-full rounded-xl bg-blue-600 font-semibold text-white active:scale-[0.99] disabled:opacity-50"
      >
        {isSubscribing ? 'Ativando...' : 'Ativar alertas'}
      </button>
      {showIosBanner && <IosInstallBanner onDismiss={() => setShowIosBanner(false)} />}
    </>
  )
}
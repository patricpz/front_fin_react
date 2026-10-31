import { useState, useEffect } from 'react'

export type PushPermissionStatus = 'unsupported' | 'default' | 'granted' | 'denied'

interface UsePushPermissionReturn {
  status: PushPermissionStatus
  isStandalone: boolean
  isIOS: boolean
  requestPermission: () => Promise<NotificationPermission>
}

export function usePushPermission(): UsePushPermissionReturn {
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const [status, setStatus] = useState<PushPermissionStatus>('default')

  useEffect(() => {
    if (!('Notification' in window)) {
      setStatus('unsupported')
      return
    }
    setStatus(Notification.permission)
  }, [])

  const requestPermission = async () => {
    if (!('Notification' in window)) return 'denied'
    const permission = await Notification.requestPermission()
    setStatus(permission)
    return permission
  }

  return { status, isStandalone, isIOS, requestPermission }
}
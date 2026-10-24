import { useLayout } from '@/hooks/useLayout'
import { MobileLayout } from '@/layouts/MobileLayout'
import { WebLayout } from '@/layouts/WebLayout'

export function MainLayout() {
  const { activeLayout } = useLayout()

  if (activeLayout === 'web') {
    return <WebLayout />
  }

  return <MobileLayout />
}

export { MobileLayout } from '@/layouts/MobileLayout'
export { WebLayout } from '@/layouts/WebLayout'

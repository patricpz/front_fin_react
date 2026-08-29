import { Outlet } from 'react-router-dom'

import { BottomNav } from '@/components/layout/BottomNav'

export function MainLayout() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <Outlet />
      <BottomNav />
    </div>
  )
}

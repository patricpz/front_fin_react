import { Outlet } from 'react-router-dom'

import { BottomNav } from '@/components/layout/BottomNav'
import { LayoutSwitcher } from '@/components/layout/LayoutSwitcher'
import { useLayout } from '@/hooks/useLayout'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children?: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const { isDesktop, mode } = useLayout()
  const isForcedMobileOnDesktop = isDesktop && mode === 'mobile'

  return (
    <div
      className={cn(
        'min-h-dvh bg-background',
        isForcedMobileOnDesktop && 'flex min-h-screen items-center justify-center bg-muted/40 p-4',
      )}
    >
      <div
        className={cn(
          'w-full min-h-dvh pb-24 relative bg-background',
          isForcedMobileOnDesktop &&
            'max-w-sm rounded-[36px] border-4 border-muted shadow-2xl overflow-hidden min-h-[820px] max-h-[92vh] flex flex-col',
        )}
      >
        {/* Floating switcher for desktop preview */}
        {isDesktop && (
          <div className="sticky top-2 z-50 flex justify-center px-4 pt-2">
            <LayoutSwitcher className="shadow-md" />
          </div>
        )}

        <div className={cn(isForcedMobileOnDesktop && 'flex-1 overflow-y-auto')}>
          {children ?? <Outlet />}
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

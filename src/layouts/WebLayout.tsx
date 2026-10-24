import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components/layout/Sidebar'
import { WebHeader } from '@/components/layout/WebHeader'

interface WebLayoutProps {
  children?: React.ReactNode
}

export function WebLayout({ children }: WebLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Fixed Desktop Sidebar */}
      <Sidebar className="fixed inset-y-0 left-0 z-40 hidden md:flex" />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:pl-64">
        <WebHeader />
        <main className="flex-1 px-6 py-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  )
}

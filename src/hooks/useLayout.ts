import { useEffect, useState } from 'react'

import { useLayoutStore, type LayoutMode } from '@/store/layoutStore'

export function useLayout() {
  const mode = useLayoutStore((state) => state.mode)
  const setMode = useLayoutStore((state) => state.setMode)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth >= 768
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches)
    }

    setIsDesktop(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const activeLayout: 'mobile' | 'web' =
    mode === 'auto' ? (isDesktop ? 'web' : 'mobile') : mode

  return {
    mode,
    setMode,
    isDesktop,
    activeLayout,
    isWeb: activeLayout === 'web',
    isMobile: activeLayout === 'mobile',
  }
}

export type { LayoutMode }

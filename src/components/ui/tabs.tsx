'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsProps {
  defaultValue: string
  className?: string
  children: React.ReactNode
  onValueChange?: (value: string) => void
}

export function Tabs({ defaultValue, className, children, onValueChange }: TabsProps) {
  const [value, setValue] = React.useState(defaultValue)

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div className={cn(className)}>
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
        {children}
      </TabsContext.Provider>
    </div>
  )
}

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
} | null>(null)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

interface TabsListProps {
  className?: string
  children: React.ReactNode
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500',
        className,
      )}
      role="tablist"
      aria-orientation="horizontal"
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  className?: string
  children: React.ReactNode
  disabled?: boolean
}

export function TabsTrigger({ value, className, children, disabled }: TabsTriggerProps) {
  const { value: currentValue, onValueChange } = useTabsContext()

  return (
    <button
      role="tab"
      aria-selected={currentValue === value}
      aria-controls={`tabs-${value}-panel`}
      id={`tabs-${value}-trigger`}
      data-state={currentValue === value ? 'active' : 'inactive'}
      data-disabled={disabled}
      disabled={disabled}
      onClick={() => !disabled && onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        currentValue === value
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-500 hover:text-slate-900',
        className,
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const { value: currentValue } = useTabsContext()

  if (currentValue !== value) return null

  return (
    <div
      role="tabpanel"
      id={`tabs-${value}-panel`}
      aria-labelledby={`tabs-${value}-trigger`}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      {children}
    </div>
  )
}
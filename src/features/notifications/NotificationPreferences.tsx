import { usePreferences, useUpdatePreferences } from '@/features/notifications/hooks'
import type { NotificationPreferences, NotificationType } from '@/types'
import { useState } from 'react'

export function NotificationPreferences() {
  const { data: prefs, isLoading } = usePreferences()
  const { mutate: updatePrefs } = useUpdatePreferences()
  const [localPrefs, setLocalPrefs] = useState<NotificationPreferences>({
    ...prefs,
    enabled_types: prefs?.enabled_types ?? [],
    channel_in_app: prefs?.channel_in_app ?? true,
    channel_push: prefs?.channel_push ?? true,
    sensitivity: prefs?.sensitivity ?? 'medium',
    daily_limit: prefs?.daily_limit ?? 10,
    quiet_hours_start: prefs?.quiet_hours_start ?? null,
    quiet_hours_end: prefs?.quiet_hours_end ?? null,
    timezone: prefs?.timezone ?? 'America/Sao_Paulo',
  })

  if (isLoading || !prefs) {
    return <p className="text-sm text-slate-500">Carregando preferências...</p>
  }

  const handleChange = (key: keyof NotificationPreferences, value: unknown) => {
    const next = { ...localPrefs, [key]: value }
    setLocalPrefs(next)
    updatePrefs(next as NotificationPreferences)
  }

  return (
    <div className="space-y-4">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">Tipos de alerta</h3>
        <div className="grid grid-cols-2 gap-2">
          {(['overspending', 'spending_spike', 'installment_due', 'tip', 'summary'] as NotificationType[]).map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={localPrefs?.enabled_types.includes(type) ?? false}
                onChange={(e) => {
                  const types = localPrefs?.enabled_types.filter((t) => t !== type) ?? []
                  if (e.target.checked) types.push(type)
                  handleChange('enabled_types', types)
                }}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="capitalize">{type.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3 border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-900">Canais</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={localPrefs?.channel_in_app ?? true}
              onChange={(e) => handleChange('channel_in_app', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            In-app
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={localPrefs?.channel_push ?? true}
              onChange={(e) => handleChange('channel_push', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Push
          </label>
        </div>
      </section>

      <section className="space-y-3 border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-900">Sensibilidade</h3>
        <div className="flex gap-4">
          {(['low', 'medium', 'high'] as const).map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="sensitivity"
                value={s}
                checked={localPrefs?.sensitivity === s}
                onChange={() => handleChange('sensitivity', s)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="capitalize">{s}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3 border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-900">Horário silencioso</h3>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-sm">
            <span className="block text-slate-600">Início</span>
            <input
              type="time"
              value={localPrefs?.quiet_hours_start ?? ''}
              onChange={(e) => handleChange('quiet_hours_start', e.target.value || null)}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600">Fim</span>
            <input
              type="time"
              value={localPrefs?.quiet_hours_end ?? ''}
              onChange={(e) => handleChange('quiet_hours_end', e.target.value || null)}
              className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm"
            />
          </label>
        </div>
      </section>

      <section className="border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-900">Limite diário</h3>
        <input
          type="number"
          min="1"
          max="100"
          value={localPrefs?.daily_limit ?? 10}
          onChange={(e) => handleChange('daily_limit', Number(e.target.value))}
          className="mt-1 w-full max-w-xs rounded border border-slate-300 px-2 py-1 text-sm"
        />
      </section>
    </div>
  )
}
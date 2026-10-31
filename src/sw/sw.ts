/// <reference types="vite-plugin-pwa" />
/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope & {
  clients: Clients
  __WB_MANIFEST: unknown[]
}

self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Novo alerta', {
      body: data.body,
      tag: data.tag,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      data: { url: data.url ?? '/' },
    })
  )
})

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients: readonly WindowClient[]) => {
      const existing = clients.find((c: WindowClient) => 'focus' in c)
      if (existing) return (existing.focus() as Promise<WindowClient>).then((c: WindowClient) => c.navigate(url))
      return self.clients.openWindow(url)
    })
  )
})

// Workbox injects the manifest here
self.__WB_MANIFEST

export {}
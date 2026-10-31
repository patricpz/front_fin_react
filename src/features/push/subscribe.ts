import { fetchPushPublicKey, subscribePush } from '@/services/financeApi'

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const pad = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + pad).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

export async function subscribeToPush(): Promise<void> {
  const reg = await navigator.serviceWorker.ready
  const publicKey = await fetchPushPublicKey()
  if (!publicKey) throw new Error('Chave pública VAPID não disponível')
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey).buffer as ArrayBuffer,
  })
  await subscribePush(sub.toJSON())
}

export { urlBase64ToUint8Array }
export const crypto = {
  randomUUID(): string {
    return globalThis.crypto.randomUUID()
  },
}
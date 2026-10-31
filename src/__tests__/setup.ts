import '@testing-library/jest-dom/vitest'

// mock do localStorage para testes SSR-like
beforeEach(() => {
  localStorage.clear()
})

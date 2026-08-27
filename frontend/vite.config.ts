import type { ServerResponse } from 'node:http'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const PLAN_API_TIMEOUT_MS = 180000

function canWriteProxyError(res: unknown): res is ServerResponse {
  return (
    typeof res === 'object' &&
    res !== null &&
    'writeHead' in res &&
    'headersSent' in res &&
    res.headersSent === false
  )
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        timeout: PLAN_API_TIMEOUT_MS,
        proxyTimeout: PLAN_API_TIMEOUT_MS,
        configure: (proxy) => {
          proxy.on('error', (_error, _request, res) => {
            if (!canWriteProxyError(res)) {
              return
            }

            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Plan API is not running' }))
          })
        },
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        gallery: fileURLToPath(
          new URL('./gallery-page/index.html', import.meta.url),
        ),
      },
    },
  },
})

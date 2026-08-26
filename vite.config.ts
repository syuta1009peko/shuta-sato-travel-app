import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { vitePlanPlugin } from './server/vitePlanPlugin.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  if (env.GOOGLE_APPLICATION_CREDENTIALS) {
    process.env.GOOGLE_APPLICATION_CREDENTIALS =
      env.GOOGLE_APPLICATION_CREDENTIALS
  }

  if (env.GOOGLE_CLOUD_PROJECT) {
    process.env.GOOGLE_CLOUD_PROJECT = env.GOOGLE_CLOUD_PROJECT
  }

  if (env.GOOGLE_CLOUD_LOCATION) {
    process.env.GOOGLE_CLOUD_LOCATION = env.GOOGLE_CLOUD_LOCATION
  }

  return {
    plugins: [react(), tailwindcss(), vitePlanPlugin()],
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
  }
})

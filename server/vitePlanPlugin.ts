import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { isAppLocale } from '../src/i18n/locale.ts'
import { getUi } from '../src/i18n/ui.ts'
import { buildDayPlanWithGemini, isPlanRequest } from './geminiPlan.ts'

function readJsonBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []

    request.on('data', (chunk: Buffer) => {
      chunks.push(chunk)
    })

    request.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (raw.trim() === '') {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(raw) as unknown)
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })

    request.on('error', reject)
  })
}

function sendJson(
  response: ServerResponse,
  statusCode: number,
  payload: unknown,
): void {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

function localeFromUnknown(value: unknown): 'ja' | 'en' | 'vi' {
  if (typeof value !== 'object' || value === null) {
    return 'ja'
  }

  if (!('locale' in value)) {
    return 'ja'
  }

  const locale = value.locale
  if (typeof locale === 'string' && isAppLocale(locale)) {
    return locale
  }

  return 'ja'
}

export function vitePlanPlugin(): Plugin {
  return {
    name: 'vite-plan-api',
    configureServer(server) {
      server.middlewares.use('/api/plan', (request, response, next) => {
        if (request.method !== 'POST') {
          next()
          return
        }

        void (async () => {
          let locale: 'ja' | 'en' | 'vi' = 'ja'
          try {
            const body = await readJsonBody(request)
            locale = localeFromUnknown(body)
            const ui = getUi(locale)
            if (!isPlanRequest(body)) {
              sendJson(response, 400, {
                error: ui.errorInvalidInput,
              })
              return
            }

            const plan = await buildDayPlanWithGemini(
              body.traveler,
              body.regenerate === true,
              body.locale ?? locale,
            )
            sendJson(response, 200, plan)
          } catch (caught) {
            const ui = getUi(locale)
            const message =
              caught instanceof Error ? caught.message : ui.errorPlanFailed
            sendJson(response, 500, { error: message })
          }
        })()
      })
    },
  }
}

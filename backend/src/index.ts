import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import express from 'express'
import { isCityId } from '../../frontend/src/constants/options.ts'
import { isAppLocale } from '../../frontend/src/i18n/locale.ts'
import { getUi } from '../../frontend/src/i18n/ui.ts'
import { buildDayPlanWithGemini, isPlanRequest ,loadCityData} from './geminiPlan.ts'
import { appendPlanLog, httpPlanLog, toEnglishLogError } from './planLog.ts'

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
)

dotenv.config({ path: path.join(REPO_ROOT, '.env') })

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

const app = express()
app.use(express.json())

app.post('/api/plan', async (request, response) => {
  let locale: 'ja' | 'en' | 'vi' = 'ja'

  try {
    const body: unknown = request.body
    locale = localeFromUnknown(body)
    const ui = getUi(locale)

    if (!isPlanRequest(body)) {
      await appendPlanLog(httpPlanLog(400, getUi('en').errorInvalidInput))
      response.status(400).json({ error: ui.errorInvalidInput })
      return
    }

    const plan = await buildDayPlanWithGemini(
      body.traveler,
      body.regenerate === true,
      body.locale ?? locale,
    )
    response.status(200).json(plan)
  } catch (caught) {
    const ui = getUi(locale)
    const message =
      caught instanceof Error ? caught.message : ui.errorPlanFailed
    await appendPlanLog(httpPlanLog(500, toEnglishLogError(message)))
    response.status(500).json({ error: message })
  }
})
app.get('/api/cities/:cityId', (request, response) => {
    const cityId = request.params.cityId
  
    if (!isCityId(cityId)) {
      response.status(404).json({ error: 'Unknown city' })
      return
    }
  
    try {
      const city = loadCityData(cityId)
      response.status(200).json(city)
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : 'Failed to load city'
      response.status(500).json({ error: message })
    }
  })
app.listen(3001, () => {
  console.log('API listening on http://localhost:3001')
})
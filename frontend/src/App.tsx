import { useEffect, useMemo, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import CssBaseline from '@mui/material/CssBaseline'
import Stack from '@mui/material/Stack'
import { ThemeProvider } from '@mui/material/styles'
import { fetchDayPlan } from './api/fetchPlan'
import { Header } from './components/Header/Header'
import { TravelPlan } from './components/TravelPlan/TravelPlan'
import { TravelerForm } from './components/TravelerForm/TravelerForm'
import { LocaleContext } from './i18n/LocaleContext'
import { LOCALE_STORAGE_KEY, type AppLocale } from './i18n/locale'
import { readStoredLocale } from './i18n/browserLocale'
import { getUi } from './i18n/ui'
import { createCityTheme } from './theme/muiTheme'
import type { DayPlan } from './types/plan'
import type { CityId } from './types/place'
import type { Traveler } from './types/traveler'
import './App.scss'

function App() {
  const [locale, setLocale] = useState<AppLocale>(readStoredLocale)
  const [cityId, setCityId] = useState<CityId | null>(null)
  const [traveler, setTraveler] = useState<Traveler | null>(null)
  const [plan, setPlan] = useState<DayPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const ui = getUi(locale)
  const theme = useMemo(() => createCityTheme(cityId, locale), [cityId, locale])
  const appClass =
    cityId === 'chiba' ? 'App AppChiba' : cityId === 'hanoi' ? 'App AppHanoi' : 'App'

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale
    document.title = ui.documentTitle
  }, [locale, ui.documentTitle])

  const requestPlan = async (nextTraveler: Traveler, regenerate: boolean) => {
    setLoading(true)
    setError('')

    try {
      const nextPlan = await fetchDayPlan(nextTraveler, regenerate, locale)
      setTraveler(nextTraveler)
      setCityId(nextTraveler.cityId)
      setPlan(nextPlan)
    } catch (caught) {
      const message =
        caught instanceof Error ? caught.message : ui.errorPlanFailed
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, ui }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box className={appClass}>
          <Header cityId={cityId} />
          <Box className="max-w-3xl mx-auto px-4 py-6">
            <Stack spacing={2}>
              {error !== '' ? (
                <Alert severity="error" onClose={() => setError('')}>
                  {error}
                </Alert>
              ) : null}

              {plan && traveler ? (
                <TravelPlan
                  plan={plan}
                  cityId={traveler.cityId}
                  startLabel={traveler.start.label}
                  isShuffling={loading}
                  onShuffle={() => {
                    void requestPlan(traveler, true)
                  }}
                  onReset={() => {
                    setTraveler(null)
                    setPlan(null)
                    setCityId(null)
                    setError('')
                  }}
                />
              ) : (
                <Box className="AppFormWrap">
                  {loading ? (
                    <Stack
                      className="AppLoading"
                      spacing={2}
                      sx={{ alignItems: 'center' }}
                    >
                      <CircularProgress />
                    </Stack>
                  ) : null}
                  <TravelerForm
                    isSubmitting={loading}
                    onCityChange={setCityId}
                    onSubmit={(nextTraveler) => {
                      void requestPlan(nextTraveler, false)
                    }}
                  />
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      </ThemeProvider>
    </LocaleContext.Provider>
  )
}

export default App

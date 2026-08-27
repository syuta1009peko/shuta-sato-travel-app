import { createTheme } from '@mui/material/styles'
import { enUS, jaJP, viVN } from '@mui/material/locale'
import { CITY_VISUALS, DEFAULT_BACKGROUND, DEFAULT_PRIMARY } from '../constants/cityVisuals'
import type { AppLocale } from '../i18n/locale'
import type { CityId } from '../types/place'

export const TEXT_COLOR = '#212121'
export const MUTED_COLOR = '#5C534A'
export const PAPER_COLOR = '#FFFFFF'

const jaHeading = '"Shippori Mincho", "Hiragino Mincho ProN", serif'
const jaBody = '"Zen Kaku Gothic New", "Hiragino Kaku Gothic ProN", sans-serif'
const enHeading = '"Noto Serif", Georgia, serif'
const enBody = '"Noto Sans", "Helvetica Neue", sans-serif'
const viHeading = '"Be Vietnam Pro", "Noto Sans", sans-serif'
const viBody = '"Be Vietnam Pro", "Noto Sans", sans-serif'

function fontsForLocale(locale: AppLocale): { heading: string; body: string } {
  if (locale === 'en') {
    return { heading: enHeading, body: enBody }
  }
  if (locale === 'vi') {
    return { heading: viHeading, body: viBody }
  }
  return { heading: jaHeading, body: jaBody }
}

export function createCityTheme(cityId: CityId | null, locale: AppLocale = 'ja') {
  const visual = cityId === null ? undefined : CITY_VISUALS[cityId]
  const primary = visual?.primary ?? DEFAULT_PRIMARY
  const secondary = visual?.accent ?? '#1F6B4A'
  const background = visual?.background ?? DEFAULT_BACKGROUND
  const fonts = fontsForLocale(locale)
  const muiLocale = locale === 'en' ? enUS : locale === 'vi' ? viVN : jaJP

  return createTheme(
    {
      palette: {
        primary: {
          main: primary,
        },
        secondary: {
          main: secondary,
        },
        background: {
          default: background,
          paper: visual?.paper ?? PAPER_COLOR,
        },
        text: {
          primary: TEXT_COLOR,
          secondary: MUTED_COLOR,
        },
      },
      typography: {
        fontFamily: fonts.body,
        h1: {
          fontFamily: fonts.heading,
          lineHeight: 1,
        },
        h2: {
          fontFamily: fonts.heading,
          lineHeight: 1,
        },
        h3: {
          fontFamily: fonts.heading,
          lineHeight: 1,
        },
        h4: {
          fontFamily: fonts.heading,
          lineHeight: 1,
        },
        h5: {
          fontFamily: fonts.heading,
          lineHeight: 1,
        },
        h6: {
          fontFamily: fonts.heading,
          lineHeight: 1,
        },
        body1: {
          lineHeight: 1.5,
        },
        body2: {
          lineHeight: 1.5,
        },
        button: {
          fontFamily: fonts.body,
        },
      },
      shape: {
        borderRadius: 16,
      },
    },
    muiLocale,
  )
}

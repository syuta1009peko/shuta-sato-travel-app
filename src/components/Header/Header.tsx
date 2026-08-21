import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LuggageOutlined from '@mui/icons-material/LuggageOutlined'
import { LanguageSwitch } from '../LanguageSwitch/LanguageSwitch'
import { CITY_VISUALS, toCommonsThumbUrl } from '../../constants/cityVisuals'
import { getCityName } from '../../i18n/content'
import { fillTemplate } from '../../i18n/ui'
import { useLocale } from '../../i18n/LocaleContext'
import type { CityId } from '../../types/place'
import './Header.scss'

interface HeaderProps {
  cityId: CityId | null
}

export function Header({ cityId }: HeaderProps) {
  const { locale, ui } = useLocale()
  const hanoi = CITY_VISUALS.hanoi
  const chiba = CITY_VISUALS.chiba
  const selected = cityId === null ? undefined : CITY_VISUALS[cityId]
  const cityName =
    cityId === null ? '' : getCityName(cityId, locale)

  return (
    <Box className="Header" component="header">
      <Box className="HeaderPhotos">
        {selected ? (
          <Box
            className="HeaderPhoto"
            sx={{ backgroundImage: `url("${toCommonsThumbUrl(selected.heroImageUrl)}")` }}
          />
        ) : (
          <Box>
            <Box
              className="HeaderPhoto HeaderPhotoSplitLeft"
              sx={{ backgroundImage: `url("${toCommonsThumbUrl(hanoi.heroImageUrl)}")` }}
            />
            <Box
              className="HeaderPhoto HeaderPhotoSplitRight"
              sx={{ backgroundImage: `url("${toCommonsThumbUrl(chiba.heroImageUrl)}")` }}
            />
          </Box>
        )}
        <Box className="HeaderShade" />
      </Box>

      <Stack
        className="HeaderContent max-w-3xl mx-auto px-4 py-8"
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <LuggageOutlined fontSize="large" />
          <Box>
            <Typography className="HeaderTitle" variant="h4" component="h1">
              {ui.appTitle}
            </Typography>
            <Typography className="HeaderLead" variant="body2">
              {selected
                ? fillTemplate(ui.headerLeadCity, { city: cityName })
                : ui.headerLeadDefault}
            </Typography>
          </Box>
        </Stack>
        <LanguageSwitch />
      </Stack>
    </Box>
  )
}

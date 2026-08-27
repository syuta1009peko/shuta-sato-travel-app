import { useState } from 'react'
import LocalCafeOutlined from '@mui/icons-material/LocalCafeOutlined'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import RestaurantOutlined from '@mui/icons-material/RestaurantOutlined'
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CITY_VISUALS, toCommonsThumbUrl } from '../../constants/cityVisuals'
import {
  formatDuration,
  formatHours,
  formatPrice,
  getAreaLabel,
  getPlaceCopy,
  slotNameFromTime,
} from '../../i18n/content'
import { useLocale } from '../../i18n/LocaleContext'
import type { AppLocale } from '../../i18n/locale'
import type { PlanSlot } from '../../types/plan'
import type { CityId, PlaceCategory } from '../../types/place'
import './PlaceCard.scss'

interface PlaceCardProps {
  slot: PlanSlot
  cityId: CityId
  planLocale?: AppLocale
}

const CATEGORY_ICONS = {
  attraction: PlaceOutlined,
  restaurant: RestaurantOutlined,
  cafe: LocalCafeOutlined,
  market: StorefrontOutlined,
} as const

export function PlaceCard({ slot, cityId, planLocale }: PlaceCardProps) {
  const { locale, ui } = useLocale()
  const category: PlaceCategory = slot.place.category
  const Icon = CATEGORY_ICONS[category]
  const visual = CITY_VISUALS[cityId]
  const imageUrl = slot.place.imageUrl
  const [imageFailed, setImageFailed] = useState(false)
  const showPhoto = imageUrl !== undefined && imageUrl !== '' && !imageFailed
  const photoSrc = imageUrl === undefined ? undefined : toCommonsThumbUrl(imageUrl)
  const copy = getPlaceCopy(slot.place, locale)
  const reason =
    planLocale === locale ? slot.reasonJa : copy.reasonHint

  return (
    <Box className="PlaceCard">
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ alignItems: 'stretch' }}>
        {showPhoto && photoSrc !== undefined ? (
          <Box className="PlaceCardPhoto">
            <Box
              className="PlaceCardPhotoImg"
              component="img"
              src={photoSrc}
              alt={copy.name}
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
            />
          </Box>
        ) : (
          <Box
            className="PlaceCardFallback"
            sx={{
              backgroundColor: visual.primary,
            }}
          >
            <Icon fontSize="large" />
          </Box>
        )}

        <Box className="PlaceCardBody">
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography
                className="PlaceCardTime"
                variant="h6"
                component="p"
                sx={{ color: visual.primary }}
              >
                {slot.timeLabel}
              </Typography>
              <Chip
                size="small"
                label={slotNameFromTime(slot.timeLabel, locale)}
                color="primary"
                variant="outlined"
              />
              <Chip size="small" label={ui.category[category]} />
            </Stack>

            <Typography className="PlaceCardName" variant="h6" component="h3">
              {copy.name}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {getAreaLabel(slot.place.area, locale)} ・{' '}
              {formatDuration(slot.place.durationMinutes, locale)} ・{' '}
              {formatHours(
                slot.place.openLabel,
                slot.place.closeLabel,
                locale,
              )}{' '}
              ・ {formatPrice(slot.place.priceRange, locale)}
            </Typography>

            <Typography variant="body1">{copy.description}</Typography>

            <Typography
              className="PlaceCardReason"
              variant="body2"
              sx={{
                backgroundColor: visual.reasonBg,
                color: visual.reasonText,
              }}
            >
              {reason}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

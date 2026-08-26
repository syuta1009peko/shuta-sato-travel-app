import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CITY_VISUALS, toCommonsThumbUrl } from '../../constants/cityVisuals'
import { getCityName } from '../../i18n/content'
import { fillTemplate } from '../../i18n/ui'
import { useLocale } from '../../i18n/LocaleContext'
import { PlaceCard } from '../PlaceCard/PlaceCard'
import { TravelLeg } from '../TravelLeg/TravelLeg'
import type { DayPlan } from '../../types/plan'
import type { CityId } from '../../types/place'
import './TravelPlan.scss'

interface TravelPlanProps {
  plan: DayPlan
  cityId: CityId
  startLabel: string
  isShuffling: boolean
  onShuffle: () => void
  onReset: () => void
}

export function TravelPlan({
  plan,
  cityId,
  startLabel,
  isShuffling,
  onShuffle,
  onReset,
}: TravelPlanProps) {
  const { locale, ui } = useLocale()
  const visual = CITY_VISUALS[cityId]
  const cityName = getCityName(cityId, locale)

  return (
    <Box className="TravelPlan">
      <Stack spacing={3}>
        <Box className="TravelPlanHero">
          <Box
            className="TravelPlanHeroPhoto"
            sx={{ backgroundImage: `url("${toCommonsThumbUrl(visual.heroImageUrl)}")` }}
          />
          <Box className="TravelPlanHeroShade" />
          <Box className="TravelPlanHeroText">
            <Typography className="TravelPlanHeroTitle" variant="h4" component="h2">
              {fillTemplate(ui.dayInCity, { city: cityName })}
            </Typography>
            <Typography className="TravelPlanHeroLead" variant="body1">
              {ui.citySummary[cityId]}
            </Typography>
            <Typography className="TravelPlanHeroStart" variant="body2">
              {fillTemplate(ui.startFromLabel, { place: startLabel })}
            </Typography>
            <Typography className="TravelPlanHeroCredit" variant="caption">
              {ui.photoCredit}: {visual.heroCredit}
            </Typography>
          </Box>
        </Box>

        <Box className="TravelPlanTimeline">
          <Box
            className="TravelPlanLine"
            sx={{ backgroundColor: `${visual.primary}4D` }}
          />
          <Stack spacing={2}>
            {plan.slots.map((slot) => (
              <Stack
                key={`${slot.timeLabel}-${slot.place.id}`}
                className="TravelPlanStop"
                spacing={1}
              >
                {slot.travelFromPrevious !== undefined ? (
                  <TravelLeg leg={slot.travelFromPrevious} />
                ) : null}
                <PlaceCard
                  slot={slot}
                  cityId={cityId}
                  planLocale={plan.locale}
                />
              </Stack>
            ))}
          </Stack>
        </Box>

        <Stack
          className="TravelPlanActions"
          direction="row"
          spacing={1.5}
        >
          <Button
            variant="contained"
            size="large"
            onClick={onShuffle}
            disabled={isShuffling}
            fullWidth
          >
            {isShuffling ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              ui.shufflePlan
            )}
          </Button>
          <Button
            className="TravelPlanReset"
            variant="outlined"
            size="large"
            onClick={onReset}
            disabled={isShuffling}
            fullWidth
            sx={{ backgroundColor: '#FFFFFF' }}
          >
            {ui.resetPlan}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

import DirectionsBus from '@mui/icons-material/DirectionsBus'
import DirectionsWalk from '@mui/icons-material/DirectionsWalk'
import LocalTaxi from '@mui/icons-material/LocalTaxi'
import Train from '@mui/icons-material/Train'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { fillTemplate } from '../../i18n/ui'
import { useLocale } from '../../i18n/LocaleContext'
import type { TravelLeg as TravelLegData } from '../../types/plan'
import './TravelLeg.scss'

interface TravelLegProps {
  leg: TravelLegData
}

const MODE_ICONS = {
  train: Train,
  bus: DirectionsBus,
  taxi: LocalTaxi,
  walk: DirectionsWalk,
} as const

export function TravelLeg({ leg }: TravelLegProps) {
  const { ui } = useLocale()
  const Icon = MODE_ICONS[leg.mode]
  const label = fillTemplate(ui.travelLegLabel, {
    mode: ui.transport[leg.mode],
    minutes: leg.minutes,
  })

  return (
    <Box className="TravelLeg">
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Icon className="TravelLegIcon" fontSize="small" aria-hidden />
        <Typography className="TravelLegLabel" variant="body2" component="p">
          {label}
        </Typography>
      </Stack>
    </Box>
  )
}

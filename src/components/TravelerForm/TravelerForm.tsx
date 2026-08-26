import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { CITY_VISUALS, toCommonsThumbUrl } from '../../constants/cityVisuals'
import {
  GENDER_OPTIONS,
  HOBBY_OPTIONS,
  LIFESTYLE_OPTIONS,
  RANGE_PREF_OPTIONS,
  TRAVELER_AGE_MAX,
  TRAVELER_AGE_MIN,
  TRANSPORT_OPTIONS,
  isGender,
  isLifestyleTag,
  isRangePref,
  isTransportMode,
} from '../../constants/options'
import { CITY_STARTS } from '../../constants/startPoints'
import { useLocale } from '../../i18n/LocaleContext'
import type { UiCopy } from '../../i18n/ui'
import { samePoint } from '../../utils/geo'
import { StartMap } from '../StartMap/StartMap'
import type { CityId, HobbyTag, LifestyleTag } from '../../types/place'
import type { Gender, RangePref, StartPoint, TransportMode, Traveler } from '../../types/traveler'
import './TravelerForm.scss'

interface TravelerFormProps {
  onSubmit: (traveler: Traveler) => void
  onCityChange: (cityId: CityId) => void
  isSubmitting: boolean
}

const CITY_CARDS: { value: CityId; labelKey: 'cityHanoi' | 'cityChiba' }[] = [
  { value: 'hanoi', labelKey: 'cityHanoi' },
  { value: 'chiba', labelKey: 'cityChiba' },
]

type FormErrorKey = 'city' | 'age' | 'hobbies' | ''

function labeledStart(
  cityId: CityId,
  lat: number,
  lng: number,
  ui: UiCopy,
): StartPoint {
  const preset = CITY_STARTS[cityId]
  const atAirport = samePoint({ lat, lng }, preset)
  return {
    lat,
    lng,
    label: atAirport ? ui[preset.labelKey] : ui.startCustomPin,
  }
}

export function TravelerForm({
  onSubmit,
  onCityChange,
  isSubmitting,
}: TravelerFormProps) {
  const { ui } = useLocale()
  const [cityId, setCityId] = useState<CityId | null>(null)
  const [startCoords, setStartCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  )
  const [gender, setGender] = useState<Gender>('unspecified')
  const [ageInput, setAgeInput] = useState('')
  const [hobbies, setHobbies] = useState<HobbyTag[]>([])
  const [lifestyle, setLifestyle] = useState<LifestyleTag>('relaxed')
  const [transport, setTransport] = useState<TransportMode>('train')
  const [rangePref, setRangePref] = useState<RangePref>('stayLocal')
  const [errorKey, setErrorKey] = useState<FormErrorKey>('')
  const start =
    cityId !== null && startCoords !== null
      ? labeledStart(cityId, startCoords.lat, startCoords.lng, ui)
      : null

  const toggleHobby = (hobby: HobbyTag) => {
    setHobbies((current) =>
      current.includes(hobby)
        ? current.filter((item) => item !== hobby)
        : [...current, hobby],
    )
  }

  const selectCity = (nextCity: CityId) => {
    const preset = CITY_STARTS[nextCity]
    setCityId(nextCity)
    onCityChange(nextCity)
    setStartCoords({ lat: preset.lat, lng: preset.lng })
  }

  const handleSubmit = () => {
    if (isSubmitting) {
      return
    }
    const age = Number(ageInput)

    if (cityId === null) {
      setErrorKey('city')
      return
    }

    if (
      !Number.isInteger(age) ||
      age < TRAVELER_AGE_MIN ||
      age > TRAVELER_AGE_MAX
    ) {
      setErrorKey('age')
      return
    }

    if (hobbies.length === 0) {
      setErrorKey('hobbies')
      return
    }

    if (start === null) {
      setErrorKey('city')
      return
    }

    setErrorKey('')
    onSubmit({
      cityId,
      gender,
      age,
      hobbies,
      lifestyle,
      start,
      transport,
      rangePref,
    })
  }

  const errorText =
    errorKey === 'city'
      ? ui.errorPickCity
      : errorKey === 'age'
        ? ui.errorAge
        : errorKey === 'hobbies'
          ? ui.errorHobbies
          : ''

  return (
    <Box className="TravelerForm">
      <Stack spacing={3}>
        <Typography variant="h5" component="h2">
          {ui.formTitle}
        </Typography>

        <FormControl className="TravelerFormSection">
          <FormLabel>{ui.destinationLabel}</FormLabel>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            className="mt-2"
          >
            {CITY_CARDS.map((option) => {
              const visual = CITY_VISUALS[option.value]
              const selected = cityId === option.value
              return (
                <Button
                  key={option.value}
                  className={
                    selected
                      ? 'TravelerFormCityCard TravelerFormCityCardSelected'
                      : 'TravelerFormCityCard'
                  }
                  onClick={() => selectCity(option.value)}
                  fullWidth
                  sx={{
                    borderColor: selected ? visual.primary : '#E8DDD0',
                    borderWidth: selected ? '4px' : '3px',
                  }}
                >
                  <Box
                    className="TravelerFormCityPhoto"
                    sx={{ backgroundImage: `url("${toCommonsThumbUrl(visual.heroImageUrl)}")` }}
                  />
                  <Box
                    className={
                      selected
                        ? 'TravelerFormCityShade TravelerFormCityShadeSelected'
                        : 'TravelerFormCityShade'
                    }
                  />
                  <Stack sx={{ alignItems: 'center' }}>
                    <Typography className="TravelerFormCityLabel" variant="h5">
                      {ui[option.labelKey]}
                    </Typography>
                    {selected ? (
                      <Chip
                        className="TravelerFormCityChip"
                        label={ui.selectedBadge}
                        size="small"
                        sx={{
                          backgroundColor: '#FFFFFF',
                          color: visual.primary,
                        }}
                      />
                    ) : null}
                  </Stack>
                </Button>
              )
            })}
          </Stack>
        </FormControl>

        {cityId !== null && start !== null ? (
          <FormControl className="TravelerFormSection">
            <StartMap
              cityId={cityId}
              start={start}
              airportLabel={ui[CITY_STARTS[cityId].labelKey]}
              customLabel={ui.startCustomPin}
              resetLabel={ui.startResetAirport}
              hint={ui.startHint}
              sectionLabel={ui.startLabel}
              onChange={(nextStart) => {
                setStartCoords({ lat: nextStart.lat, lng: nextStart.lng })
              }}
            />
          </FormControl>
        ) : null}

        <FormControl className="TravelerFormSection">
          <FormLabel>{ui.genderLabel}</FormLabel>
          <RadioGroup
            row
            value={gender}
            onChange={(event) => {
              if (isGender(event.target.value)) {
                setGender(event.target.value)
              }
            }}
          >
            {GENDER_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={ui.gender[option.value]}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <TextField
          label={ui.ageLabel}
          type="number"
          value={ageInput}
          onChange={(event) => setAgeInput(event.target.value)}
          slotProps={{ htmlInput: { min: 1, max: 120 } }}
          fullWidth
        />

        <FormControl className="TravelerFormSection">
          <FormLabel>{ui.hobbiesLabel}</FormLabel>
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            className="mt-2"
            sx={{ flexWrap: 'wrap' }}
          >
            {HOBBY_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={ui.hobby[option.value]}
                color={hobbies.includes(option.value) ? 'primary' : 'default'}
                variant={hobbies.includes(option.value) ? 'filled' : 'outlined'}
                onClick={() => toggleHobby(option.value)}
              />
            ))}
          </Stack>
        </FormControl>

        <FormControl className="TravelerFormSection">
          <FormLabel>{ui.lifestyleLabel}</FormLabel>
          <RadioGroup
            value={lifestyle}
            onChange={(event) => {
              if (isLifestyleTag(event.target.value)) {
                setLifestyle(event.target.value)
              }
            }}
          >
            {LIFESTYLE_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={ui.lifestyle[option.value]}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <FormControl className="TravelerFormSection">
          <FormLabel>{ui.transportLabel}</FormLabel>
          <RadioGroup
            row
            value={transport}
            onChange={(event) => {
              if (isTransportMode(event.target.value)) {
                setTransport(event.target.value)
              }
            }}
          >
            {TRANSPORT_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={ui.transport[option.value]}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <FormControl className="TravelerFormSection">
          <FormLabel>{ui.rangePrefLabel}</FormLabel>
          <RadioGroup
            value={rangePref}
            onChange={(event) => {
              if (isRangePref(event.target.value)) {
                setRangePref(event.target.value)
              }
            }}
          >
            {RANGE_PREF_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={ui.rangePref[option.value]}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {errorText !== '' ? (
          <Typography className="TravelerFormError" variant="body2">
            {errorText}
          </Typography>
        ) : null}

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {ui.submitPlan}
        </Button>
      </Stack>
    </Box>
  )
}

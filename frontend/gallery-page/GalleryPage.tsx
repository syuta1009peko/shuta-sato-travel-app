import { useEffect, useMemo, useState } from 'react'
import type { MouseEvent } from 'react'
import PlaceOutlined from '@mui/icons-material/PlaceOutlined'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import CssBaseline from '@mui/material/CssBaseline'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material/styles'
import { CITY_VISUALS, toCommonsThumbUrl } from '../src/constants/cityVisuals'
import { fetchCityData } from '../src/data/cities'
import { getAreaLabel } from '../src/i18n/content'
import { createCityTheme } from '../src/theme/muiTheme'
import type { CityData, CityId, Place } from '../src/types/place'
import './GalleryPage.scss'

type CityFilter = 'all' | CityId

interface GalleryItem {
  cityId: CityId
  cityNameJa: string
  place: Place
}

const theme = createCityTheme(null)

function toItems(cityId: CityId, city: CityData): GalleryItem[] {
  return city.places.map((place) => ({
    cityId,
    cityNameJa: city.cityNameJa,
    place,
  }))
}

function GalleryPageCard({ item }: { item: GalleryItem }) {
  const { cityId, cityNameJa, place } = item
  const imageUrl = place.imageUrl
  const [imageFailed, setImageFailed] = useState(false)
  const showPhoto = imageUrl !== undefined && imageUrl !== '' && !imageFailed
  const photoSrc = imageUrl === undefined ? undefined : toCommonsThumbUrl(imageUrl)
  const visual = CITY_VISUALS[cityId]
  const areaLabel = getAreaLabel(place.area, 'ja')

  return (
    <Box className="GalleryPageCard" component="article">
      {showPhoto && photoSrc !== undefined ? (
        <Box className="GalleryPagePhoto">
          <Box
            className="GalleryPagePhotoImg"
            component="img"
            src={photoSrc}
            alt={place.nameJa}
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        </Box>
      ) : (
        <Box
          className="GalleryPageFallback"
          sx={{ backgroundColor: visual.primary }}
        >
          <PlaceOutlined fontSize="large" />
        </Box>
      )}

      <Box className="GalleryPageBody">
        <Typography className="GalleryPageName" variant="h6" component="h2">
          {place.nameJa}
        </Typography>
        <Typography className="GalleryPageId" variant="body2">
          {place.id}
        </Typography>
        <Typography className="GalleryPageMeta" variant="body2">
          {cityNameJa} ・ {areaLabel}
        </Typography>
      </Box>
    </Box>
  )
}

export function GalleryPage() {
  const [cityFilter, setCityFilter] = useState<CityFilter>('all')
  const [hanoi, setHanoi] = useState<CityData | null>(null)
  const [chiba, setChiba] = useState<CityData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    void Promise.all([fetchCityData('hanoi'), fetchCityData('chiba')])
      .then(([nextHanoi, nextChiba]) => {
        if (cancelled) {
          return
        }
        setHanoi(nextHanoi)
        setChiba(nextChiba)
      })
      .catch((caught: unknown) => {
        if (cancelled) {
          return
        }
        const message =
          caught instanceof Error ? caught.message : 'Failed to load places'
        setError(message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const galleryItems = useMemo(() => {
    if (hanoi === null || chiba === null) {
      return []
    }
    return [...toItems('hanoi', hanoi), ...toItems('chiba', chiba)]
  }, [hanoi, chiba])

  const visibleItems = useMemo(() => {
    if (cityFilter === 'all') {
      return galleryItems
    }
    return galleryItems.filter((item) => item.cityId === cityFilter)
  }, [cityFilter, galleryItems])

  const hanoiCount = hanoi?.places.length ?? 0
  const chibaCount = chiba?.places.length ?? 0
  const loading = error === '' && (hanoi === null || chiba === null)

  const handleCityFilter = (
    _event: MouseEvent<HTMLElement>,
    next: CityFilter | null,
  ) => {
    if (next !== null) {
      setCityFilter(next)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="GalleryPage">
        <Box className="GalleryPageHeader" component="header">
          <Stack spacing={1.5}>
            <Typography className="GalleryPageTitle" variant="h4" component="h1">
              Place photos
            </Typography>
            <Typography className="GalleryPageCount" variant="body2">
              {visibleItems.length}件（ハノイ {hanoiCount}・千葉 {chibaCount}）
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={cityFilter}
              onChange={handleCityFilter}
              aria-label="City"
            >
              <ToggleButton value="all">すべて</ToggleButton>
              <ToggleButton value="hanoi">ハノイ</ToggleButton>
              <ToggleButton value="chiba">千葉</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>

        {error !== '' ? (
          <Typography className="GalleryPageCount" variant="body2">
            {error}
          </Typography>
        ) : null}

        {loading ? (
          <Box className="GalleryPageGrid">
            <CircularProgress />
          </Box>
        ) : (
          <Box className="GalleryPageGrid">
            {visibleItems.map((item) => (
              <GalleryPageCard
                key={`${item.cityId}-${item.place.id}`}
                item={item}
              />
            ))}
          </Box>
        )}
      </Box>
    </ThemeProvider>
  )
}
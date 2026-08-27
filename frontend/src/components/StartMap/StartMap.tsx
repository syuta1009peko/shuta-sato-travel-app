import { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { CITY_STARTS } from '../../constants/startPoints'
import { clampLatLng, samePoint } from '../../utils/geo'
import type { CityId } from '../../types/place'
import type { StartPoint } from '../../types/traveler'
import 'leaflet/dist/leaflet.css'
import './StartMap.scss'

const DEFAULT_ZOOM = 11

const MARKER_ICON = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface StartMapProps {
  cityId: CityId
  start: StartPoint
  airportLabel: string
  customLabel: string
  resetLabel: string
  hint: string
  sectionLabel: string
  onChange: (start: StartPoint) => void
}

interface MapPickHandlerProps {
  cityId: CityId
  airportLabel: string
  customLabel: string
  onChange: (start: StartPoint) => void
}

function MapPickHandler({
  cityId,
  airportLabel,
  customLabel,
  onChange,
}: MapPickHandlerProps) {
  const preset = CITY_STARTS[cityId]

  useMapEvents({
    click: (event) => {
      const next = clampLatLng(
        { lat: event.latlng.lat, lng: event.latlng.lng },
        preset.bounds,
      )
      const atAirport = samePoint(next, preset)
      onChange({
        lat: next.lat,
        lng: next.lng,
        label: atAirport ? airportLabel : customLabel,
      })
    },
  })

  return null
}

interface RecenterOnAirportProps {
  cityId: CityId
  start: StartPoint
}

function RecenterOnAirport({ cityId, start }: RecenterOnAirportProps) {
  const map = useMap()
  const preset = CITY_STARTS[cityId]
  const atAirport = samePoint(start, preset)
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    if (!atAirport) {
      return
    }

    map.flyTo([preset.lat, preset.lng], DEFAULT_ZOOM)
  }, [atAirport, map, preset.lat, preset.lng])

  return null
}

export function StartMap({
  cityId,
  start,
  airportLabel,
  customLabel,
  resetLabel,
  hint,
  sectionLabel,
  onChange,
}: StartMapProps) {
  const preset = CITY_STARTS[cityId]
  const atAirport = samePoint(start, preset)

  const movePin = (lat: number, lng: number) => {
    const next = clampLatLng({ lat, lng }, preset.bounds)
    const nextAtAirport = samePoint(next, preset)
    onChange({
      lat: next.lat,
      lng: next.lng,
      label: nextAtAirport ? airportLabel : customLabel,
    })
  }

  return (
    <Box className="StartMap">
      <Stack spacing={1.5}>
        <Typography component="span" variant="subtitle1">
          {sectionLabel}
        </Typography>
        <Typography className="StartMapHint" variant="body2">
          {hint}
        </Typography>
        <Box className="StartMapFrame">
          <MapContainer
            key={cityId}
            className="StartMapCanvas"
            center={[preset.lat, preset.lng]}
            zoom={DEFAULT_ZOOM}
            maxBounds={preset.bounds}
            maxBoundsViscosity={1}
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapPickHandler
              cityId={cityId}
              airportLabel={airportLabel}
              customLabel={customLabel}
              onChange={onChange}
            />
            <RecenterOnAirport cityId={cityId} start={start} />
            <Marker
              draggable
              icon={MARKER_ICON}
              position={[start.lat, start.lng]}
              eventHandlers={{
                dragend: (event) => {
                  const latLng = event.target.getLatLng()
                  movePin(latLng.lat, latLng.lng)
                },
              }}
            />
          </MapContainer>
        </Box>
        <Typography className="StartMapLabel" variant="body2">
          {start.label}
        </Typography>
        {atAirport ? null : (
          <Button
            variant="outlined"
            onClick={() =>
              onChange({
                lat: preset.lat,
                lng: preset.lng,
                label: airportLabel,
              })
            }
          >
            {resetLabel}
          </Button>
        )}
      </Stack>
    </Box>
  )
}

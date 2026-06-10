'use client'

import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import type { TripCourseDetail } from '../types/tripDetail'
import { css, cx } from '@/styled-system/css'

const sectionStyle = css({
  display: 'grid',
  gap: '3',
})

const tabsStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

const tabButtonStyle = css({
  minH: '8',
  px: '4',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'pill',
  bg: 'bg.surface',
  color: 'text.secondary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  transitionProperty: 'background-color, border-color, color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    borderColor: 'primary',
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const activeTabStyle = css({
  bg: 'primary',
  borderColor: 'primary',
  color: 'text.inverse',
  _hover: {
    bg: 'primary.hover',
    borderColor: 'primary.hover',
    color: 'text.inverse',
  },
})

const mapStyle = css({
  position: 'relative',
  minH: { base: '280px', md: '420px' },
  overflow: 'hidden',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'xl',
  bg: 'bg.muted',
  boxShadow: 'sm',
})

const gridOverlayStyle = css({
  position: 'absolute',
  inset: 0,
  opacity: 0.45,
  backgroundImage:
    'linear-gradient(var(--colors-border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--colors-border-subtle) 1px, transparent 1px)',
  backgroundSize: '56px 56px',
})

const areaBlobStyle = css({
  position: 'absolute',
  left: '-8',
  right: '-8',
  bottom: '-12',
  height: '45%',
  bg: 'primary.soft',
  borderRadius: '50%',
  opacity: 0.55,
})

const pathStyle = css({
  position: 'absolute',
  left: '18%',
  right: '14%',
  bottom: '22%',
  height: '35%',
  borderBottomWidth: '4px',
  borderBottomStyle: 'dotted',
  borderBottomColor: 'primary',
  transform: 'skewY(-14deg)',
})

const markerStyle = css({
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  w: '9',
  h: '9',
  borderRadius: 'pill',
  bg: 'primary',
  color: 'text.inverse',
  fontSize: 'sm',
  fontWeight: 'bold',
  boxShadow: 'md',
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const selectedMarkerStyle = css({
  w: '11',
  h: '11',
  bg: 'primary.hover',
})

const selectedCardStyle = css({
  position: 'absolute',
  left: { base: '4', md: '6' },
  bottom: { base: '4', md: '6' },
  display: 'grid',
  gap: '1',
  maxW: { base: 'calc(100% - 32px)', md: '360px' },
  p: '4',
  borderRadius: 'lg',
  bg: 'bg.surface',
  color: 'text.primary',
  boxShadow: 'md',
})

const selectedTitleStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  fontSize: 'sm',
  fontWeight: 'bold',
})

const selectedTextStyle = css({
  color: 'text.secondary',
  fontSize: 'xs',
})

const sequenceStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '2',
  px: '4',
  py: '3',
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  color: 'text.primary',
  fontSize: 'sm',
})

const sequenceDividerStyle = css({
  color: 'text.secondary',
})

const markerPositions = [
  { left: '18%', top: '62%' },
  { left: '29%', top: '48%' },
  { left: '42%', top: '34%' },
  { left: '55%', top: '45%' },
  { left: '68%', top: '29%' },
  { left: '82%', top: '42%' },
  { left: '24%', top: '26%' },
  { left: '37%', top: '68%' },
  { left: '51%', top: '58%' },
  { left: '64%', top: '69%' },
  { left: '78%', top: '61%' },
  { left: '16%', top: '38%' },
  { left: '47%', top: '22%' },
  { left: '88%', top: '24%' },
  { left: '58%', top: '78%' },
]

interface TripMapPreviewProps {
  trip: TripCourseDetail
}

export function TripMapPreview({ trip }: TripMapPreviewProps) {
  const [activeDay, setActiveDay] = useState<number | 'all'>('all')
  const [selectedPlaceId, setSelectedPlaceId] = useState(
    trip.days[0]?.places[0]?.id
  )

  const places = useMemo(() => {
    if (activeDay === 'all') {
      return trip.days.flatMap((day) => day.places)
    }

    return trip.days.find((day) => day.day === activeDay)?.places ?? []
  }, [activeDay, trip.days])

  const selectedPlace =
    places.find((place) => place.id === selectedPlaceId) ?? places[0]

  const selectDay = (day: number | 'all') => {
    const nextPlaces =
      day === 'all'
        ? trip.days.flatMap((tripDay) => tripDay.places)
        : (trip.days.find((tripDay) => tripDay.day === day)?.places ?? [])

    setActiveDay(day)
    setSelectedPlaceId(nextPlaces[0]?.id)
  }

  return (
    <section className={sectionStyle} aria-labelledby="trip-map-title">
      <h2 id="trip-map-title" className={css({ srOnly: true })}>
        지도에서 코스 보기
      </h2>

      <div className={tabsStyle} aria-label="일차별 지도 보기">
        <button
          type="button"
          aria-pressed={activeDay === 'all'}
          className={cx(tabButtonStyle, activeDay === 'all' && activeTabStyle)}
          onClick={() => selectDay('all')}
        >
          전체
        </button>
        {trip.days.map((day) => (
          <button
            key={day.day}
            type="button"
            aria-pressed={activeDay === day.day}
            className={cx(
              tabButtonStyle,
              activeDay === day.day && activeTabStyle
            )}
            onClick={() => selectDay(day.day)}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      <div className={mapStyle}>
        <div className={gridOverlayStyle} aria-hidden="true" />
        <div className={areaBlobStyle} aria-hidden="true" />
        <div className={pathStyle} aria-hidden="true" />

        {places.map((place, index) => {
          const position = markerPositions[index % markerPositions.length]
          const isSelected = place.id === selectedPlace?.id

          return (
            <button
              key={place.id}
              type="button"
              aria-label={`${place.name} 지도 마커`}
              className={cx(markerStyle, isSelected && selectedMarkerStyle)}
              style={position}
              onClick={() => setSelectedPlaceId(place.id)}
            >
              {place.order}
            </button>
          )
        })}

        {selectedPlace ? (
          <div className={selectedCardStyle}>
            <strong className={selectedTitleStyle}>
              <MapPin size={15} aria-hidden="true" />
              {selectedPlace.order}. {selectedPlace.name}
            </strong>
            <span className={selectedTextStyle}>
              {selectedPlace.category} · {selectedPlace.address}
            </span>
          </div>
        ) : null}
      </div>

      <div className={sequenceStyle} aria-label="장소 순서 요약">
        {places.map((place, index) => (
          <span key={place.id}>
            {index > 0 ? (
              <span className={sequenceDividerStyle}>→ </span>
            ) : null}
            {place.order}. {place.name}
          </span>
        ))}
      </div>
    </section>
  )
}

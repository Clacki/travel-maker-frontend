'use client'

import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'

import type { TripCourseDetail, TripPlace } from '../types/tripDetail'
import { css } from '@/styled-system/css'

const sectionStyle = css({ display: 'grid', gap: '3' })

const tabsStyle = css({ display: 'flex', flexWrap: 'wrap', gap: '2' })

const tabButtonStyle = css({
  minH: '8',
  px: '4',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'pill',
  bg: 'bg.surface',
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  cursor: 'pointer',
  _hover: { borderColor: 'primary', color: 'primary' },
  _focusVisible: { outline: 'none', boxShadow: 'focus' },
  '&[aria-pressed=true]': {
    bg: 'primary',
    borderColor: 'primary',
    color: 'text.inverse',
  },
})

const mapWrapStyle = css({
  position: 'relative',
  minH: { base: '280px', md: '420px' },
  overflow: 'hidden',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'xl',
  bg: 'bg.muted',
  boxShadow: 'sm',
  backgroundImage:
    'linear-gradient(30deg, transparent 49%, token(colors.border.subtle) 50%, transparent 51%), linear-gradient(150deg, transparent 49%, token(colors.border.subtle) 50%, transparent 51%)',
  backgroundSize: '84px 84px',
})

const markerListStyle = css({
  position: 'absolute',
  inset: '0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: { base: '5', md: '8' },
  px: '8',
  pb: '20',
})

const markerButtonStyle = css({
  width: '10',
  height: '10',
  borderRadius: 'pill',
  borderWidth: '2px',
  borderColor: 'bg.surface',
  bg: 'primary',
  color: 'text.inverse',
  boxShadow: 'md',
  fontSize: 'sm',
  fontWeight: 'bold',
  cursor: 'pointer',
  '&[aria-pressed=true]': {
    bg: 'bg.surface',
    color: 'primary',
    borderColor: 'primary',
  },
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

const selectedTextStyle = css({ color: 'text.secondary', fontSize: 'xs' })

const demoNoticeStyle = css({
  position: 'absolute',
  top: '4',
  right: '4',
  px: '3',
  py: '1.5',
  borderRadius: 'sm',
  bg: 'bg.surface',
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

const sequenceDividerStyle = css({ color: 'text.secondary' })

interface TripMapPreviewProps {
  trip: TripCourseDetail
}

export function TripMapPreview({ trip }: TripMapPreviewProps) {
  const [activeDay, setActiveDay] = useState<number | 'all'>('all')
  const [selectedPlaceId, setSelectedPlaceId] = useState<number | undefined>(
    trip.days[0]?.places[0]?.id
  )

  const places = useMemo<TripPlace[]>(() => {
    if (activeDay === 'all') return trip.days.flatMap((day) => day.places)
    return trip.days.find((day) => day.day === activeDay)?.places ?? []
  }, [activeDay, trip.days])

  const selectedPlace =
    places.find((place) => place.id === selectedPlaceId) ?? places[0]

  const selectDay = (day: number | 'all') => {
    const nextPlaces =
      day === 'all'
        ? trip.days.flatMap((item) => item.places)
        : (trip.days.find((item) => item.day === day)?.places ?? [])
    setActiveDay(day)
    setSelectedPlaceId(nextPlaces[0]?.id)
  }

  return (
    <section className={sectionStyle} aria-labelledby="trip-map-title">
      <h2 id="trip-map-title" className={css({ srOnly: true })}>
        코스 지도
      </h2>
      <div className={tabsStyle} aria-label="일차별 코스 보기">
        <button
          type="button"
          aria-pressed={activeDay === 'all'}
          className={tabButtonStyle}
          onClick={() => selectDay('all')}
        >
          전체
        </button>
        {trip.days.map((day) => (
          <button
            key={day.day}
            type="button"
            aria-pressed={activeDay === day.day}
            className={tabButtonStyle}
            onClick={() => selectDay(day.day)}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      <div className={mapWrapStyle}>
        <span className={demoNoticeStyle}>
          데모 버전에서는 지도 기능을 제공하지 않습니다.
        </span>
        <div className={markerListStyle}>
          {places.map((place) => (
            <button
              key={place.id}
              type="button"
              className={markerButtonStyle}
              aria-label={`${place.name} 선택`}
              aria-pressed={selectedPlace?.id === place.id}
              onClick={() => setSelectedPlaceId(place.id)}
            >
              {place.order}
            </button>
          ))}
        </div>
        {selectedPlace ? (
          <div className={selectedCardStyle}>
            <strong className={selectedTitleStyle}>
              <MapPin size={15} aria-hidden="true" />
              {selectedPlace.order}. {selectedPlace.name}
            </strong>
            {selectedPlace.address ? (
              <span className={selectedTextStyle}>{selectedPlace.address}</span>
            ) : null}
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

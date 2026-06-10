'use client'

import { useMemo } from 'react'
import { Clock, Footprints, Bus, Car } from 'lucide-react'

import { useCourseStore } from '@/store/tripsStore'
import type { CoursePlace } from '@/features/trips/types/course.types'

import { css } from '@/styled-system/css'

const sectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
  mt: '6',
})

const sectionTitleStyle = css({
  fontSize: 'md',
  fontWeight: 'semibold',
  color: 'text.primary',
  mb: '4',
})

const timelineItemStyle = css({
  display: 'flex',
  gap: '3',
  position: 'relative',
})

const timeColumnStyle = css({
  w: '14',
  flexShrink: 0,
  textAlign: 'right',
  fontSize: 'xs',
  color: 'text.secondary',
  pt: '1',
})

const dotLineStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
})

const dotStyle = css({
  w: '3',
  h: '3',
  borderRadius: 'pill',
  bg: 'primary',
  flexShrink: 0,
  mt: '1.5',
})

const lineStyle = css({
  w: '0.5',
  flex: 1,
  bg: 'border.subtle',
  my: '1',
})

const cardStyle = css({
  flex: 1,
  p: '3',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  bg: 'bg.surface',
  mb: '2',
})

const placeNameStyle = css({
  fontWeight: 'medium',
  fontSize: 'sm',
  color: 'text.primary',
})

const placeAddressStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
  mt: '0.5',
})

const stayStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1',
  fontSize: 'xs',
  color: 'text.secondary',
  mt: '1',
})

const transportStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1',
  fontSize: 'xs',
  color: 'text.secondary',
  py: '1',
})

const emptyStyle = css({
  textAlign: 'center',
  py: '8',
  color: 'text.secondary',
  fontSize: 'sm',
})

function formatTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  const period = hours < 12 ? '오전' : '오후'
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${period} ${displayHour}:${String(minutes).padStart(2, '0')}`
}

function getTransportIcon(mode?: CoursePlace['transportMode']) {
  switch (mode) {
    case 'walk':
      return <Footprints size={12} />
    case 'transit':
      return <Bus size={12} />
    case 'car':
      return <Car size={12} />
    default:
      return <Car size={12} />
  }
}

function getTransportLabel(mode?: CoursePlace['transportMode']) {
  switch (mode) {
    case 'walk':
      return '도보'
    case 'transit':
      return '대중교통'
    case 'car':
      return '자동차'
    default:
      return '자동차'
  }
}

type TimelineItem = CoursePlace & {
  arrivalTime: number
  stayMinutes: number
  isLast: boolean
}

export function TimelineSection() {
  const { places, selectedDay, departureTime } = useCourseStore()

  const dayPlaces = places.filter((p) => p.dayIndex === selectedDay)

  const departureMinutes =
    (departureTime.period === 'pm' && departureTime.hour !== 12
      ? departureTime.hour + 12
      : departureTime.period === 'am' && departureTime.hour === 12
        ? 0
        : departureTime.hour) *
      60 +
    departureTime.minute

  const timelineItems = useMemo(() => {
    return dayPlaces.reduce<TimelineItem[]>((acc, place, idx) => {
      const prevMinutes =
        acc.length === 0
          ? departureMinutes
          : acc[acc.length - 1].arrivalTime + acc[acc.length - 1].stayMinutes
      const stayMinutes = place.stayMinutes ?? 60
      return [
        ...acc,
        {
          ...place,
          arrivalTime: prevMinutes,
          stayMinutes,
          isLast: idx === dayPlaces.length - 1,
        },
      ]
    }, [])
  }, [dayPlaces, departureMinutes])

  if (dayPlaces.length === 0) {
    return (
      <div className={sectionStyle}>
        <h3 className={sectionTitleStyle}>{selectedDay}일차 타임라인</h3>
        <p className={emptyStyle}>이 일차에 추가된 장소가 없어요</p>
      </div>
    )
  }

  return (
    <div className={sectionStyle}>
      <h3 className={sectionTitleStyle}>{selectedDay}일차 타임라인</h3>
      {timelineItems.map((place) => (
        <div key={place.id}>
          <div className={timelineItemStyle}>
            <div className={timeColumnStyle}>
              {formatTime(place.arrivalTime)}
            </div>
            <div className={dotLineStyle}>
              <div className={dotStyle} />
              {!place.isLast && <div className={lineStyle} />}
            </div>
            <div className={cardStyle}>
              <p className={placeNameStyle}>{place.name}</p>
              <p className={placeAddressStyle}>{place.address}</p>
              <div className={stayStyle}>
                <Clock size={12} />
                <span>{place.stayMinutes}분 머무르기</span>
              </div>
            </div>
          </div>
          {!place.isLast && (
            <div className={transportStyle}>
              {getTransportIcon(place.transportMode)}
              <span>{getTransportLabel(place.transportMode)}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default TimelineSection

'use client'

import { useMemo } from 'react'
import { Clock, Footprints, Bus, Car } from 'lucide-react'

import { useCourseStore } from '@/store/tripsStore'
import type { CoursePlace } from '@/features/trips/types/course.types'

import { css } from '@/styled-system/css'

const listStyle = css({
  display: 'flex',
  flexDirection: 'column',
})

const rowStyle = css({
  display: 'flex',
  gap: '3',
  alignItems: 'flex-start',
})

const timeColumnStyle = css({
  w: '16',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  pt: '2',
  gap: '0.5',
})

const timePeriodStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
  lineHeight: '1',
})

const timeValueStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.primary',
  lineHeight: '1',
})

const dotLineStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexShrink: 0,
  pt: '2',
})

const dotStyle = css({
  w: '2.5',
  h: '2.5',
  borderRadius: 'pill',
  bg: 'primary',
  flexShrink: 0,
  ring: '2',
  ringColor: 'primary.soft',
})

const lineStyle = css({
  w: '0.5',
  flex: 1,
  minH: '4',
  bg: 'border.subtle',
  mt: '1',
})

const placeCardStyle = css({
  flex: 1,
  p: '3',
  borderRadius: 'lg',
  bg: 'bg.muted',
  mb: '1',
})

const placeNameStyle = css({
  fontWeight: 'semibold',
  fontSize: 'sm',
  color: 'text.primary',
})

const placeAddressStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
  mt: '0.5',
  truncate: true,
})

const tagsRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.5',
  mt: '2',
  flexWrap: 'wrap',
})

const categoryChipStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  px: '1.5',
  py: '0.5',
  borderRadius: 'xs',
  bg: 'bg.surface',
  color: 'text.secondary',
  fontSize: 'xs',
  lineHeight: '1',
  whiteSpace: 'nowrap',
})

const stayChipStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  px: '1.5',
  py: '0.5',
  borderRadius: 'xs',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'xs',
  lineHeight: '1',
  whiteSpace: 'nowrap',
})

const connectorStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.5',
  pl: '19',
  py: '1',
  fontSize: 'xs',
  color: 'text.secondary',
})

const emptyStyle = css({
  textAlign: 'center',
  py: '8',
  color: 'text.secondary',
  fontSize: 'sm',
})

function formatTimeParts(totalMinutes: number): {
  period: string
  time: string
} {
  const h = Math.floor(totalMinutes / 60) % 24
  const m = totalMinutes % 60
  const period = h < 12 ? '오전' : '오후'
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h
  return { period, time: `${displayH}:${String(m).padStart(2, '0')}` }
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) {
    return `${m}분`
  }
  if (m === 0) {
    return `${h}시간`
  }
  return `${h}시간 ${m}분`
}

function formatCategory(category: string): string {
  const parts = category.split(' > ')
  return parts[parts.length - 1]
}

function getTransportIcon(mode?: CoursePlace['transportMode']) {
  switch (mode) {
    case 'walk':
      return <Footprints size={11} />
    case 'transit':
      return <Bus size={11} />
    default:
      return <Car size={11} />
  }
}

function getTransportLabel(mode?: CoursePlace['transportMode']) {
  switch (mode) {
    case 'walk':
      return '도보'
    case 'transit':
      return '대중교통'
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
  const places = useCourseStore((s) => s.places)
  const selectedDay = useCourseStore((s) => s.selectedDay)
  const departureTime = useCourseStore((s) => s.departureTime)

  const dayPlaces = useMemo(
    () => places.filter((p) => p.dayIndex === selectedDay),
    [places, selectedDay]
  )

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
      const prev = acc[acc.length - 1]
      const prevArrival =
        acc.length === 0
          ? departureMinutes
          : prev.arrivalTime + prev.stayMinutes + (prev.travelMinutes ?? 0)
      return [
        ...acc,
        {
          ...place,
          arrivalTime: prevArrival,
          stayMinutes: place.stayMinutes ?? 60,
          isLast: idx === dayPlaces.length - 1,
        },
      ]
    }, [])
  }, [dayPlaces, departureMinutes])

  if (dayPlaces.length === 0) {
    return <p className={emptyStyle}>이 일차에 추가된 장소가 없어요</p>
  }

  return (
    <div className={listStyle}>
      {timelineItems.map((place) => {
        const { period, time } = formatTimeParts(place.arrivalTime)
        return (
          <div key={place.id}>
            <div className={rowStyle}>
              {/* 시간 열 */}
              <div className={timeColumnStyle}>
                <span className={timePeriodStyle}>{period}</span>
                <span className={timeValueStyle}>{time}</span>
              </div>

              {/* 점 + 선 */}
              <div className={dotLineStyle}>
                <div className={dotStyle} />
                {!place.isLast && <div className={lineStyle} />}
              </div>

              {/* 장소 카드 */}
              <div className={placeCardStyle}>
                <p className={placeNameStyle}>{place.name}</p>
                <p className={placeAddressStyle}>{place.address}</p>
                <div className={tagsRowStyle}>
                  {place.category && (
                    <span className={categoryChipStyle}>
                      {formatCategory(place.category)}
                    </span>
                  )}
                  <span className={stayChipStyle}>
                    <Clock size={10} />
                    {formatDuration(place.stayMinutes)}
                  </span>
                </div>
              </div>
            </div>

            {/* 이동 커넥터 */}
            {!place.isLast && (
              <div className={connectorStyle}>
                {getTransportIcon(place.transportMode)}
                <span>{getTransportLabel(place.transportMode)}</span>
                {(place.travelMinutes ?? 0) > 0 && (
                  <span>· {formatDuration(place.travelMinutes!)}</span>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default TimelineSection

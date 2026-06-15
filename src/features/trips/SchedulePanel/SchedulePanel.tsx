'use client'

import { Clock } from 'lucide-react'

import { useCourseStore } from '@/store/tripsStore'
import type { CourseDateRange } from '@/features/trips/types/course.types'

import { DateRangePicker } from './components/DateRangePicker'
import { DayTabGroup } from './components/DayTabGroup'
import { TimelineSection } from './components/TimelineSection'
import { TimePicker } from './components/TimePicker'

import { css } from '@/styled-system/css'

const cardStyle = css({
  bg: 'bg.surface',
  borderRadius: '2xl',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  p: '4',
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
})

const cardTitleStyle = css({
  fontSize: 'md',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const cardDescStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  mt: '0.5',
})

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '4',
})

const labelStyle = css({
  fontSize: 'sm',
  fontWeight: 'medium',
  color: 'text.secondary',
  mb: '2',
})

const durationFieldStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  w: 'full',
  px: '4',
  py: '3',
  borderWidth: '1px',
  borderColor: 'border',
  borderRadius: 'xl',
  bg: 'bg.surface',
  fontSize: 'sm',
})

const durationInputStyle = css({
  w: '10',
  textAlign: 'center',
  border: 'none',
  outline: 'none',
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.primary',
  bg: 'transparent',
  p: '0',
})

const unitLabelStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
})

const cardHeaderStyle = css({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
})

const badgeStyle = css({
  bg: 'primary.soft',
  color: 'primary',
  borderRadius: 'pill',
  fontSize: 'xs',
  px: '2',
  py: '0.5',
  fontWeight: 'medium',
  flexShrink: 0,
})

export function ScheduleCard() {
  const dateRange = useCourseStore((s) => s.dateRange)
  const departureTime = useCourseStore((s) => s.departureTime)
  const selectedDay = useCourseStore((s) => s.selectedDay)
  const estimatedHours = useCourseStore((s) => s.estimatedHours)
  const estimatedMinutes = useCourseStore((s) => s.estimatedMinutes)
  const setDateRange = useCourseStore((s) => s.setDateRange)
  const setDepartureTime = useCourseStore((s) => s.setDepartureTime)
  const setSelectedDay = useCourseStore((s) => s.setSelectedDay)
  const setEstimatedHours = useCourseStore((s) => s.setEstimatedHours)
  const setEstimatedMinutes = useCourseStore((s) => s.setEstimatedMinutes)

  const handleDateRangeChange = (range: CourseDateRange | null) => {
    setDateRange(range)
    setSelectedDay(1)
  }

  return (
    <div className={cardStyle}>
      <div className={cardHeaderStyle}>
        <div>
          <h2 className={cardTitleStyle}>일정 설정</h2>
          <p className={cardDescStyle}>
            여행 날짜, 출발 시간, 일차를 선택하세요
          </p>
        </div>
        <span className={badgeStyle}>{selectedDay}일차</span>
      </div>

      <div className={gridStyle}>
        <div>
          <p className={labelStyle}>여행 날짜</p>
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
        </div>
        <div>
          <p className={labelStyle}>출발 시간</p>
          <TimePicker value={departureTime} onChange={setDepartureTime} />
        </div>
      </div>

      <div className={gridStyle}>
        <div>
          <p className={labelStyle}>일차 선택</p>
          <DayTabGroup
            dateRange={dateRange}
            selectedDay={selectedDay}
            onSelect={setSelectedDay}
          />
        </div>
        <div>
          <p className={labelStyle}>예상 소요 시간</p>
          <div className={durationFieldStyle}>
            <Clock
              size={16}
              className={css({ color: 'primary', flexShrink: 0 })}
            />
            <span className={unitLabelStyle}>약</span>
            <input
              type="number"
              min={0}
              max={23}
              value={estimatedHours}
              onChange={(e) =>
                setEstimatedHours(
                  Math.min(23, Math.max(0, Number(e.target.value)))
                )
              }
              className={durationInputStyle}
              aria-label="예상 소요 시간 (시)"
            />
            <span className={unitLabelStyle}>시간</span>
            <input
              type="number"
              min={0}
              max={59}
              value={estimatedMinutes}
              onChange={(e) =>
                setEstimatedMinutes(
                  Math.min(59, Math.max(0, Number(e.target.value)))
                )
              }
              className={durationInputStyle}
              aria-label="예상 소요 시간 (분)"
            />
            <span className={unitLabelStyle}>분</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TimelineCard() {
  const places = useCourseStore((s) => s.places)
  const selectedDay = useCourseStore((s) => s.selectedDay)
  const dayPlaces = places.filter((p) => p.dayIndex === selectedDay)

  return (
    <div className={cardStyle}>
      <div className={cardHeaderStyle}>
        <div>
          <h2 className={cardTitleStyle}>타임라인</h2>
          <p className={cardDescStyle}>
            {selectedDay}일차 예상 방문 흐름이에요
          </p>
        </div>
        <span className={badgeStyle}>{dayPlaces.length}곳</span>
      </div>
      <TimelineSection />
    </div>
  )
}

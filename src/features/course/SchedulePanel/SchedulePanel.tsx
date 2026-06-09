'use client'

import { Clock } from 'lucide-react'

import type { CourseDateRange } from '@/features/course/course.types'
import { useCourseStore } from '@/store/courseStore'

import { css } from '@/styled-system/css'

import { DateRangePicker } from './components/DateRangePicker'
import { DayTabGroup } from './components/DayTabGroup'
import { TimePicker } from './components/TimePicker'

const panelStyle = css({
  bg: 'bg.surface',
  borderRadius: 'lg',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  boxShadow: 'md',
  p: '6',
  w: '765px',
  h: '365px',
})

const headerTitleStyle = css({
  fontSize: 'lg',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const headerDescStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  mt: '1',
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

export function SchedulePanel() {
  const {
    dateRange,
    departureTime,
    selectedDay,
    estimatedHours,
    estimatedMinutes,
    setDateRange,
    setDepartureTime,
    setSelectedDay,
    setEstimatedHours,
    setEstimatedMinutes,
  } = useCourseStore()

  const handleDateRangeChange = (range: CourseDateRange | null) => {
    setDateRange(range)
    setSelectedDay(1)
  }

  return (
    <div className={panelStyle}>
      {/* Header */}
      <div className={css({ mb: '6' })}>
        <h2 className={headerTitleStyle}>일정 설정</h2>
        <p className={headerDescStyle}>여행 날짜와 출발 시간을 설정해주세요.</p>
      </div>

      {/* Row 1: Date Range + Departure Time */}
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

      {/* Row 2: Day Selection + Estimated Duration */}
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4',
          mt: '4',
        })}
      >
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
            <span className={css({ color: 'text.secondary', fontSize: 'sm' })}>
              약
            </span>
            <input
              type="number"
              min={0}
              max={23}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className={durationInputStyle}
            />
            <span className={unitLabelStyle}>시간</span>
            <input
              type="number"
              min={0}
              max={59}
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
              className={durationInputStyle}
            />
            <span className={unitLabelStyle}>분</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchedulePanel

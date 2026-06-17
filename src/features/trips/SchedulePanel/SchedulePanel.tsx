'use client'

import { useCourseStore } from '@/store/tripsStore'
import type { CourseDateRange } from '@/features/trips/types/course.types'

import { DateRangePicker } from './components/DateRangePicker'
import { DayTabGroup } from './components/DayTabGroup'

import {
  cardStyle,
  cardTitleStyle,
  cardDescStyle,
} from '@/features/trips/styles/courseEditor.styles'

import { css } from '@/styled-system/css'

const labelStyle = css({
  fontSize: 'sm',
  fontWeight: 'medium',
  color: 'text.secondary',
  mb: '2',
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
  const selectedDay = useCourseStore((s) => s.selectedDay)
  const setDateRange = useCourseStore((s) => s.setDateRange)
  const setSelectedDay = useCourseStore((s) => s.setSelectedDay)

  const handleDateRangeChange = (range: CourseDateRange | null) => {
    setDateRange(range)
    setSelectedDay(1)
  }

  return (
    <div className={cardStyle}>
      <div className={cardHeaderStyle}>
        <div>
          <h2 className={cardTitleStyle}>일정 설정</h2>
          <p className={cardDescStyle}>여행 날짜와 일차를 선택하세요</p>
        </div>
        <span className={badgeStyle}>{selectedDay}일차</span>
      </div>

      <div>
        <p className={labelStyle}>여행 날짜</p>
        <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
      </div>

      <div>
        <p className={labelStyle}>일차 선택</p>
        <DayTabGroup
          dateRange={dateRange}
          selectedDay={selectedDay}
          onSelect={setSelectedDay}
        />
      </div>
    </div>
  )
}

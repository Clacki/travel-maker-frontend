'use client'

import type { CourseDateRange } from '@/features/course/course.types'

import { css } from '@/styled-system/css'

interface DayTabGroupProps {
  dateRange: CourseDateRange | null
  selectedDay: number
  onSelect: (day: number) => void
}

function calcDayCount(dateRange: CourseDateRange | null): number {
  if (!dateRange?.from) {
    return 1
  }
  if (!dateRange.to) {
    return 1
  }
  const diff = Math.ceil(
    (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
  )
  return Math.max(1, diff + 1)
}

const selectedTabStyle = css({
  px: '4',
  py: '1.5',
  fontSize: 'sm',
  fontWeight: 'medium',
  borderRadius: 'pill',
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 150ms, color 150ms',
  bg: 'primary',
  color: 'text.inverse',
})

const unselectedTabStyle = css({
  px: '4',
  py: '1.5',
  fontSize: 'sm',
  fontWeight: 'medium',
  borderRadius: 'pill',
  borderWidth: '1px',
  borderColor: 'border',
  cursor: 'pointer',
  transition: 'background-color 150ms, color 150ms',
  bg: 'bg.surface',
  color: 'text.primary',
  _hover: { borderColor: 'primary', color: 'primary' },
})

export function DayTabGroup({
  dateRange,
  selectedDay,
  onSelect,
}: DayTabGroupProps) {
  const dayCount = calcDayCount(dateRange)

  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
      {Array.from({ length: dayCount }, (_, i) => i + 1).map((day) => (
        <button
          key={day}
          type="button"
          className={
            selectedDay === day ? selectedTabStyle : unselectedTabStyle
          }
          onClick={() => onSelect(day)}
        >
          {day}일차
        </button>
      ))}
    </div>
  )
}

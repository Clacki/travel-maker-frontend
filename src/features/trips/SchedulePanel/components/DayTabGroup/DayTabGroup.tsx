'use client'

import type { CourseDateRange } from '@/features/trips/types/course.types'
import { MAX_TRIP_DAYS } from '@/features/trips/types/course.types'

import { css, cva } from '@/styled-system/css'

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
  return Math.min(Math.max(1, diff + 1), MAX_TRIP_DAYS)
}

const tabStyle = cva({
  base: {
    px: '4',
    py: '1.5',
    fontSize: 'sm',
    fontWeight: 'medium',
    borderRadius: 'pill',
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: '150ms',
  },
  variants: {
    selected: {
      true: {
        bg: 'primary',
        color: 'text.inverse',
        border: 'none',
      },
      false: {
        bg: 'primary.soft',
        color: 'primary',
        borderWidth: '1px',
        borderColor: 'primary.soft',
        _hover: { borderColor: 'primary' },
      },
    },
  },
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
          className={tabStyle({ selected: selectedDay === day })}
          onClick={() => onSelect(day)}
        >
          {day}일차
        </button>
      ))}
    </div>
  )
}

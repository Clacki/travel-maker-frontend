'use client'

import { useEffect, useRef, useState } from 'react'

import { DayPicker } from 'react-day-picker'
import { Calendar, ChevronDown } from 'lucide-react'

import type { CourseDateRange } from '@/features/trips/types/course.types'
import { MAX_TRIP_DAYS } from '@/features/trips/types/course.types'

import { css } from '@/styled-system/css'

interface DateRangePickerProps {
  value: CourseDateRange | null
  onChange: (range: CourseDateRange | null) => void
}

const triggerStyle = css({
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
  cursor: 'pointer',
  transitionProperty: 'border-color',
  transitionDuration: '150ms',
  _hover: { borderColor: 'primary' },
  _focusVisible: { outline: 'none', boxShadow: 'focus' },
})

const dropdownStyle = css({
  position: 'fixed',
  mt: '1',
  zIndex: 9999,
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  boxShadow: 'md',
  p: '4',
  w: '320px',
})

const calendarClassNames = {
  root: css({ w: 'full' }),
  months: css({ display: 'flex', justifyContent: 'center' }),
  month: css({ w: 'full' }),
  month_caption: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pb: '3',
    mb: '2',
    borderBottomWidth: '1px',
    borderColor: 'border.subtle',
    position: 'relative',
  }),
  caption_label: css({
    fontSize: 'sm',
    fontWeight: 'semibold',
    color: 'text.primary',
  }),
  nav: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    w: 'full',
  }),
  button_previous: css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    w: '7',
    h: '7',
    borderRadius: 'sm',
    bg: 'transparent',
    border: 'none',
    color: 'text.secondary',
    cursor: 'pointer',
    _hover: { bg: 'bg.muted', color: 'primary' },
    _focusVisible: { outline: 'none', boxShadow: 'focus' },
  }),
  button_next: css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    w: '7',
    h: '7',
    borderRadius: 'sm',
    bg: 'transparent',
    border: 'none',
    color: 'text.secondary',
    cursor: 'pointer',
    _hover: { bg: 'bg.muted', color: 'primary' },
    _focusVisible: { outline: 'none', boxShadow: 'focus' },
  }),
  // border-collapse: separate + spacing:0 → TD에 border-radius 적용 가능
  month_grid: css({
    w: 'full',
    borderCollapse: 'separate',
    borderSpacing: '0',
  }),
  weekdays: css({ mb: '1' }),
  weekday: css({
    w: '10',
    h: '8',
    fontSize: 'xs',
    fontWeight: 'medium',
    color: 'text.secondary',
    textAlign: 'center',
  }),
  week: css({}),
  day: css({
    w: '10',
    h: '10',
    p: '0',
    textAlign: 'center',
    verticalAlign: 'middle',
  }),
  day_button: css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    w: '10',
    h: '10',
    borderRadius: 'pill',
    fontSize: 'sm',
    border: 'none',
    bg: 'transparent',
    color: 'text.primary',
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: '150ms',
    _hover: { bg: 'primary.soft', color: 'primary' },
    _focusVisible: { outline: 'none', boxShadow: 'focus' },
  }),
  // 단일 날짜 선택: TD 배경 없음, 버튼만 teal 원
  selected: css({
    '& button': {
      bg: 'primary',
      color: 'text.inverse',
      _hover: { bg: 'primary.hover' },
    },
  }),
  // range 시작: TD 좌측만 둥근 모서리
  range_start: css({
    bg: 'primary',
    borderTopLeftRadius: 'pill',
    borderBottomLeftRadius: 'pill',
    borderTopRightRadius: '0',
    borderBottomRightRadius: '0',
    '& button': {
      bg: 'transparent',
      color: 'text.inverse',
      borderRadius: '0',
      _hover: { bg: 'transparent' },
    },
  }),
  // range 중간: TD 직각으로 채워 연결
  range_middle: css({
    bg: 'primary',
    borderRadius: '0',
    '& button': {
      bg: 'transparent',
      color: 'text.inverse',
      borderRadius: '0',
      _hover: { bg: 'transparent' },
    },
  }),
  // range 끝: TD 우측만 둥근 모서리
  range_end: css({
    bg: 'primary',
    borderTopRightRadius: 'pill',
    borderBottomRightRadius: 'pill',
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
    '& button': {
      bg: 'transparent',
      color: 'text.inverse',
      borderRadius: '0',
      _hover: { bg: 'transparent' },
    },
  }),
  today: css({
    '& button': {
      fontWeight: 'bold',
      textDecoration: 'underline',
      textUnderlineOffset: '2px',
    },
  }),
  outside: css({
    '& button': {
      color: 'border',
      _hover: { bg: 'bg.muted', color: 'text.secondary' },
    },
  }),
  disabled: css({
    '& button': {
      color: 'border',
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  }),
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

function getDisplayText(value: CourseDateRange | null): string {
  if (!value || !value.from) {
    return '날짜를 선택하세요'
  }
  if (!value.to) {
    return `${formatDate(value.from)} —`
  }
  return `${formatDate(value.from)} — ${formatDate(value.to)}`
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 })
  const [pendingFrom, setPendingFrom] = useState<Date | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  useEffect(() => {
    if (!open) {
      return
    }
    const handleScroll = () => setOpen(false)
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [open])

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setDropdownPos({ top: rect.bottom + 4, left: rect.left })
    }
    // 기존 값이 MAX_TRIP_DAYS 초과인 경우 리셋
    if (value?.from && value?.to) {
      const maxDate = new Date(value.from)
      maxDate.setDate(maxDate.getDate() + (MAX_TRIP_DAYS - 1))
      if (value.to > maxDate) {
        onChange({ from: value.from, to: maxDate })
      }
    }
    setPendingFrom(null)
    setOpen((prev) => !prev)
  }

  const hasValue = value?.from !== undefined
  const displayText = getDisplayText(value)

  return (
    <div ref={containerRef} className={css({ position: 'relative' })}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerStyle}
        onClick={handleOpen}
        aria-expanded={open}
      >
        <Calendar
          size={16}
          className={css({ color: 'primary', flexShrink: 0 })}
        />
        <span
          className={css({
            flex: 1,
            textAlign: 'left',
            color: hasValue ? 'text.primary' : 'text.secondary',
          })}
        >
          {displayText}
        </span>
        <ChevronDown
          size={16}
          className={css({
            color: 'text.secondary',
            flexShrink: 0,
            transitionProperty: 'transform',
            transitionDuration: '150ms',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          })}
        />
      </button>

      {open && (
        <div
          className={dropdownStyle}
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          <DayPicker
            mode="range"
            selected={
              value?.from ? { from: value.from, to: value.to } : undefined
            }
            disabled={(date) => {
              if (!pendingFrom) {
                return false
              }
              const maxDate = new Date(pendingFrom)
              maxDate.setDate(maxDate.getDate() + (MAX_TRIP_DAYS - 1))
              maxDate.setHours(23, 59, 59, 999)
              return date > maxDate
            }}
            onSelect={(range) => {
              if (!range || !range.from) {
                onChange(null)
                setPendingFrom(null)
                return
              }

              const from = range.from
              let to = range.to

              if (!to) {
                // from만 선택 — 이후 선택 제한용으로 기록
                setPendingFrom(from)
                onChange({ from, to: undefined })
                return
              }

              // to까지 선택됐을 때 MAX_TRIP_DAYS 초과 시 클램핑
              const maxDate = new Date(from)
              maxDate.setDate(maxDate.getDate() + (MAX_TRIP_DAYS - 1))
              if (to > maxDate) to = maxDate

              setPendingFrom(null)
              onChange({ from, to })
              setOpen(false)
            }}
            classNames={calendarClassNames}
          />
        </div>
      )}
    </div>
  )
}

export default DateRangePicker

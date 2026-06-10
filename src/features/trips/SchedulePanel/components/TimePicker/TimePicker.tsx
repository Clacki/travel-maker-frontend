'use client'

import { useEffect, useRef, useState } from 'react'

import { ChevronDown, Clock } from 'lucide-react'

import type { DepartureTime } from '@/features/trips/types/course.types'

import { css, cva } from '@/styled-system/css'

interface TimePickerProps {
  value: DepartureTime
  onChange: (time: DepartureTime) => void
}

// 00:00 ~ 23:00 시간대 목록 생성
const TIME_SLOTS: { label: string; value: DepartureTime }[] = Array.from(
  { length: 24 },
  (_, i) => {
    const period = i < 12 ? 'am' : 'pm'
    const hour = i === 0 ? 12 : i > 12 ? i - 12 : i
    const label = `${String(i).padStart(2, '0')}:00`
    return { label, value: { period, hour, minute: 0 } }
  }
)

function formatDisplay(v: DepartureTime): string {
  const periodLabel = v.period === 'am' ? '오전' : '오후'
  const minuteStr = String(v.minute).padStart(2, '0')
  return `${periodLabel} ${v.hour}:${minuteStr}`
}

function isSameTime(a: DepartureTime, b: DepartureTime) {
  return a.period === b.period && a.hour === b.hour && a.minute === b.minute
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
  position: 'absolute',
  top: '100%',
  left: '0',
  mt: '1',
  zIndex: 50,
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  boxShadow: 'md',
  w: 'full',
  minW: '36',
  maxH: '60',
  overflowY: 'auto',
  py: '1',
})

const slotStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    w: 'full',
    px: '4',
    py: '3',
    fontSize: 'sm',
    cursor: 'pointer',
  },
  variants: {
    selected: {
      true: {
        bg: 'primary.soft',
        color: 'primary',
        fontWeight: 'semibold',
      },
      false: {
        transitionProperty: 'background-color',
        transitionDuration: '150ms',
        _hover: { bg: 'bg.muted' },
      },
    },
  },
})

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedRef = useRef<HTMLButtonElement>(null)

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

  // 열릴 때 선택된 항목으로 스크롤
  useEffect(() => {
    if (open && selectedRef.current) {
      selectedRef.current.scrollIntoView({ block: 'center' })
    }
  }, [open])

  // 페이지 스크롤 시 닫기
  useEffect(() => {
    if (!open) {
      return
    }
    const handleScroll = (e: Event) => {
      // TimePicker 내부 목록 스크롤은 무시
      if (containerRef.current?.contains(e.target as Node)) {
        return
      }
      setOpen(false)
    }
    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [open])

  return (
    <div ref={containerRef} className={css({ position: 'relative' })}>
      <button
        type="button"
        className={triggerStyle}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <Clock
          size={16}
          className={css({ color: 'text.secondary', flexShrink: 0 })}
        />
        <span
          className={css({ flex: 1, textAlign: 'left', color: 'text.primary' })}
        >
          {formatDisplay(value)}
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
        <div className={dropdownStyle}>
          {TIME_SLOTS.map((slot) => {
            const selected = isSameTime(slot.value, value)
            return (
              <button
                key={slot.label}
                ref={selected ? selectedRef : undefined}
                type="button"
                className={slotStyle({ selected })}
                onClick={() => {
                  onChange(slot.value)
                  setOpen(false)
                }}
              >
                {slot.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TimePicker

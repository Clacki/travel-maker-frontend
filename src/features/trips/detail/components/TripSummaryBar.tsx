import { css } from '@/styled-system/css'
import type { TripCourseDetail } from '../types/tripDetail'

const summaryStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: { base: '2', md: '4' },
  px: { base: '4', md: '5' },
  py: '3',
  bg: 'primary.soft',
  color: 'text.primary',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  fontSize: 'sm',
  fontWeight: 'semibold',
})

const dividerStyle = css({
  color: 'text.secondary',
})

interface TripSummaryBarProps {
  trip: TripCourseDetail
}

export function TripSummaryBar({ trip }: TripSummaryBarProps) {
  return (
    <div className={summaryStyle} aria-label="코스 요약">
      <span>장소 {trip.placeCount}개</span>
      <span className={dividerStyle}>|</span>
      <span>{trip.region}</span>
      <span className={dividerStyle}>|</span>
      <span>{trip.durationLabel}</span>
      <span className={dividerStyle}>|</span>
      <span>{trip.isPublic ? '공유 가능' : '비공개'}</span>
      <span className={dividerStyle}>|</span>
      <span>선택한 장소 순서 기준</span>
    </div>
  )
}

import { Plus } from 'lucide-react'

import { Button } from '@/components/common/button'
import { EmptyState } from '@/components/common/status'
import { css } from '@/styled-system/css'

import type { MyTripCourse } from '../../types/mypage'
import { MyTripCourseCard } from './MyTripCourseCard'

interface MyTripsSectionProps {
  trips: MyTripCourse[]
  canManage: boolean
  onCreateTrip: () => void
}

const sectionStyle = css({
  mt: '6',
})

const headerStyle = css({
  display: 'flex',
  flexDirection: { base: 'column', sm: 'row' },
  alignItems: { base: 'stretch', sm: 'center' },
  justifyContent: 'space-between',
  gap: '3',
})

const countStyle = css({
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'medium',
})

const listStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
  mt: '6',
})

export function MyTripsSection({
  trips,
  canManage,
  onCreateTrip,
}: MyTripsSectionProps) {
  if (trips.length === 0) {
    return (
      <div className={sectionStyle}>
        <EmptyState
          title="아직 작성한 여행 코스가 없어요"
          description="마음에 드는 장소를 모아 나만의 여행 코스를 만들어보세요."
          actionLabel={canManage ? '새 코스 만들기' : undefined}
          onAction={canManage ? onCreateTrip : undefined}
        />
      </div>
    )
  }

  return (
    <section className={sectionStyle} aria-label="내 여행 코스 목록">
      <div className={headerStyle}>
        <p className={countStyle}>총 {trips.length}개의 여행 코스</p>
        {canManage ? (
          <Button
            variant="primary"
            size="sm"
            shape="pill"
            onClick={onCreateTrip}
          >
            <Plus size={16} aria-hidden="true" />새 코스 만들기
          </Button>
        ) : null}
      </div>

      <div className={listStyle}>
        {trips.map((trip) => (
          <MyTripCourseCard
            key={trip.routeId}
            course={trip}
            canManage={canManage}
          />
        ))}
      </div>
    </section>
  )
}

'use client'

import { useEffect } from 'react'

import {
  CourseInfoCard,
  CoursePlaceCard,
} from '@/features/trips/CourseSidePanel/CourseSidePanel'
import {
  ScheduleCard,
  TimelineCard,
} from '@/features/trips/SchedulePanel/SchedulePanel'
import CourseMapPanel from '@/features/trips/CourseMapPanel'
import { LayoutContainer } from '@/components/layout/LayoutContainer'
import { useCourseStore } from '@/store/tripsStore'

import type { TripDetailResponse } from '@/features/trips/types/trips.types'
import type { CoursePlace } from '@/features/trips/types/course.types'

import { css } from '@/styled-system/css'

interface TripCourseEditPageProps {
  trip: TripDetailResponse
}

const pageStyle = css({
  minH: 'calc(100vh - 72px)',
  bg: 'bg.canvas',
})

const headerStyle = css({
  pt: '6',
  pb: '4',
})

const badgeStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1.5',
  px: '2.5',
  py: '1',
  bg: 'primary.soft',
  color: 'primary',
  borderRadius: 'pill',
  fontSize: 'xs',
  fontWeight: 'medium',
  mb: '3',
})

const badgeDotStyle = css({
  w: '1.5',
  h: '1.5',
  borderRadius: 'pill',
  bg: 'primary',
  flexShrink: 0,
})

const pageTitleStyle = css({
  fontSize: '3xl',
  fontWeight: 'bold',
  color: 'text.primary',
  lineHeight: 'tight',
  mb: '2',
})

const pageSubtitleStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
})

const bodyStyle = css({
  display: 'flex',
  alignItems: 'flex-start',
})

const leftStyle = css({
  flex: '0 0 44%',
  minW: 0,
  pr: '3',
  py: '4',
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
})

const rightStyle = css({
  flex: '0 0 56%',
  minW: 0,
  position: 'sticky',
  top: '72px',
  height: 'calc(100vh - 72px)',
  pl: '3',
  py: '4',
  overflow: 'hidden',
})

export function TripCourseEditPage({ trip }: TripCourseEditPageProps) {
  const initCourse = useCourseStore((state) => state.initCourse)

  useEffect(() => {
    // TODO: 백엔드 API에서 dayIndex를 포함한 응답이 오면 dayIndex 매핑 로직 수정 필요
    // 현재는 TripPlace 타입에 dayIndex가 없어 모든 장소를 1일차로 처리
    const places: CoursePlace[] = trip.places.map((p) => ({
      id: p.id,
      name: p.name,
      address: p.address,
      dayIndex: 1,
      lat: p.lat,
      lng: p.lng,
    }))

    const startDate = trip.startDate ? new Date(trip.startDate) : undefined
    const endDate = trip.endDate ? new Date(trip.endDate) : undefined

    initCourse({
      title: trip.title,
      description: trip.description,
      selectedRegion: trip.region,
      places,
      dateRange: {
        from: startDate,
        to: endDate,
      },
    })
    // trip.id 기준으로만 초기화 — trip 객체 참조 변경 시 불필요한 store 리셋 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.id])

  return (
    <div className={pageStyle}>
      <LayoutContainer>
        <div className={headerStyle}>
          <div className={badgeStyle}>
            <span className={badgeDotStyle} />
            코스 에디터
          </div>
          <h1 className={pageTitleStyle}>여행 코스 수정하기</h1>
          <p className={pageSubtitleStyle}>
            기존 여행 코스를 수정하고, 일정에 맞춰 코스를 업데이트해보세요.
          </p>
        </div>

        <div className={bodyStyle}>
          <div className={leftStyle}>
            <CourseInfoCard />
            <ScheduleCard />
            <CoursePlaceCard />
            <TimelineCard />
          </div>
          <div className={rightStyle}>
            <CourseMapPanel mode="edit" tripId={trip.id} />
          </div>
        </div>
      </LayoutContainer>
    </div>
  )
}

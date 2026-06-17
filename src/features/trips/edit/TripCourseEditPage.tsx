'use client'

import { useEffect } from 'react'

import {
  CourseInfoCard,
  CoursePlaceCard,
} from '@/features/trips/CourseSidePanel/CourseSidePanel'
import { ScheduleCard } from '@/features/trips/SchedulePanel/SchedulePanel'
import CourseMapPanel from '@/features/trips/CourseMapPanel'
import { PlaceSearchSection } from '@/features/trips/CourseMapPanel/components/PlaceSearchSection'
import { LayoutContainer } from '@/components/layout/LayoutContainer'
import { useCourseStore } from '@/store/tripsStore'

import {
  pageStyle,
  headerStyle,
  badgeDotStyle,
  pageSubtitleStyle,
  bodyStyle,
  pageBadgeStyle,
  pageTitleStyle,
  leftPanelStyle,
  rightPanelStyle,
  searchWrapperStyle,
} from '@/features/trips/styles/courseEditor.styles'

import type { RouteDetail } from '@/features/trips/types/route.types'
import type { CoursePlace } from '@/features/trips/types/course.types'

interface TripCourseEditPageProps {
  route: RouteDetail
}

export function TripCourseEditPage({ route }: TripCourseEditPageProps) {
  const initCourse = useCourseStore((state) => state.initCourse)

  useEffect(() => {
    const places: CoursePlace[] = route.days.flatMap((day) =>
      day.places.map((p) => ({
        id: String(p.place_id),
        backendId: p.place_id,
        name: p.place_name,
        address: [p.address_primary, p.address_detail]
          .filter(Boolean)
          .join(' '),
        dayIndex: day.day_index,
        lat: p.latitude,
        lng: p.longitude,
      }))
    )

    const startDate = route.start_date ? new Date(route.start_date) : undefined
    const endDate = route.end_date ? new Date(route.end_date) : undefined

    initCourse({
      title: route.title,
      description: route.description ?? '',
      selectedRegion: route.region_tag ?? '',
      selectedThemes: route.theme_tags,
      places,
      dateRange: {
        from: startDate,
        to: endDate,
      },
    })
    // route.route_id 기준으로만 초기화 — route 객체 참조 변경 시 불필요한 store 리셋 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.route_id])

  return (
    <div className={pageStyle}>
      <LayoutContainer>
        <div className={headerStyle}>
          <div className={pageBadgeStyle}>
            <span className={badgeDotStyle} />
            코스 에디터
          </div>
          <h1 className={pageTitleStyle}>여행 코스 수정하기</h1>
          <p className={pageSubtitleStyle}>
            기존 여행 코스를 수정하고, 일정에 맞춰 코스를 업데이트해보세요.
          </p>
        </div>

        <div className={bodyStyle}>
          <div className={leftPanelStyle}>
            <CourseInfoCard />
            <ScheduleCard />
            <CoursePlaceCard />
          </div>
          <div className={rightPanelStyle}>
            <CourseMapPanel mode="edit" tripId={route.route_id.toString()} />
            <div className={searchWrapperStyle}>
              <PlaceSearchSection />
            </div>
          </div>
        </div>
      </LayoutContainer>
    </div>
  )
}

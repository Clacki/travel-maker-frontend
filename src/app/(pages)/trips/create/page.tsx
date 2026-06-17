import type { Metadata } from 'next'

import {
  CourseInfoCard,
  CoursePlaceCard,
} from '@/features/trips/CourseSidePanel/CourseSidePanel'
import { ScheduleCard } from '@/features/trips/SchedulePanel/SchedulePanel'
import CourseMapPanel from '@/features/trips/CourseMapPanel'
import { PlaceSearchSection } from '@/features/trips/CourseMapPanel/components/PlaceSearchSection'
import { LayoutContainer } from '@/components/layout/LayoutContainer'

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

export const metadata: Metadata = {
  title: '여행 코스 만들기',
  description:
    '가고 싶은 장소를 지도에서 담고, 일정에 맞춰 나만의 여행 코스를 완성해보세요.',
}

export default function TripsCreatePage() {
  return (
    <div className={pageStyle}>
      <LayoutContainer>
        <div className={headerStyle}>
          <div className={pageBadgeStyle}>
            <span className={badgeDotStyle} />
            코스 에디터
          </div>
          <h1 className={pageTitleStyle}>나만의 여행 코스 만들기</h1>
          <p className={pageSubtitleStyle}>
            가고 싶은 장소를 지도에서 담고, 일정에 맞춰 여행 코스를
            완성해보세요.
          </p>
        </div>

        <div className={bodyStyle}>
          <div className={leftPanelStyle}>
            <CourseInfoCard />
            <ScheduleCard />
            <CoursePlaceCard />
          </div>
          <div className={rightPanelStyle}>
            <CourseMapPanel />
            <div className={searchWrapperStyle}>
              <PlaceSearchSection />
            </div>
          </div>
        </div>
      </LayoutContainer>
    </div>
  )
}

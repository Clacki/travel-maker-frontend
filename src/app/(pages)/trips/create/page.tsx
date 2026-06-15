import type { Metadata } from 'next'

import {
  CourseInfoCard,
  CoursePlaceCard,
} from '@/features/trips/CourseSidePanel/CourseSidePanel'
import {
  ScheduleCard,
  TimelineCard,
} from '@/features/trips/SchedulePanel/SchedulePanel'
import CourseMapPanel from '@/features/trips/CourseMapPanel'
import { PlaceSearchSection } from '@/features/trips/CourseMapPanel/components/PlaceSearchSection'
import { LayoutContainer } from '@/components/layout/LayoutContainer'

import {
  pageStyle,
  headerStyle,
  badgeDotStyle,
  pageSubtitleStyle,
  bodyStyle,
} from '@/features/trips/styles/courseEditor.styles'

import { css } from '@/styled-system/css'

export const metadata: Metadata = {
  title: '여행 코스 만들기',
  description:
    '가고 싶은 장소를 지도에서 담고, 일정에 맞춰 나만의 여행 코스를 완성해보세요.',
}

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
  fontWeight: 'semibold',
  mb: '3',
})

const pageTitleStyle = css({
  fontSize: '3xl',
  fontWeight: 'semibold',
  color: 'text.primary',
  lineHeight: 'tight',
  mb: '2',
})

const leftStyle = css({
  flex: '0 0 50%',
  minW: 0,
  pr: '3',
  py: '4',
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
})

const rightStyle = css({
  flex: '0 0 50%',
  minW: 0,
  pl: '3',
  py: '4',
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
})

const searchWrapperStyle = css({
  flexShrink: 0,
})

export default function TripsCreatePage() {
  return (
    <div className={pageStyle}>
      <LayoutContainer>
        <div className={headerStyle}>
          <div className={badgeStyle}>
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
          <div className={leftStyle}>
            <CourseInfoCard />
            <ScheduleCard />
            <CoursePlaceCard />
            <TimelineCard />
          </div>
          <div className={rightStyle}>
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

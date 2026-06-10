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
import { LayoutContainer } from '@/components/layout/LayoutContainer'

import { css } from '@/styled-system/css'

export const metadata: Metadata = {
  title: '여행 코스 만들기',
  description:
    '가고 싶은 장소를 지도에서 담고, 일정에 맞춰 나만의 여행 코스를 완성해보세요.',
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
          </div>
        </div>
      </LayoutContainer>
    </div>
  )
}

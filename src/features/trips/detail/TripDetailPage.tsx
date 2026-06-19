import { PageFadeIn } from '@/components/common/PageFadeIn'
import { LayoutContainer } from '@/components/layout'
import type { TripCourseDetail } from './types/tripDetail'
import { SimilarTripCourses } from './components/SimilarTripCourses'
import { TripDayItinerary } from './components/TripDayItinerary'
import { TripDetailActions } from './components/TripDetailActions'
import { TripDetailHero } from './components/TripDetailHero'
import { TripMapPreview } from './components/TripMapPreview'
import { TripSummaryBar } from './components/TripSummaryBar'
import { css } from '@/styled-system/css'

const pageStyle = css({
  bg: 'bg.canvas',
  py: { base: '8', md: '12' },
  pb: { base: '14', md: '20' },
})

const stackStyle = css({
  display: 'grid',
  gap: { base: '8', md: '10' },
})

const contentBlockStyle = css({
  display: 'grid',
  gap: '5',
})

const sectionHeadingStyle = css({
  display: 'grid',
  gap: '2',
})

const sectionEyebrowStyle = css({
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'bold',
})

const sectionTitleStyle = css({
  color: 'text.primary',
  fontSize: { base: 'xl', md: '2xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const sectionDescriptionStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
  lineHeight: 'relaxed',
})

interface TripDetailPageProps {
  trip: TripCourseDetail
}

export function TripDetailPage({ trip }: TripDetailPageProps) {
  return (
    <PageFadeIn>
      <main className={pageStyle}>
        <LayoutContainer>
          <div className={stackStyle}>
            <TripDetailHero trip={trip} />
            <TripSummaryBar trip={trip} />

            <section className={contentBlockStyle} aria-labelledby="map-title">
              <div className={sectionHeadingStyle}>
                <span className={sectionEyebrowStyle}>COURSE MAP</span>
                <h2 id="map-title" className={sectionTitleStyle}>
                  지도 미리보기
                </h2>
                <p className={sectionDescriptionStyle}>
                  장소 순서와 이동 흐름을 지도에서 확인하세요.
                </p>
              </div>
              <TripMapPreview trip={trip} />
            </section>

            <TripDayItinerary trip={trip} />
            <TripDetailActions trip={trip} />
            <SimilarTripCourses trip={trip} />
          </div>
        </LayoutContainer>
      </main>
    </PageFadeIn>
  )
}

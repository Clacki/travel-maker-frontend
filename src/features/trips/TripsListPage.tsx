import { PageFadeIn } from '@/components/common/PageFadeIn'
import { LayoutContainer } from '@/components/layout/LayoutContainer'
import { TripsHeroBanner } from './components/TripsHeroBanner'
import { FeaturedTripCourse } from './components/FeaturedTripCourse'
import { TripsFilterSection } from './components/TripsFilterSection'
import { toTripCourse } from './types/trip'
import { css } from '@/styled-system/css'
import { demoTags } from '../../../mocks/data/demoData'
import { demoRouteList } from '../../../mocks/data/routeData'

const pageStyle = css({
  minH: '100vh',
  bg: 'bg.canvas',
})

const contentStyle = css({
  pb: { base: '16', md: '24' },
  display: 'grid',
  gap: { base: '8', md: '10' },
})

const PAGE_SIZE = 9

export function TripsListPage() {
  const initialRoutes = demoRouteList.slice(0, PAGE_SIZE)
  const courses = initialRoutes.map(toTripCourse)
  const featuredCourse = courses[0]

  return (
    <PageFadeIn>
      <div className={pageStyle}>
        <LayoutContainer className={contentStyle}>
          <TripsHeroBanner />
          {featuredCourse && <FeaturedTripCourse course={featuredCourse} />}
          <TripsFilterSection
            initialCourses={courses}
            initialTotalCount={demoRouteList.length}
            regionTags={demoTags}
            themeTags={demoTags}
            pageSize={PAGE_SIZE}
          />
        </LayoutContainer>
      </div>
    </PageFadeIn>
  )
}

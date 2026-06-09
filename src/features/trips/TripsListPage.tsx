import { LayoutContainer } from '@/components/layout/LayoutContainer'
import { TripsHeroBanner } from './components/TripsHeroBanner'
import { FeaturedTripCourse } from './components/FeaturedTripCourse'
import { TripsFilterSection } from './components/TripsFilterSection'
import { tripCourses } from './data/tripCourses'
import { css } from '@/styled-system/css'

const pageStyle = css({
  minH: '100vh',
  bg: 'bg.canvas',
})

const contentStyle = css({
  pb: { base: '16', md: '24' },
  display: 'grid',
  gap: { base: '8', md: '10' },
})

export function TripsListPage() {
  const featuredCourse =
    tripCourses.find((course) => course.isFeatured) ?? tripCourses[0]

  return (
    <div className={pageStyle}>
      <LayoutContainer className={contentStyle}>
        <TripsHeroBanner />
        <FeaturedTripCourse course={featuredCourse} />
        <TripsFilterSection courses={tripCourses} />
      </LayoutContainer>
    </div>
  )
}

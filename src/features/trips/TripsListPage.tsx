import { LayoutContainer } from '@/components/layout/LayoutContainer'
import { TripsHeroBanner } from './components/TripsHeroBanner'
import { FeaturedTripCourse } from './components/FeaturedTripCourse'
import { TripsFilterSection } from './components/TripsFilterSection'
import { getRoutes } from './api/routesApi'
import { getRegionTags, getThemeTags } from './api/tagsApi'
import { toTripCourse } from './types/trip'
import type { Tag } from '@/types/tag.types'
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

const PAGE_SIZE = 9

export async function TripsListPage() {
  const [routeResult, popularResult, regionTags, themeTags] = await Promise.all(
    [
      getRoutes({ page: 1, page_size: PAGE_SIZE, ordering: 'latest' }).catch(
        () => ({ items: [], totalCount: 0 })
      ),
      getRoutes({ page: 1, page_size: 1, ordering: 'popular' }).catch(() => ({
        items: [],
        totalCount: 0,
      })),
      getRegionTags().catch((): Tag[] => []),
      getThemeTags().catch((): Tag[] => []),
    ]
  )

  const courses = routeResult.items.map(toTripCourse)
  const featuredCourse = popularResult.items[0]
    ? toTripCourse(popularResult.items[0])
    : courses[0]

  return (
    <div className={pageStyle}>
      <LayoutContainer className={contentStyle}>
        <TripsHeroBanner />
        {featuredCourse && <FeaturedTripCourse course={featuredCourse} />}
        <TripsFilterSection
          initialCourses={courses}
          initialTotalCount={routeResult.totalCount}
          regionTags={regionTags}
          themeTags={themeTags}
          pageSize={PAGE_SIZE}
        />
      </LayoutContainer>
    </div>
  )
}

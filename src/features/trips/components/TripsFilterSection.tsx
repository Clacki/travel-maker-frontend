'use client'

import { useEffect, useRef, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { EmptyState } from '@/components/common/status'
import { FilterTag } from '@/components/common/tag'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { toTripCourse } from '../types/trip'
import { getRoutes } from '../api/routesApi'
import { TripCourseCard } from './TripCourseCard'
import type { TripCourse, TripSortOption } from '../types/trip'
import { THEME_OPTIONS } from '../types/course.types'
import type { Tag } from '@/types/tag.types'
import { css } from '@/styled-system/css'

const SORT_OPTIONS: { label: string; value: TripSortOption }[] = [
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' },
]

const ALL_FILTER = '전체'

const sectionStyle = css({
  display: 'grid',
  gap: { base: '8', md: '10' },
})

const filterPanelStyle = css({
  display: 'grid',
  gap: { base: '5', md: '6' },
  p: { base: '4', md: '6' },
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border',
  borderRadius: 'xl',
  boxShadow: 'sm',
})

const filterRowStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: '72px 1fr' },
  alignItems: 'start',
  gap: { base: '3', md: '4' },
})

const filterLabelStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  minH: '8',
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'bold',
})

const chipGroupStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: { base: '2', md: '3' },
})

const sortRowStyle = css({
  display: 'flex',
  alignItems: { base: 'flex-start', md: 'center' },
  justifyContent: 'space-between',
  flexDirection: { base: 'column', md: 'row' },
  gap: '4',
})

const countTextStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
})

const sortSelectStyle = css({
  minH: '9',
  px: '4',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'pill',
  bg: 'bg.surface',
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  transitionProperty: 'border-color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    borderColor: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: {
    base: '1fr',
    md: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(3, minmax(0, 1fr))',
  },
  gap: '6',
})

const loadingGridStyle = css({
  opacity: 0.5,
  transitionProperty: 'opacity',
  transitionDuration: '150ms',
})

const emptyStyle = css({
  py: '12',
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'xl',
})

const paginationWrapStyle = css({
  mb: { base: '8', md: '12' },
})

interface TripsFilterSectionProps {
  initialCourses: TripCourse[]
  initialTotalCount: number
  regionTags: Tag[]
  themeTags: Tag[]
  pageSize: number
}

export function TripsFilterSection({
  initialCourses,
  initialTotalCount,
  regionTags,
  themeTags,
  pageSize,
}: TripsFilterSectionProps) {
  const [region, setRegion] = useState(ALL_FILTER)
  const [theme, setTheme] = useState(ALL_FILTER)
  const [sort, setSort] = useState<TripSortOption>('latest')
  const [currentPage, setCurrentPage] = useState(1)

  const [courses, setCourses] = useState<TripCourse[]>(initialCourses)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [isLoading, setIsLoading] = useState(false)

  // 초기 상태(필터 없음, 최신순, 1페이지)는 서버에서 받은 데이터를 그대로 쓴다.
  const isInitialState = useRef(true)
  const requestId = useRef(0)

  const regionTagMap = new Map(regionTags.map((tag) => [tag.tag_name, tag.id]))
  const themeTagMap = new Map(themeTags.map((tag) => [tag.tag_name, tag.id]))

  useEffect(() => {
    if (isInitialState.current) {
      isInitialState.current = false
      return
    }

    const id = ++requestId.current
    setIsLoading(true)

    const regionTagId =
      region === ALL_FILTER ? undefined : regionTagMap.get(region)
    const themeTagId = theme === ALL_FILTER ? undefined : themeTagMap.get(theme)

    getRoutes({
      ordering: sort,
      page: currentPage,
      page_size: pageSize,
      region_tag_id: regionTagId,
      theme_tag_ids: themeTagId !== undefined ? [themeTagId] : undefined,
    })
      .then((result) => {
        if (id !== requestId.current) return
        setCourses(result.items.map(toTripCourse))
        setTotalCount(result.totalCount)
      })
      .catch(() => {
        if (id !== requestId.current) return
        setCourses([])
        setTotalCount(0)
      })
      .finally(() => {
        if (id !== requestId.current) return
        setIsLoading(false)
      })
    // regionTagMap/themeTagMap은 props 기반으로 안정적이라 의존성에서 제외한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, theme, sort, currentPage, pageSize])

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const changeRegion = (nextRegion: string) => {
    setRegion(nextRegion)
    setCurrentPage(1)
  }

  const changeTheme = (nextTheme: string) => {
    setTheme(nextTheme)
    setCurrentPage(1)
  }

  const changeSort = (nextSort: TripSortOption) => {
    setSort(nextSort)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setRegion(ALL_FILTER)
    setTheme(ALL_FILTER)
    setSort('latest')
    setCurrentPage(1)
  }

  const regionFilters = [ALL_FILTER, ...regionTags.map((tag) => tag.tag_name)]
  const themeFilters = [ALL_FILTER, ...THEME_OPTIONS]

  return (
    <section className={sectionStyle} aria-labelledby="trip-list-title">
      <div className={filterPanelStyle}>
        <div className={filterRowStyle}>
          <span className={filterLabelStyle}>
            <SlidersHorizontal size={15} aria-hidden="true" />
            지역
          </span>
          <div className={chipGroupStyle}>
            {regionFilters.map((filter) => (
              <FilterTag
                key={filter}
                label={filter}
                isSelected={region === filter}
                onClick={() => changeRegion(filter)}
                variant="filter"
              />
            ))}
          </div>
        </div>

        <div className={filterRowStyle}>
          <span className={filterLabelStyle}>
            <SlidersHorizontal size={15} aria-hidden="true" />
            테마
          </span>
          <div className={chipGroupStyle}>
            {themeFilters.map((filter) => (
              <FilterTag
                key={filter}
                label={filter}
                isSelected={theme === filter}
                onClick={() => changeTheme(filter)}
                variant="filter"
              />
            ))}
          </div>
        </div>

        <div className={sortRowStyle}>
          <p className={countTextStyle}>총 {totalCount}개의 여행 코스</p>
          <select
            aria-label="정렬"
            className={sortSelectStyle}
            value={sort}
            onChange={(event) =>
              changeSort(event.target.value as TripSortOption)
            }
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {courses.length > 0 ? (
        <>
          <h2 id="trip-list-title" className={css({ srOnly: true })}>
            여행 코스 목록
          </h2>
          <div
            className={`${gridStyle} ${isLoading ? loadingGridStyle : ''}`}
            aria-busy={isLoading ? 'true' : 'false'}
          >
            {courses.map((course) => (
              <TripCourseCard key={course.id} course={course} />
            ))}
          </div>
          <div className={paginationWrapStyle}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <EmptyState
          title="조건에 맞는 코스가 없어요"
          description="지역이나 테마 필터를 바꿔서 다시 확인해보세요."
          actionLabel="필터 초기화"
          onAction={resetFilters}
          className={emptyStyle}
        />
      )}
    </section>
  )
}

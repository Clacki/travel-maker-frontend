'use client'

import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { EmptyState } from '@/components/common/status'
import { FilterTag } from '@/components/common/tag'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import type { TripCourse, TripSortOption } from '../types/trip'
import {
  REGION_FILTERS,
  SORT_OPTIONS,
  THEME_FILTERS,
} from '../data/tripCourses'
import { TripCourseCard } from './TripCourseCard'
import { css } from '@/styled-system/css'

const ITEMS_PER_PAGE = 9

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
  courses: TripCourse[]
}

function sortCourses(courses: TripCourse[], sort: TripSortOption) {
  const sorted = [...courses]

  if (sort === 'popular') {
    return sorted.sort((a, b) => b.viewCount - a.viewCount)
  }

  if (sort === 'saved') {
    return sorted.sort((a, b) => b.saveCount - a.saveCount)
  }

  return sorted.sort(
    (a, b) =>
      new Date(b.createdAt.replaceAll('.', '-')).getTime() -
      new Date(a.createdAt.replaceAll('.', '-')).getTime()
  )
}

export function TripsFilterSection({ courses }: TripsFilterSectionProps) {
  const [region, setRegion] = useState('전체')
  const [theme, setTheme] = useState('전체')
  const [sort, setSort] = useState<TripSortOption>('latest')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCourses = useMemo(() => {
    const filtered = courses.filter((course) => {
      const matchesRegion = region === '전체' || course.region === region
      const matchesTheme = theme === '전체' || course.themes.includes(theme)
      return matchesRegion && matchesTheme
    })

    return sortCourses(filtered, sort)
  }, [courses, region, sort, theme])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourses.length / ITEMS_PER_PAGE)
  )

  const visibleCourses = filteredCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

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
    setRegion('전체')
    setTheme('전체')
    setSort('latest')
    setCurrentPage(1)
  }

  return (
    <section className={sectionStyle} aria-labelledby="trip-list-title">
      <div className={filterPanelStyle}>
        <div className={filterRowStyle}>
          <span className={filterLabelStyle}>
            <SlidersHorizontal size={15} aria-hidden="true" />
            지역
          </span>
          <div className={chipGroupStyle}>
            {REGION_FILTERS.map((filter) => (
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
            {THEME_FILTERS.map((filter) => (
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
          <p className={countTextStyle}>
            총 {filteredCourses.length}개의 여행 코스
          </p>
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

      {visibleCourses.length > 0 ? (
        <>
          <h2 id="trip-list-title" className={css({ srOnly: true })}>
            여행 코스 목록
          </h2>
          <div className={gridStyle}>
            {visibleCourses.map((course) => (
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

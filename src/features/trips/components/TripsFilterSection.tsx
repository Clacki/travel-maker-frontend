'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { EmptyState } from '@/components/common/status'
import { FilterTag } from '@/components/common/tag'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { toTripCourse } from '../types/trip'
import { getRoutes } from '../api/routesApi'
import { TripCourseCard } from './TripCourseCard'
import type { TripCourse } from '../types/trip'
import type { Tag } from '@/types/tag.types'
import { css } from '@/styled-system/css'

const ALL_FILTER = '전체'

const sectionStyle = css({
  display: 'grid',
  gap: { base: '8', md: '10' },
})

const filterPanelStyle = css({
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border',
  borderRadius: 'xl',
  boxShadow: 'sm',
})

const filterToggleStyle = css({
  width: 'full',
  minH: '14',
  px: { base: '4', md: '6' },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '3',
  bg: 'transparent',
  border: 'none',
  color: 'text.primary',
  cursor: 'pointer',
  textAlign: 'left',
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const filterToggleLabelStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  fontSize: 'md',
  fontWeight: 'bold',
})

const appliedCountStyle = css({
  px: '2.5',
  py: '1',
  borderRadius: 'pill',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'xs',
  fontWeight: 'semibold',
})

const chevronStyle = css({
  flexShrink: 0,
  transitionProperty: 'transform',
  transitionDuration: '200ms',
})

const chevronOpenStyle = css({
  transform: 'rotate(180deg)',
})

const filterCollapseStyle = css({
  display: 'grid',
  gridTemplateRows: '0fr',
  transitionProperty: 'grid-template-rows',
  transitionDuration: '250ms',
  transitionTimingFunction: 'ease',
})

const filterCollapseOpenStyle = css({
  gridTemplateRows: '1fr',
})

const filterCollapseInnerStyle = css({
  overflow: 'hidden',
})

const filterContentStyle = css({
  display: 'grid',
  gap: { base: '5', md: '6' },
  px: { base: '4', md: '6' },
  pb: { base: '4', md: '6' },
  pt: '2',
  borderTopWidth: '1px',
  borderTopColor: 'border.subtle',
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

const countTextStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
})

const filterFooterStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '3',
})

const resetButtonStyle = css({
  px: '3',
  py: '2',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  bg: 'bg.surface',
  color: 'text.secondary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  cursor: 'pointer',
  _hover: {
    borderColor: 'primary',
    color: 'primary',
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
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [region, setRegion] = useState(ALL_FILTER)
  const [theme, setTheme] = useState(ALL_FILTER)
  const [currentPage, setCurrentPage] = useState(1)

  const [courses, setCourses] = useState<TripCourse[]>(initialCourses)
  const [totalCount, setTotalCount] = useState(initialTotalCount)
  const [isLoading, setIsLoading] = useState(false)

  // 초기 상태(필터 없음, 1페이지)는 서버에서 받은 데이터를 그대로 쓴다.
  const isInitialState = useRef(true)
  const requestId = useRef(0)

  const regionTagMap = useMemo(
    () => new Map(regionTags.map((tag) => [tag.tag_name, tag.id])),
    [regionTags]
  )
  const themeTagMap = useMemo(
    () => new Map(themeTags.map((tag) => [tag.tag_name, tag.id])),
    [themeTags]
  )

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
      ordering: 'latest',
      page: currentPage,
      page_size: pageSize,
      region_tag_id: regionTagId,
      theme_tag_ids: themeTagId !== undefined ? [themeTagId] : undefined,
    })
      .then((result) => {
        if (id !== requestId.current) {
          return
        }
        setCourses(result.items.map(toTripCourse))
        setTotalCount(result.totalCount)
      })
      .catch(() => {
        if (id !== requestId.current) {
          return
        }
        setCourses([])
        setTotalCount(0)
      })
      .finally(() => {
        if (id !== requestId.current) {
          return
        }
        setIsLoading(false)
      })
  }, [region, theme, currentPage, pageSize, regionTagMap, themeTagMap])

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const appliedFilterCount =
    Number(region !== ALL_FILTER) + Number(theme !== ALL_FILTER)

  const changeRegion = (nextRegion: string) => {
    setRegion(nextRegion)
    setCurrentPage(1)
  }

  const changeTheme = (nextTheme: string) => {
    setTheme(nextTheme)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setRegion(ALL_FILTER)
    setTheme(ALL_FILTER)
    setCurrentPage(1)
  }

  const regionFilters = [ALL_FILTER, ...regionTags.map((tag) => tag.tag_name)]
  const themeFilters = [ALL_FILTER, ...themeTags.map((tag) => tag.tag_name)]

  return (
    <section className={sectionStyle} aria-labelledby="trip-list-title">
      <div className={filterPanelStyle}>
        <button
          type="button"
          className={filterToggleStyle}
          aria-expanded={isFilterOpen}
          aria-controls="trip-filter-content"
          onClick={() => setIsFilterOpen((open) => !open)}
        >
          <span className={filterToggleLabelStyle}>
            <SlidersHorizontal size={17} aria-hidden="true" />
            필터
            {appliedFilterCount > 0 ? (
              <span className={appliedCountStyle}>
                {appliedFilterCount}개 적용
              </span>
            ) : null}
          </span>
          <ChevronDown
            size={20}
            aria-hidden="true"
            className={`${chevronStyle} ${isFilterOpen ? chevronOpenStyle : ''}`}
          />
        </button>

        <div
          id="trip-filter-content"
          className={`${filterCollapseStyle} ${isFilterOpen ? filterCollapseOpenStyle : ''}`}
        >
          <div className={filterCollapseInnerStyle}>
            <div className={filterContentStyle}>
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

              <div className={filterFooterStyle}>
                <p className={countTextStyle}>총 {totalCount}개의 여행 코스</p>
                <button
                  type="button"
                  className={resetButtonStyle}
                  onClick={resetFilters}
                >
                  초기화
                </button>
              </div>
            </div>
          </div>
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

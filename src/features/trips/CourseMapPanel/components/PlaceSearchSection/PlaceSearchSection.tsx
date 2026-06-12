'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

import { getPlacesSearch } from '@/features/explore/api/placesApi'
import type { Place } from '@/features/explore/types/places.types'
import { useCourseStore } from '@/store/tripsStore'

import { css } from '@/styled-system/css'

import { CategoryTabGroup } from './CategoryTabGroup'
import { PlaceSearchInput } from './PlaceSearchInput'
import { PlaceSearchResultCard } from './PlaceSearchResultCard'

const PAGE_SIZE = 5

const cardStyle = css({
  bg: 'bg.surface',
  borderRadius: '2xl',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  flexShrink: 0,
})

const sectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
  px: '4',
  py: '3',
})

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const titleStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const addDayButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  px: '2.5',
  py: '1',
  fontSize: 'xs',
  fontWeight: 'semibold',
  color: 'primary',
  bg: 'primary.soft',
  borderRadius: 'sm',
  border: 'none',
  cursor: 'default',
  whiteSpace: 'nowrap',
})

const emptyStyle = css({
  py: '4',
  textAlign: 'center',
  fontSize: 'xs',
  color: 'text.secondary',
})

const loadingStyle = css({
  py: '4',
  textAlign: 'center',
  fontSize: 'xs',
  color: 'text.secondary',
})

const resultListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
})

const paginationStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2',
  pt: '1',
  pb: '1',
})

const pageButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  w: '7',
  h: '7',
  borderRadius: 'sm',
  border: 'none',
  bg: 'transparent',
  color: 'text.secondary',
  cursor: 'pointer',
  _hover: {
    bg: 'bg.muted',
    color: 'text.primary',
  },
  _disabled: {
    color: 'text.secondary',
    opacity: '0.4',
    cursor: 'not-allowed',
    _hover: {
      bg: 'transparent',
    },
  },
})

const pageInfoStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
  minW: '12',
  textAlign: 'center',
})

export function PlaceSearchSection() {
  const selectedDay = useCourseStore((s) => s.selectedDay)
  const addPlace = useCourseStore((s) => s.addPlace)
  const places = useCourseStore((s) => s.places)
  const setFocusLocation = useCourseStore((s) => s.setFocusLocation)

  const [keyword, setKeyword] = useState('')
  const [activeCategory, setActiveCategory] = useState('전체')
  const [results, setResults] = useState<Place[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const fetchResults = useCallback(
    (searchKeyword: string, category: string, nextPage: number) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      if (!searchKeyword.trim() && category === '전체') {
        setResults([])
        setTotalCount(0)
        setIsLoading(false)
        return
      }

      // setIsLoading을 setTimeout 내부에서 호출해 debounce 취소 시 로딩 고착 방지
      debounceRef.current = setTimeout(async () => {
        setIsLoading(true)
        try {
          const combinedKeyword =
            category !== '전체'
              ? `${category} ${searchKeyword}`.trim()
              : searchKeyword.trim()

          const response = await getPlacesSearch({
            keyword: combinedKeyword,
            page: nextPage,
            page_size: PAGE_SIZE,
          })
          setResults(response.results)
          setTotalCount(response.count)
        } catch {
          setResults([])
          setTotalCount(0)
        } finally {
          setIsLoading(false)
        }
      }, 300)
    },
    []
  )

  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    setPage(1)
    if (!value) {
      setActiveCategory('전체')
      setResults([])
      setTotalCount(0)
      return
    }
    fetchResults(value, activeCategory, 1)
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setPage(1)
    fetchResults(keyword, category, 1)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    fetchResults(keyword, activeCategory, nextPage)
  }

  const handleAddPlace = (place: Place) => {
    addPlace({
      id: crypto.randomUUID(),
      backendId: place.id,
      name: place.place_name,
      address: place.address ?? '',
      lat: place.lat,
      lng: place.lng,
    })
  }

  const isAdded = (place: Place) => places.some((p) => p.backendId === place.id)

  const hasSearched = keyword.trim() !== '' || activeCategory !== '전체'

  return (
    <div className={cardStyle}>
      <div className={sectionStyle}>
        {/* 헤더 */}
        <div className={headerStyle}>
          <span className={titleStyle}>장소 검색</span>
          <span className={addDayButtonStyle}>
            <Plus size={12} />
            {selectedDay}일차에 추가
          </span>
        </div>

        {/* 검색 입력 */}
        <PlaceSearchInput value={keyword} onChange={handleKeywordChange} />

        {/* 카테고리 탭 */}
        <CategoryTabGroup
          active={activeCategory}
          onChange={handleCategoryChange}
        />

        {/* 검색 결과 */}
        {hasSearched && (
          <>
            {isLoading ? (
              <p className={loadingStyle}>검색 중...</p>
            ) : results.length > 0 ? (
              <>
                <div className={resultListStyle}>
                  {results.map((place) => (
                    <PlaceSearchResultCard
                      key={place.id}
                      place={place}
                      isAdded={isAdded(place)}
                      onAdd={() => handleAddPlace(place)}
                      onViewOnMap={
                        place.lat !== undefined && place.lng !== undefined
                          ? () =>
                              setFocusLocation({
                                lat: place.lat!,
                                lng: place.lng!,
                              })
                          : undefined
                      }
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className={paginationStyle}>
                    <button
                      type="button"
                      className={pageButtonStyle}
                      disabled={page <= 1}
                      onClick={() => handlePageChange(page - 1)}
                      aria-label="이전 페이지"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className={pageInfoStyle}>
                      {page} / {totalPages}
                    </span>
                    <button
                      type="button"
                      className={pageButtonStyle}
                      disabled={page >= totalPages}
                      onClick={() => handlePageChange(page + 1)}
                      aria-label="다음 페이지"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className={emptyStyle}>검색 결과가 없습니다</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

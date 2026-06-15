'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

import { getPlacesSearch } from '@/lib/placesApi'
import type { Place } from '@/types/place.types'
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

const searchIconStyle = css({
  color: 'text.secondary',
  flexShrink: 0,
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
  const mountedRef = useRef(true)

  // 언마운트 시 타이머 정리 + mounted 플래그 해제
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
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
        if (!mountedRef.current) {
          return
        }
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
          if (!mountedRef.current) {
            return
          }
          setResults(response.results)
          setTotalCount(response.count)
        } catch {
          if (!mountedRef.current) {
            return
          }
          setResults([])
          setTotalCount(0)
        } finally {
          if (mountedRef.current) {
            setIsLoading(false)
          }
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

  const parseCoord = (val: string | null): number | undefined => {
    if (!val) {
      return undefined
    }
    const n = parseFloat(val)
    return isNaN(n) ? undefined : n
  }

  const handleAddPlace = (place: Place) => {
    const lat = parseCoord(place.latitude)
    const lng = parseCoord(place.longitude)
    if (lat === undefined || lng === undefined) {
      return
    }
    addPlace({
      id: crypto.randomUUID(),
      backendId: place.id,
      name: place.place_name,
      address: '',
      lat,
      lng,
    })
  }

  const isAdded = (place: Place) => places.some((p) => p.backendId === place.id)

  const hasSearched = keyword.trim() !== '' || activeCategory !== '전체'

  return (
    <div className={cardStyle}>
      <div className={sectionStyle}>
        {/* 헤더 */}
        <div className={headerStyle}>
          <div>
            <span className={titleStyle}>장소 검색</span>
            <p
              className={css({
                fontSize: 'xs',
                color: 'text.secondary',
                mt: '0.5',
              })}
            >
              추가 버튼을 눌러 {selectedDay}일차 코스에 바로 담으세요
            </p>
          </div>
          <Search size={16} className={searchIconStyle} />
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
                      onAdd={
                        place.latitude !== null && place.longitude !== null
                          ? () => handleAddPlace(place)
                          : undefined
                      }
                      onViewOnMap={
                        place.latitude !== null && place.longitude !== null
                          ? () =>
                              setFocusLocation({
                                lat: parseFloat(place.latitude!),
                                lng: parseFloat(place.longitude!),
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

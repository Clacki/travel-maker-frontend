'use client'

import { useEffect, useRef, useState } from 'react'

import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

import { getPlacesFilter } from '@/lib/placesApi'
import type { Place } from '@/types/place.types'
import type { Tag } from '@/types/tag.types'
import { useCourseStore } from '@/store/tripsStore'
import { getCachedRegionAndThemeTags } from '@/features/trips/api/tagsApi'

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

const headerTitleRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
})

const regionBadgeStyle = css({
  px: '2',
  py: '0.5',
  bg: 'primary.soft',
  color: 'primary',
  borderRadius: 'pill',
  fontSize: 'xs',
  fontWeight: 'medium',
})

const headerSubtitleStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
  mt: '0.5',
})

const tagLoadErrorStyle = css({
  fontSize: 'xs',
  color: 'warning',
  mt: '-1',
})

export function PlaceSearchSection() {
  const selectedDay = useCourseStore((s) => s.selectedDay)
  const selectedRegion = useCourseStore((s) => s.selectedRegion)
  const addPlace = useCourseStore((s) => s.addPlace)
  const places = useCourseStore((s) => s.places)
  const setFocusLocation = useCourseStore((s) => s.setFocusLocation)

  const [keyword, setKeyword] = useState('')
  const [activeCategory, setActiveCategory] = useState('전체')
  const [results, setResults] = useState<Place[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  // 마지막 검색이 완료된 시점의 지역 — selectedRegion과 다르면 결과를 숨김
  const [lastSearchedRegion, setLastSearchedRegion] = useState<string | null>(
    null
  )
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)
  const [tagLoadError, setTagLoadError] = useState<string | null>(null)
  // 태그 목록은 렌더링과 무관하게 fetch 결과만 참조 → ref로 관리
  const regionTagsRef = useRef<Tag[]>([])
  const themeTagsRef = useRef<Tag[]>([])

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

  // 지역/테마 태그 로드 (tag ID 기반 필터링에 사용)
  useEffect(() => {
    getCachedRegionAndThemeTags()
      .then(([regions, themes]) => {
        regionTagsRef.current = regions
        themeTagsRef.current = themes
      })
      .catch(() => {
        setTagLoadError(
          '지역/테마 정보를 불러오지 못했습니다. 카테고리 필터가 동작하지 않을 수 있습니다.'
        )
      })
  }, [])

  // fetchResults를 일반 함수로 선언 (React Compiler가 자동 최적화)
  const fetchResults = (
    searchKeyword: string,
    category: string,
    nextPage: number,
    region: string | null
  ) => {
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
        // 지역/카테고리는 tag ID로 필터링 (keyword 조합 방식은 무관한 결과 반환)
        const tagIds: number[] = []

        if (region) {
          const regionTag = regionTagsRef.current.find(
            (t) => t.tag_name === region
          )
          if (regionTag) tagIds.push(regionTag.id)
        }

        // 카테고리 탭이 테마 태그와 일치하면 tag ID 사용, 아니면 keyword 앞에 붙임
        let categoryKeyword = ''
        if (category !== '전체') {
          const themeTag = themeTagsRef.current.find(
            (t) => t.tag_name === category
          )
          if (themeTag) {
            tagIds.push(themeTag.id)
          } else {
            categoryKeyword = category
          }
        }

        const combinedKeyword = [categoryKeyword, searchKeyword]
          .filter(Boolean)
          .join(' ')
          .trim()

        const response = await getPlacesFilter({
          keyword: combinedKeyword || undefined,
          tags: tagIds.length > 0 ? tagIds : undefined,
          page: nextPage,
          page_size: PAGE_SIZE,
        })
        if (!mountedRef.current) {
          return
        }
        setResults(response.results)
        setTotalCount(response.count)
        setLastSearchedRegion(region)
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
  }

  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    setPage(1)
    if (!value) {
      setActiveCategory('전체')
      setResults([])
      setTotalCount(0)
      return
    }
    fetchResults(value, activeCategory, 1, selectedRegion)
  }

  const handleCategoryChange = (category: string) => {
    // 카테고리 변경 시 이전 결과 즉시 초기화 (debounce 중 stale 결과 노출 방지)
    // 키워드도 초기화 — 카테고리 단독 검색이 의도이므로 이전 keyword와 혼합하지 않음
    setActiveCategory(category)
    setKeyword('')
    setPage(1)
    setResults([])
    setTotalCount(0)
    fetchResults('', category, 1, selectedRegion)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    fetchResults(keyword, activeCategory, nextPage, selectedRegion)
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

  // 지역이 변경됐으면 이전 검색 결과 숨김 (useEffect 없이 파생 상태로 처리)
  const displayResults = lastSearchedRegion === selectedRegion ? results : []
  const displayTotal = lastSearchedRegion === selectedRegion ? totalCount : 0
  const totalPages = Math.ceil(displayTotal / PAGE_SIZE)

  const hasSearched = keyword.trim() !== '' || activeCategory !== '전체'

  return (
    <div className={cardStyle}>
      <div className={sectionStyle}>
        {/* 헤더 */}
        <div className={headerStyle}>
          <div>
            <div className={headerTitleRowStyle}>
              <span className={titleStyle}>장소 검색</span>
              {selectedRegion && (
                <span className={regionBadgeStyle}>{selectedRegion}</span>
              )}
            </div>
            <p className={headerSubtitleStyle}>
              {selectedRegion
                ? `${selectedRegion} 지역 장소만 검색됩니다 · ${selectedDay}일차`
                : `추가 버튼을 눌러 ${selectedDay}일차 코스에 바로 담으세요`}
            </p>
          </div>
          <Search size={16} className={searchIconStyle} />
        </div>

        {/* 태그 로드 에러 */}
        {tagLoadError && <p className={tagLoadErrorStyle}>{tagLoadError}</p>}

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
            ) : displayResults.length > 0 ? (
              <>
                <div className={resultListStyle}>
                  {displayResults.map((place) => (
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

'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react'
import { DestinationCard } from '@/components/cards/destination-card'
import { getAllDestinations } from '@/lib/travel-data'
import { travelFilterSections } from '@/lib/filter-data'
import { css } from '@/styled-system/css'

type SortKey = 'popular' | 'bookmarks' | 'reviews'

// 결정적 해시 (mock 정렬용)
function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++)
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

// style 태그 ID → categoryId 매핑
const STYLE_TO_CATEGORY: Record<string, string> = {
  beach: 'beach',
  mountain: 'mountain',
  city: 'city',
  culture: 'culture',
  food: 'food',
  activity: 'adventure',
  romantic: 'romantic',
}

const SORT_LABELS: Record<SortKey, string> = {
  popular: '인기순',
  bookmarks: '북마크순',
  reviews: '리뷰순',
}

// URL searchParams → Record<string, string[]> 파싱
function parseParams(
  searchParams: ReturnType<typeof useSearchParams>
): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  searchParams.forEach((value, key) => {
    if (key !== 'sort' && value) result[key] = value.split(',')
  })
  return result
}

// 선택된 필터의 레이블 목록 반환
function getFilterChips(selected: Record<string, string[]>) {
  const chips: { sectionId: string; tagId: string; label: string }[] = []
  for (const section of travelFilterSections) {
    const ids = selected[section.id] || []
    for (const tagId of ids) {
      const tag = section.tags.find((t) => t.id === tagId)
      if (tag) {
        const label = tag.emoji ? `${tag.emoji} ${tag.label}` : tag.label
        chips.push({ sectionId: section.id, tagId, label })
      }
    }
  }
  return chips
}

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreContent />
    </Suspense>
  )
}

function ExploreContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const sort = (searchParams.get('sort') ?? 'popular') as SortKey
  const selected = useMemo(() => parseParams(searchParams), [searchParams])
  const filterChips = useMemo(() => getFilterChips(selected), [selected])

  const all = useMemo(() => getAllDestinations(), [])

  const filtered = useMemo(() => {
    let result = all

    // style 필터 (카테고리 기반)
    if (selected.style?.length) {
      const cats = selected.style
        .map((s) => STYLE_TO_CATEGORY[s])
        .filter(Boolean)
      if (cats.length)
        result = result.filter((d) => cats.includes(d.categoryId))
    }

    // region 필터 — 한국 지역 선택 시 대한민국 여행지만
    if (selected.region?.length) {
      result = result.filter((d) => d.location.includes('대한민국'))
    }

    return result
  }, [all, selected])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sort === 'popular') return arr.sort((a, b) => b.rating - a.rating)
    if (sort === 'bookmarks')
      return arr.sort(
        (a, b) => (hash(b.id + 'bm') % 1000) - (hash(a.id + 'bm') % 1000)
      )
    if (sort === 'reviews')
      return arr.sort(
        (a, b) => (hash(b.id + 'rv') % 5000) - (hash(a.id + 'rv') % 5000)
      )
    return arr
  }, [filtered, sort])

  function setSort(key: SortKey) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', key)
    router.push(`/travel/explore?${params.toString()}`)
  }

  function removeFilter(sectionId: string, tagId: string) {
    const params = new URLSearchParams(searchParams.toString())
    const current = (params.get(sectionId) ?? '')
      .split(',')
      .filter((v) => v && v !== tagId)
    if (current.length) params.set(sectionId, current.join(','))
    else params.delete(sectionId)
    router.push(`/travel/explore?${params.toString()}`)
  }

  function clearAllFilters() {
    const params = new URLSearchParams()
    if (searchParams.get('sort')) params.set('sort', searchParams.get('sort')!)
    router.push(
      `/travel/explore${params.toString() ? `?${params.toString()}` : ''}`
    )
  }

  const hasFilter = filterChips.length > 0

  return (
    <main className={css({ minH: '100vh', bg: 'background' })}>
      <div className={css({ h: '66px' })} />

      {/* 페이지 헤더 */}
      <section
        className={css({
          py: 10,
          px: 6,
          borderBottom: '1px solid',
          borderColor: 'border',
        })}
      >
        <div className={css({ maxW: '7xl', mx: 'auto' })}>
          <Link
            href="/"
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              color: 'muted.foreground',
              textDecoration: 'none',
              mb: 5,
              fontSize: 'sm',
              _hover: { color: 'foreground' },
              transitionProperty: 'background-color, color, border-color',
              transitionDuration: '200ms',
              transitionTimingFunction: 'ease-in-out',
            })}
          >
            <ArrowLeft className={css({ w: 4, h: 4 })} />
            홈으로
          </Link>

          <div
            className={css({
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 4,
            })}
          >
            <div>
              <h1
                className={css({
                  fontSize: { base: '2xl', md: '3xl' },
                  fontWeight: 'bold',
                  color: 'foreground',
                  mb: 1,
                })}
              >
                여행지 탐색
              </h1>
              <p className={css({ fontSize: 'sm', color: 'muted.foreground' })}>
                {hasFilter ? `필터 적용됨 · ` : ''}
                {sorted.length}개의 여행지
              </p>
            </div>

            {/* 정렬 탭 */}
            <div className={css({ display: 'flex', gap: '6px' })}>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  className={css({
                    px: '14px',
                    py: '7px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1.5px solid',
                    transition: 'all 0.15s',
                    borderColor: sort === key ? 'primary' : 'border',
                    bg: sort === key ? 'primary' : 'card',
                    color:
                      sort === key ? 'primary.foreground' : 'muted.foreground',
                    _hover:
                      sort === key
                        ? {}
                        : { borderColor: 'primary/40', color: 'foreground' },
                  })}
                >
                  {SORT_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

          {/* 활성 필터 칩 */}
          {hasFilter && (
            <div
              className={css({
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                mt: 4,
                alignItems: 'center',
              })}
            >
              <span
                className={css({
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'primary',
                  mr: 1,
                })}
              >
                필터
              </span>
              {filterChips.map((chip) => (
                <span
                  key={`${chip.sectionId}-${chip.tagId}`}
                  className={css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    bg: 'primary/10',
                    color: 'primary',
                    fontSize: '11px',
                    fontWeight: 600,
                    px: '10px',
                    py: '3px',
                    borderRadius: '50px',
                    border: '1.5px solid',
                    borderColor: 'primary/20',
                  })}
                >
                  {chip.label}
                  <span
                    onClick={() => removeFilter(chip.sectionId, chip.tagId)}
                    className={css({
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      _hover: { color: 'foreground' },
                    })}
                  >
                    <X className={css({ w: '10px', h: '10px' })} />
                  </span>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className={css({
                  fontSize: '11px',
                  color: 'muted.foreground',
                  cursor: 'pointer',
                  border: 'none',
                  bg: 'transparent',
                  _hover: { color: 'foreground' },
                  ml: 1,
                })}
              >
                전체 초기화
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 여행지 그리드 */}
      <section className={css({ py: 10, px: 6 })}>
        <div className={css({ maxW: '7xl', mx: 'auto' })}>
          {sorted.length > 0 ? (
            <div
              className={css({
                display: 'grid',
                gridTemplateColumns: {
                  base: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                  xl: 'repeat(4, 1fr)',
                },
                gap: 6,
              })}
            >
              {sorted.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className={css({ textAlign: 'center', py: 20 })}>
              <p
                className={css({
                  fontSize: 'lg',
                  color: 'muted.foreground',
                  mb: 4,
                })}
              >
                조건에 맞는 여행지가 없습니다
              </p>
              <button
                onClick={clearAllFilters}
                className={css({
                  px: 6,
                  py: 3,
                  bg: 'primary',
                  color: 'primary.foreground',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  _hover: { opacity: 0.88 },
                })}
              >
                필터 초기화하기
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        className={css({
          borderTop: '1px solid',
          borderColor: 'border',
          py: 4,
          px: 6,
          bg: 'background',
        })}
      >
        <div className={css({ maxW: '7xl', mx: 'auto', textAlign: 'center' })}>
          <p className={css({ fontSize: 'xs', color: 'muted.foreground' })}>
            &copy; 2026 TravelMaker. 당신의 완벽한 여행을 응원합니다.
          </p>
        </div>
      </footer>
    </main>
  )
}

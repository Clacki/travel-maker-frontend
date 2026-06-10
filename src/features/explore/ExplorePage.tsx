'use client'

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { travelCategories } from '@/mocks/data/travel-data'
import { travelFilterSections } from '@/lib/filter-data'
import { getPlaces, getPlacesFilter } from './api/placesApi'
import type { Place, GetPlacesFilterParams } from './types/places.types'
import { FilterCard } from '@/components/filters/filter-card'
import { LoginModal } from '@/components/auth/LoginModal'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { PlaceCard } from '@/components/ui/PlaceCard/PlaceCard'
import { ROUTES } from '@/constants/routes'
import { css } from '@/styled-system/css'

const ITEMS_PER_PAGE = 12

type SortKey = 'popular' | 'bookmarks' | 'reviews'

const SORT_LABELS: Record<SortKey, string> = {
  popular: '인기순',
  bookmarks: '북마크순',
  reviews: '리뷰순',
}

const SORT_API_MAP: Record<
  SortKey,
  Pick<GetPlacesFilterParams, 'sort' | 'order'>
> = {
  popular: {},
  bookmarks: { sort: 'bookmark', order: 'desc' },
  reviews: { sort: 'review', order: 'desc' },
}

const DEFAULT_BG =
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&h=900&fit=crop'

const STYLE_TO_CATEGORY: Record<string, string> = {
  beach: 'beach',
  mountain: 'mountain',
  city: 'city',
  culture: 'culture',
  food: 'food',
  activity: 'adventure',
  romantic: 'romantic',
}

const CATEGORY_TO_TAG_ID: Record<string, number> = {
  beach: 1,
  mountain: 2,
  city: 3,
  culture: 4,
  food: 5,
  adventure: 6,
  romantic: 7,
}

function parseParams(
  searchParams: ReturnType<typeof useSearchParams>
): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  searchParams.forEach((value, key) => {
    if (key !== 'sort' && key !== 'category' && value) {
      result[key] = value.split(',')
    }
  })
  return result
}

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

function ExploreContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isLoggedIn, isAuthInitialized } = useAuthStore()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const categoryId = searchParams.get('category')
  const sort = (searchParams.get('sort') ?? 'popular') as SortKey
  const selected = useMemo(() => parseParams(searchParams), [searchParams])
  const filterChips = useMemo(() => getFilterChips(selected), [selected])

  const [previewStyle, setPreviewStyle] = useState<string[] | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [fetchedKey, setFetchedKey] = useState<string | null>(null)
  const gridRef = useRef<HTMLElement>(null)

  const currentPage = Math.max(
    1,
    parseInt(searchParams.get('page') ?? '1', 10) || 1
  )

  const selectedTagIds = useMemo(() => {
    const styleValues = (selected.style ?? []).filter((s) => s !== 'all')
    const fromStyle = styleValues
      .map((s) => {
        const cat = STYLE_TO_CATEGORY[s] ?? s
        return CATEGORY_TO_TAG_ID[cat]
      })
      .filter((id): id is number => id !== undefined)

    if (fromStyle.length === 0 && categoryId) {
      const fallbackId = CATEGORY_TO_TAG_ID[categoryId]
      if (fallbackId !== undefined) return [fallbackId]
    }

    return fromStyle
  }, [selected, categoryId])

  const selectedTagIdsKey = selectedTagIds.join(',')

  const currentKey = `${currentPage}-${selectedTagIdsKey}-${sort}`
  const isLoading = fetchedKey !== currentKey

  useEffect(() => {
    let cancelled = false
    const key = `${currentPage}-${selectedTagIdsKey}-${sort}`
    // 배열을 deps에 넣으면 매 렌더마다 새 참조 → 무한 루프, string으로 deps 우회 후 여기서 복원
    const tagIds = selectedTagIdsKey
      ? selectedTagIdsKey.split(',').map(Number)
      : []
    const sortParams = SORT_API_MAP[sort]
    const needsFilter = tagIds.length > 0 || sort !== 'popular'

    const request = needsFilter
      ? getPlacesFilter({
          ...(tagIds.length > 0 ? { tags: tagIds } : {}),
          ...sortParams,
          page: currentPage,
          page_size: ITEMS_PER_PAGE,
        })
      : getPlaces({ page: currentPage, page_size: ITEMS_PER_PAGE })

    request
      .then((data) => {
        if (cancelled) return
        setPlaces(data.results)
        setTotalCount(data.count)
        setFetchedKey(key)
      })
      .catch(() => {
        if (cancelled) return
        setPlaces([])
        setFetchedKey(key)
      })

    return () => {
      cancelled = true
    }
  }, [currentPage, selectedTagIdsKey, sort])

  const handleFilterChange = useCallback(
    (liveSelected: Record<string, string[]>) => {
      setPreviewStyle(liveSelected.style ?? [])
    },
    []
  )

  const activeCategoryId = useMemo(() => {
    const effectiveStyle = previewStyle ?? selected.style ?? []
    const nonAllStyles = effectiveStyle.filter((s) => s !== 'all')
    if (nonAllStyles.length > 0) {
      const lastStyle = nonAllStyles[nonAllStyles.length - 1]
      return STYLE_TO_CATEGORY[lastStyle] ?? categoryId ?? null
    }
    if (categoryId) {
      return categoryId
    }
    return null
  }, [categoryId, previewStyle, selected.style])

  const activeCategory = useMemo(
    () => travelCategories.find((c) => c.id === activeCategoryId) ?? null,
    [activeCategoryId]
  )

  const bgImage = activeCategory?.image ?? DEFAULT_BG
  const heroTitle = activeCategory?.name ?? '여행지 탐색'
  const heroDesc =
    activeCategory?.description ?? '세계 각지의 여행지를 탐색해 보세요'

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/explore?${params.toString()}`, { scroll: false })
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function setSort(key: SortKey) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', key)
    params.set('page', '1')
    router.push(`/explore?${params.toString()}`, { scroll: false })
  }

  function applyFilters(newSelected: Record<string, string[]>) {
    const params = new URLSearchParams()

    const styleValues = newSelected.style ?? []
    let newCategoryId = categoryId
    if (styleValues.length === 1 && styleValues[0] !== 'all') {
      newCategoryId = STYLE_TO_CATEGORY[styleValues[0]] ?? categoryId
    } else if (styleValues.length === 0 || styleValues.includes('all')) {
      newCategoryId = null
    }

    if (newCategoryId) {
      params.set('category', newCategoryId)
    }
    if (searchParams.get('sort')) {
      params.set('sort', searchParams.get('sort')!)
    }
    for (const [key, values] of Object.entries(newSelected)) {
      if (values.length > 0) {
        params.set(key, values.join(','))
      }
    }
    params.set('page', '1')
    router.push(`/explore?${params.toString()}`, { scroll: false })
  }

  function removeFilter(sectionId: string, tagId: string) {
    const params = new URLSearchParams(searchParams.toString())
    const current = (params.get(sectionId) ?? '')
      .split(',')
      .filter((v) => v && v !== tagId)
    if (current.length) {
      params.set(sectionId, current.join(','))
    } else {
      params.delete(sectionId)
    }
    params.set('page', '1')
    router.push(`/explore?${params.toString()}`, { scroll: false })
  }

  function clearAllFilters() {
    const params = new URLSearchParams()
    if (categoryId) {
      params.set('category', categoryId)
    }
    if (searchParams.get('sort')) {
      params.set('sort', searchParams.get('sort')!)
    }
    params.set('page', '1')
    router.push(`/explore?${params.toString()}`, { scroll: false })
  }

  const hasFilter = filterChips.length > 0

  return (
    <main className={css({ minH: '100vh', bg: 'bg.canvas' })}>
      {/* Hero Section */}
      <section
        className={css({
          position: 'relative',
          h: { base: '260px', md: '340px' },
          overflow: 'hidden',
        })}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={css({ position: 'absolute', inset: 0 })}
          >
            <Image
              src={bgImage}
              alt={heroTitle}
              fill
              className={css({ objectFit: 'cover' })}
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div
          className={css({ position: 'absolute', inset: 0 })}
          style={{
            background:
              'linear-gradient(to top, var(--colors-bg-canvas) 0%, color-mix(in srgb, var(--colors-bg-canvas) 50%, transparent) 55%, transparent 100%)',
          }}
        />

        <div
          className={css({
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: { base: 6, md: 12 },
          })}
        >
          <div className={css({ maxW: '7xl', mx: 'auto' })}>
            <AnimatePresence mode="wait">
              <motion.div
                key={heroTitle}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className={css({
                    fontSize: { base: '2xl', md: '4xl' },
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 1,
                  })}
                >
                  {heroTitle}
                </h1>
                <p className={css({ fontSize: 'sm', color: 'text.secondary' })}>
                  {heroDesc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FilterCard */}
      <section
        className={css({
          px: 6,
          py: 4,
          borderBottom: '1px solid',
          borderColor: 'border',
          bg: 'bg.canvas',
        })}
      >
        <div className={css({ maxW: '7xl', mx: 'auto' })}>
          <FilterCard
            sections={travelFilterSections}
            initialSelected={selected}
            resultCount={totalCount}
            onApply={applyFilters}
            onReset={clearAllFilters}
            onChange={handleFilterChange}
          />
        </div>
      </section>

      {/* Sort + Count + Filter Chips */}
      <section
        className={css({
          py: 5,
          px: 6,
          borderBottom: hasFilter ? '1px solid' : 'none',
          borderColor: 'border',
        })}
      >
        <div className={css({ maxW: '7xl', mx: 'auto' })}>
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 4,
            })}
          >
            <p className={css({ fontSize: 'sm', color: 'text.secondary' })}>
              {hasFilter ? '필터 적용됨 · ' : ''}
              {totalCount}개의 여행지
            </p>
            <div className={css({ display: 'flex', gap: '6px' })}>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSort(key)}
                  className={css({
                    px: '14px',
                    py: '7px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1.5px solid',
                    transitionProperty: 'background-color, color, border-color',
                    transitionDuration: '150ms',
                    transitionTimingFunction: 'ease-in-out',
                    borderColor: sort === key ? 'primary' : 'border',
                    bg: sort === key ? 'primary' : 'bg.surface',
                    color: sort === key ? 'text.inverse' : 'text.secondary',
                    _hover:
                      sort === key
                        ? {}
                        : { borderColor: 'primary', color: 'text.primary' },
                  })}
                >
                  {SORT_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

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
                  <button
                    type="button"
                    aria-label={`${chip.label} 필터 제거`}
                    onClick={() => removeFilter(chip.sectionId, chip.tagId)}
                    className={css({
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      border: 'none',
                      bg: 'transparent',
                      color: 'inherit',
                      p: 0,
                      _hover: { color: 'text.primary' },
                    })}
                  >
                    <X className={css({ w: '10px', h: '10px' })} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className={css({
                  fontSize: '11px',
                  color: 'text.secondary',
                  cursor: 'pointer',
                  border: 'none',
                  bg: 'transparent',
                  _hover: { color: 'text.primary' },
                  ml: 1,
                })}
              >
                전체 초기화
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Destinations Grid */}
      <section ref={gridRef} className={css({ py: 10, px: 6 })}>
        <div className={css({ maxW: '7xl', mx: 'auto' })}>
          {isLoading ? (
            <div className={css({ textAlign: 'center', py: 20 })}>
              <p className={css({ fontSize: 'sm', color: 'text.secondary' })}>
                불러오는 중...
              </p>
            </div>
          ) : places.length > 0 ? (
            <>
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
                {places.map((place) => (
                  <div
                    key={place.id}
                    onClick={(e) => {
                      if (!(e.target as HTMLElement).closest('button')) {
                        e.preventDefault()
                        router.push(ROUTES.DETAIL(String(place.id)))
                      }
                    }}
                    className={css({ cursor: 'pointer' })}
                  >
                    <PlaceCard
                      placeId={place.id}
                      placeName={place.place_name}
                      description={place.description}
                      tags={place.tags.map((t) => t.tag_name)}
                      rating={place.rating_avg}
                      imageUrl={place.image_url}
                      variant="bookmark"
                      isLiked={false}
                      onLikeToggle={(_placeId) => {
                        if (!isAuthInitialized) return
                        if (!isLoggedIn) {
                          setIsLoginModalOpen(true)
                          return
                        }
                        // TODO: 찜하기 API 호출 (_placeId 사용)
                      }}
                    />
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </>
          ) : (
            <div className={css({ textAlign: 'center', py: 20 })}>
              <p
                className={css({
                  fontSize: 'lg',
                  color: 'text.secondary',
                  mb: 4,
                })}
              >
                조건에 맞는 여행지가 없습니다
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className={css({
                  px: 6,
                  py: 3,
                  bg: 'primary',
                  color: 'text.inverse',
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
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </main>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreContent />
    </Suspense>
  )
}

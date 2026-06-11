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
import { travelCategories } from '@/mocks/data/travel-data'
import { travelFilterSections } from '@/lib/filter-data'
import { getPlaces, getPlacesFilter, getPlacesSearch } from './api/placesApi'
import { getTags } from './api/tagsApi'
import type { Place, GetPlacesFilterParams } from './types/places.types'
import type { Tag } from './types/tags.types'
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

const CATEGORY_TO_TAG_NAME: Record<string, string> = {
  beach: '해변',
  mountain: '산악',
  city: '도시',
  culture: '문화',
  food: '미식',
  adventure: '액티비티',
  romantic: '로맨틱',
}

const FILTER_TAG_TO_TAG_NAME: Record<string, string> = {
  'beach-coast': '해수욕·해안',
  'water-sports': '수상레저',
  camping: '캠핑·글램핑',
  'mountain-valley': '산·숲·계곡',
  'nature-eco': '자연생태',
  trekking: '자연공원·트레킹',
  landmark: '랜드마크',
  'park-street': '공원·거리',
  shopping: '쇼핑',
  history: '역사·유적',
  museum: '박물관·전시',
  traditional: '전통체험',
  restaurant: '음식점',
  cafe: '카페·디저트',
  market: '시장·먹거리',
  'land-sports': '육상스포츠',
  extreme: '항공·익스트림',
  'theme-park': '테마파크·시설',
  spa: '스파·웰니스',
  resort: '숙박·리조트',
  solo: '혼자',
  couple: '커플',
  family: '가족',
  friends: '친구',
  seoul: '서울',
  gyeonggi: '경기',
  incheon: '인천',
  gangwon: '강원',
  chungbuk: '충북',
  chungnam: '충남',
  daejeon: '대전',
  sejong: '세종',
  jeonbuk: '전북',
  jeonnam: '전남',
  gwangju: '광주',
  gyeongbuk: '경북',
  gyeongnam: '경남',
  daegu: '대구',
  ulsan: '울산',
  busan: '부산',
  jeju: '제주',
  parking: '주차',
  pet: '반려동물',
  free: '무료',
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
  const keyword = searchParams.get('keyword') ?? ''
  const selected = useMemo(() => parseParams(searchParams), [searchParams])
  const filterChips = useMemo(() => getFilterChips(selected), [selected])

  const [tags, setTags] = useState<Tag[] | null>(null)
  const [previewStyle, setPreviewStyle] = useState<string[] | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [fetchedKey, setFetchedKey] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState(keyword)
  const gridRef = useRef<HTMLElement>(null)

  useEffect(() => {
    getTags()
      .then(setTags)
      .catch(() => setTags([]))
  }, [])

  const currentPage = Math.max(
    1,
    parseInt(searchParams.get('page') ?? '1', 10) || 1
  )

  const selectedTagIds = useMemo(() => {
    const tagNameToId = new Map((tags ?? []).map((t) => [t.tag_name, t.id]))
    const ids: number[] = []

    const styleValues = (selected.style ?? []).filter((s) => s !== 'all')
    for (const s of styleValues) {
      const cat = STYLE_TO_CATEGORY[s] ?? s
      const id = tagNameToId.get(CATEGORY_TO_TAG_NAME[cat] ?? '')
      if (id !== undefined) ids.push(id)
    }

    for (const section of ['theme', 'companion', 'region', 'facility']) {
      for (const v of selected[section] ?? []) {
        const id = tagNameToId.get(FILTER_TAG_TO_TAG_NAME[v] ?? '')
        if (id !== undefined) ids.push(id)
      }
    }

    if (ids.length === 0 && categoryId) {
      const id = tagNameToId.get(CATEGORY_TO_TAG_NAME[categoryId] ?? '')
      if (id !== undefined) return [id]
    }

    return ids
  }, [selected, categoryId, tags])

  const selectedTagIdsKey = selectedTagIds.join(',')

  const hasActiveFilter =
    ['style', 'theme', 'companion', 'region', 'facility'].some((section) => {
      const raw = searchParams.get(section) ?? ''
      return raw.split(',').some((v) => v && v !== 'all')
    }) || !!categoryId
  const pendingTag = hasActiveFilter && tags === null ? 'pending' : ''
  const currentKey = `${currentPage}-${selectedTagIdsKey}-${sort}-${keyword}-${pendingTag}`
  const isLoading = fetchedKey !== currentKey

  useEffect(() => {
    let cancelled = false
    const key = `${currentPage}-${selectedTagIdsKey}-${sort}-${keyword}-${pendingTag}`
    if (pendingTag) return
    // 배열을 deps에 넣으면 매 렌더마다 새 참조 → 무한 루프, string으로 deps 우회 후 여기서 복원
    const tagIds = selectedTagIdsKey
      ? selectedTagIdsKey.split(',').map(Number)
      : []
    const sortParams = SORT_API_MAP[sort]
    const hasTags = tagIds.length > 0
    const hasKeyword = keyword.trim().length > 0
    const hasSortOption = sort !== 'popular'

    let request: ReturnType<typeof getPlaces>
    if (hasTags || hasSortOption) {
      request = getPlacesFilter({
        ...(hasTags ? { tags: tagIds } : {}),
        ...(hasKeyword ? { keyword: keyword.trim() } : {}),
        ...sortParams,
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
      })
    } else if (hasKeyword) {
      request = getPlacesSearch({
        keyword: keyword.trim(),
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
      })
    } else {
      request = getPlaces({ page: currentPage, page_size: ITEMS_PER_PAGE })
    }

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
  }, [currentPage, selectedTagIdsKey, sort, keyword, pendingTag])

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
    const trimmedInput = searchInput.trim()
    if (trimmedInput) {
      params.set('keyword', trimmedInput)
    }
    for (const [key, values] of Object.entries(newSelected)) {
      if (values.length > 0) {
        params.set(key, values.join(','))
      }
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
    setSearchInput('')
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
            searchValue={searchInput}
            onSearchChange={setSearchInput}
          />
        </div>
      </section>

      {/* Sort + Count */}
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

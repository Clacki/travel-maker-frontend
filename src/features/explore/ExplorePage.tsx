'use client'

import { Suspense, useCallback, useMemo, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { travelFilterSections } from '@/lib/filter-data'
import { FilterCard } from '@/components/filters/filter-card'
import { LoginModal } from '@/components/auth/LoginModal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { css } from '@/styled-system/css'
import { ITEMS_PER_PAGE, STYLE_TO_CATEGORY } from './constants'
import { parseParams, getFilterChips } from './utils'
import {
  useExplorePlaces,
  useTags,
  getSelectedTagIds,
} from './hooks/useExplorePlaces'
import { useExploreSort } from './hooks/useExploreSort'
import { useExploreHero } from './hooks/useExploreHero'
import { ExploreHero } from './components/ExploreHero'
import { ExploreSortDropdown } from './components/ExploreSortDropdown'
import { ExploreGrid } from './components/ExploreGrid'

function ExploreContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthInitialized } = useAuthStore()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [previewStyle, setPreviewStyle] = useState<string[] | null>(null)
  const gridRef = useRef<HTMLElement>(null)

  const [prevKeyword, setPrevKeyword] = useState(
    searchParams.get('keyword') ?? ''
  )
  const [searchInput, setSearchInput] = useState(
    searchParams.get('keyword') ?? ''
  )
  const keyword = searchParams.get('keyword') ?? ''

  // URL keyword 변경 시(뒤로가기 포함) searchInput 동기화 — React 공식 getDerivedState 패턴
  if (prevKeyword !== keyword) {
    setPrevKeyword(keyword)
    setSearchInput(keyword)
  }

  const categoryId = searchParams.get('category')
  const selected = useMemo(() => parseParams(searchParams), [searchParams])
  const filterChips = useMemo(() => getFilterChips(selected), [selected])
  const currentPage = Math.max(
    1,
    parseInt(searchParams.get('page') ?? '1', 10) || 1
  )

  const tags = useTags()
  const selectedTagIds = useMemo(
    () => getSelectedTagIds(selected, categoryId, tags),
    [selected, categoryId, tags]
  )
  const selectedTagIdsKey = selectedTagIds.join(',')

  const hasActiveFilter =
    ['style', 'theme', 'companion', 'region', 'facility'].some((section) => {
      const raw = searchParams.get(section) ?? ''
      return raw.split(',').some((v) => v && v !== 'all')
    }) || !!categoryId
  const pendingTag = hasActiveFilter && tags === null ? 'pending' : ''

  const {
    sort,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    handleSortSelect,
    isLoggedIn,
  } = useExploreSort(() => setIsLoginModalOpen(true))

  const { places, totalCount, isLoading, handleLikeToggle } = useExplorePlaces({
    currentPage,
    selectedTagIdsKey,
    sort,
    keyword,
    categoryId,
    selected,
    tags,
    pendingTag,
    isAuthInitialized,
    onLoginRequired: () => setIsLoginModalOpen(true),
  })

  const { bgImage, heroTitle, heroDesc } = useExploreHero(
    previewStyle,
    selected,
    categoryId
  )

  const handleFilterChange = useCallback(
    (liveSelected: Record<string, string[]>) => {
      setPreviewStyle(liveSelected.style ?? [])
    },
    []
  )

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/explore?${params.toString()}`, { scroll: false })
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function applyFilters(
    newSelected: Record<string, string[]>,
    searchValue?: string
  ) {
    const params = new URLSearchParams()

    const styleValues = newSelected.style ?? []
    let newCategoryId = categoryId
    if (styleValues.length === 1 && styleValues[0] !== 'all') {
      newCategoryId = STYLE_TO_CATEGORY[styleValues[0]] ?? categoryId
    } else if (styleValues.length === 0 || styleValues.includes('all')) {
      newCategoryId = null
    }

    if (newCategoryId) params.set('category', newCategoryId)
    if (searchParams.get('sort')) params.set('sort', searchParams.get('sort')!)
    for (const [key, values] of Object.entries(newSelected)) {
      if (values.length > 0 && key !== 'keyword' && key !== 'page') {
        params.set(key, values.join(','))
      }
    }
    const trimmedInput = (searchValue ?? searchInput).trim()
    if (trimmedInput) params.set('keyword', trimmedInput)
    params.set('page', '1')
    router.push(`/explore?${params.toString()}`, { scroll: false })
  }

  function clearAllFilters() {
    const params = new URLSearchParams()
    if (categoryId) params.set('category', categoryId)
    if (searchParams.get('sort')) params.set('sort', searchParams.get('sort')!)
    params.set('page', '1')
    setSearchInput('')
    router.push(`/explore?${params.toString()}`, { scroll: false })
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const hasFilter = filterChips.length > 0

  return (
    <main className={css({ minH: '100vh', bg: 'bg.canvas' })}>
      <ExploreHero
        bgImage={bgImage}
        heroTitle={heroTitle}
        heroDesc={heroDesc}
      />

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

      <ExploreSortDropdown
        sort={sort}
        isOpen={isDropdownOpen}
        isLoggedIn={isLoggedIn}
        dropdownRef={dropdownRef}
        onToggle={() => setIsDropdownOpen((prev) => !prev)}
        onSelect={handleSortSelect}
        totalCount={totalCount}
        hasFilter={hasFilter}
      />

      <ExploreGrid
        gridRef={gridRef}
        places={places}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onLikeToggle={handleLikeToggle}
        onPageChange={goToPage}
        onClearFilters={clearAllFilters}
      />


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

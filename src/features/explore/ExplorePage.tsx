'use client'

import { Suspense, useCallback, useMemo, useRef, useState } from 'react'
import { travelFilterSections } from '@/lib/filter-data'
import { FilterCard } from '@/components/filters/filter-card'
import { LoginModal } from '@/components/auth/LoginModal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { css } from '@/styled-system/css'
import { ITEMS_PER_PAGE } from './constants'
import { useExplorePlaces } from './hooks/useExplorePlaces'
import { useTags, getSelectedTagIds } from './hooks/useTags'
import { useExploreSort } from './hooks/useExploreSort'
import { useExploreHero } from './hooks/useExploreHero'
import { useExploreParams } from './hooks/useExploreParams'
import { useExploreTagNames } from './hooks/useExploreTagNames'
import { ExploreHero } from './components/ExploreHero'
import { ExploreSortDropdown } from './components/ExploreSortDropdown'
import { ExploreGrid } from './components/ExploreGrid'

function ExploreContent() {
  const { isAuthInitialized } = useAuthStore()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [previewStyle, setPreviewStyle] = useState<string[] | null>(null)
  const gridRef = useRef<HTMLElement>(null)

  const {
    searchInput,
    setSearchInput,
    filterResetKey,
    filterInitialSelected,
    keyword,
    categoryId,
    currentPage,
    selected,
    filterChips,
    applyFilters,
    clearAllFilters,
    goToPage,
  } = useExploreParams(gridRef)

  const tags = useTags()

  const selectedTagIds = useMemo(
    () => getSelectedTagIds(selected, categoryId, tags),
    [selected, categoryId, tags]
  )
  const selectedTagIdsKey = selectedTagIds.join(',')

  const hasActiveFilter =
    ['style', 'theme', 'companion', 'region', 'facility'].some((section) => {
      const raw = selected[section]?.join(',') ?? ''
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

  const { effectiveTagNames } = useExploreTagNames({
    selected,
    categoryId,
    sort,
  })

  const { places, totalCount, isLoading, handleLikeToggle } = useExplorePlaces({
    currentPage,
    selectedTagIdsKey,
    sort,
    keyword,
    categoryId,
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
            key={filterResetKey}
            sections={travelFilterSections}
            initialSelected={filterInitialSelected}
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
        selectedTagNames={effectiveTagNames}
        sort={sort}
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

'use client'

import { Suspense, useCallback, useMemo, useRef, useState } from 'react'
import { travelFilterSections } from '@/lib/filter-data'
import { FilterCard } from '@/components/filters/filter-card'
import { LoginModal } from '@/components/auth/LoginModal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import {
  useProfileStore,
  getDefaultEditableProfile,
} from '@/store/profileStore'
import { css } from '@/styled-system/css'
import {
  ITEMS_PER_PAGE,
  CATEGORY_TO_TAG_NAME,
  FILTER_TAG_TO_TAG_NAME,
  STYLE_TO_CATEGORY,
} from './constants'
import { useExplorePlaces } from './hooks/useExplorePlaces'
import { useTags, getSelectedTagIds } from './hooks/useTags'
import { useExploreSort } from './hooks/useExploreSort'
import { useExploreHero } from './hooks/useExploreHero'
import { useExploreParams } from './hooks/useExploreParams'
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

  const selectedTagNames = useMemo(() => {
    const names: string[] = []
    const styleValues = (selected.style ?? []).filter((s) => s !== 'all')
    for (const s of styleValues) {
      const cat = STYLE_TO_CATEGORY[s] ?? s
      const name = CATEGORY_TO_TAG_NAME[cat]
      if (name) names.push(name)
    }
    for (const section of ['theme', 'companion', 'region', 'facility']) {
      for (const v of selected[section] ?? []) {
        const name = FILTER_TAG_TO_TAG_NAME[v]
        if (name) names.push(name)
      }
    }
    if (names.length === 0 && categoryId) {
      const name = CATEGORY_TO_TAG_NAME[categoryId]
      if (name) names.push(name)
    }
    return names
  }, [selected, categoryId])

  const userId = useUserProfileStore((state) => state.userProfile?.id)
  const profileTagNames = useMemo(() => {
    const profiles = useProfileStore.getState().profiles
    const profile = userId
      ? (profiles[userId] ?? getDefaultEditableProfile())
      : getDefaultEditableProfile()
    return profile.tagIds
      .map((tagId) => FILTER_TAG_TO_TAG_NAME[tagId])
      .filter((name): name is string => Boolean(name))
  }, [userId])

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

  const effectiveTagNames =
    sort === 'recommended' ? profileTagNames : selectedTagNames

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

'use client'

import { type RefObject, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { css, cx } from '@/styled-system/css'
import { PlaceCard } from '@/components/ui/PlaceCard/PlaceCard'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { ROUTES } from '@/constants/routes'
import { ITEMS_PER_PAGE, type SortKey } from '../constants'
import { PlaceCardSkeleton } from './PlaceCardSkeleton'
import { ExploreEmpty } from './ExploreEmpty'
import type { Place } from '../types/places.types'

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: {
    base: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)',
    xl: 'repeat(4, 1fr)',
  },
  gap: 6,
})

const fadeInStyle = css({ animation: 'fadeIn 0.35s ease' })

interface ExploreGridProps {
  gridRef: RefObject<HTMLElement | null>
  places: Place[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  selectedTagNames: string[]
  sort: SortKey
  onLikeToggle: (placeId: number) => void
  onPageChange: (page: number) => void
  onClearFilters: () => void
}

export function ExploreGrid({
  gridRef,
  places,
  isLoading,
  currentPage,
  totalPages,
  selectedTagNames,
  sort,
  onLikeToggle,
  onPageChange,
  onClearFilters,
}: ExploreGridProps) {
  const selectedTagSet = new Set(selectedTagNames)
  const highlightSuffix = selectedTagNames.length
    ? `?highlight=${selectedTagNames.join(',')}`
    : ''
  const router = useRouter()

  return (
    <section ref={gridRef} className={css({ py: 10, px: 6 })}>
      <div className={css({ maxW: '7xl', mx: 'auto' })}>
        {isLoading ? (
          <div className={gridStyle}>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        ) : places.length > 0 ? (
          <Fragment key={`places-${places.length}-${places[0]?.id ?? ''}`}>
            <div className={cx(gridStyle, fadeInStyle)}>
              {places.map((place) => (
                <div
                  key={place.id}
                  onMouseEnter={() =>
                    router.prefetch(ROUTES.DETAIL(String(place.id)))
                  }
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest('button')) {
                      router.push(
                        ROUTES.DETAIL(String(place.id)) + highlightSuffix
                      )
                    }
                  }}
                  className={css({ cursor: 'pointer' })}
                >
                  <PlaceCard
                    placeId={place.id}
                    placeName={place.place_name}
                    countBadge={
                      sort === 'reviews' && place.review_count !== undefined
                        ? { type: 'review', count: place.review_count }
                        : sort === 'bookmarks'
                          ? { type: 'bookmark', count: place.bookmark_count }
                          : undefined
                    }
                    description={place.description ?? undefined}
                    tags={[...place.tags.map((t) => t.tag_name)].sort(
                      (a, b) =>
                        (selectedTagSet.has(a) ? 0 : 1) -
                        (selectedTagSet.has(b) ? 0 : 1)
                    )}
                    highlightedTags={selectedTagNames}
                    hrefSuffix={highlightSuffix || undefined}
                    rating={Number(place.rating_avg)}
                    imageUrl={place.image_url ?? undefined}
                    variant="bookmark"
                    isLiked={place.is_bookmarked}
                    onLikeToggle={onLikeToggle}
                  />
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </Fragment>
        ) : (
          <ExploreEmpty onClearFilters={onClearFilters} />
        )}
      </div>
    </section>
  )
}

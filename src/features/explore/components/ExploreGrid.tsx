'use client'

import { type RefObject } from 'react'
import { useRouter } from 'next/navigation'
import { css, cx } from '@/styled-system/css'
import { PlaceCard } from '@/components/ui/PlaceCard/PlaceCard'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { ROUTES } from '@/constants/routes'
import { ITEMS_PER_PAGE } from '../constants'
import { PlaceCardSkeleton } from './PlaceCardSkeleton'
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
  totalCount: number
  currentPage: number
  totalPages: number
  onLikeToggle: (placeId: number) => void
  onPageChange: (page: number) => void
  onClearFilters: () => void
}

export function ExploreGrid({
  gridRef,
  places,
  isLoading,
  totalCount,
  currentPage,
  totalPages,
  onLikeToggle,
  onPageChange,
  onClearFilters,
}: ExploreGridProps) {
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
          <>
            <div
              key={`places-${places.length}-${places[0]?.id ?? ''}`}
              className={cx(gridStyle, fadeInStyle)}
            >
              {places.map((place) => (
                <div
                  key={place.id}
                  onMouseEnter={() =>
                    router.prefetch(ROUTES.DETAIL(String(place.id)))
                  }
                  onClick={(e) => {
                    if (!(e.target as HTMLElement).closest('button')) {
                      router.push(ROUTES.DETAIL(String(place.id)))
                    }
                  }}
                  className={css({ cursor: 'pointer' })}
                >
                  <PlaceCard
                    placeId={place.id}
                    placeName={place.place_name}
                    description={place.description ?? undefined}
                    tags={place.tags.map((t) => t.tag_name)}
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
              onClick={onClearFilters}
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
  )
}

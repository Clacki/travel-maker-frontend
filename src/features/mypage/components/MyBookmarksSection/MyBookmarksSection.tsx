import { EmptyState } from '@/components/common/status'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { PlaceCard } from '@/components/ui/PlaceCard'
import { CardGridSkeleton } from '@/features/mypage/components/MyPageSkeleton'
import { css } from '@/styled-system/css'

import type { BookmarkResponseItem } from '../../types/mypage'

interface MyBookmarksSectionProps {
  bookmarks: BookmarkResponseItem[]
  currentPage: number
  totalPages: number
  isLoading: boolean
  canManage: boolean
  onPageChange: (page: number) => void
  onExploreClick: () => void
  onLikeToggle: (placeId: number) => void
}

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: {
    base: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(4, 1fr)',
  },
  gap: '4',
  mt: '4',
})

export function MyBookmarksSection({
  bookmarks,
  currentPage,
  totalPages,
  isLoading,
  canManage,
  onPageChange,
  onExploreClick,
  onLikeToggle,
}: MyBookmarksSectionProps) {
  if (isLoading) {
    return <CardGridSkeleton count={8} />
  }

  if (bookmarks.length === 0) {
    return (
      <EmptyState
        title="첫 번째 여행지를 저장해보세요"
        description="지금 마음에 드는 곳을 찾아보세요."
        actionLabel="여행지 찾아가기"
        onAction={onExploreClick}
      />
    )
  }

  return (
    <>
      <div className={gridStyle}>
        {bookmarks.map((bookmark) => (
          <PlaceCard
            key={bookmark.place.id}
            variant="bookmark"
            placeId={bookmark.place.id}
            placeName={bookmark.place.place_name}
            imageUrl={bookmark.place.main_image || undefined}
            rating={Number(bookmark.place.rating_avg)}
            isLiked={true}
            canManage={canManage}
            onLikeToggle={() => {
              if (canManage) {
                void onLikeToggle(bookmark.place.id)
              }
            }}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  )
}

import { css } from '@/styled-system/css'
import { Skeleton } from '@/components/ui/Skeleton'
import { PlaceCardSkeleton } from '@/features/explore/components/PlaceCardSkeleton'

const heroSkeletonStyle = css({
  position: 'relative',
  h: { base: '260px', md: '340px' },
  bg: 'bg.subtle',
  animation: 'pulse',
})

const filterBarSkeletonStyle = css({
  px: '6',
  py: '4',
  borderBottom: '1px solid',
  borderColor: 'border',
  bg: 'bg.canvas',
})

const filterInnerStyle = css({
  maxW: '7xl',
  mx: 'auto',
  h: '12',
  bg: 'bg.subtle',
  borderRadius: 'md',
  animation: 'pulse',
})

const sortBarSkeletonStyle = css({
  py: '5',
  px: '6',
})

const sortInnerStyle = css({
  maxW: '7xl',
  mx: 'auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const gridSectionStyle = css({
  py: '10',
  px: '6',
})

const gridStyle = css({
  maxW: '7xl',
  mx: 'auto',
  display: 'grid',
  gridTemplateColumns: {
    base: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(3, 1fr)',
    xl: 'repeat(4, 1fr)',
  },
  gap: '6',
})

export default function ExploreLoading() {
  return (
    <main className={css({ minH: '100vh', bg: 'bg.canvas' })}>
      <div className={heroSkeletonStyle} />

      <div className={filterBarSkeletonStyle}>
        <div className={filterInnerStyle} />
      </div>

      <div className={sortBarSkeletonStyle}>
        <div className={sortInnerStyle}>
          <Skeleton width="10%" height="16px" />
          <div className={css({ display: 'flex', gap: '2' })}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} width="80px" height="36px" radius="sm" />
            ))}
          </div>
        </div>
      </div>

      <div className={gridSectionStyle}>
        <div className={gridStyle}>
          {Array.from({ length: 12 }).map((_, i) => (
            <PlaceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  )
}

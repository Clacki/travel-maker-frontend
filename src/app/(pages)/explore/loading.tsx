import { css } from '@/styled-system/css'
import { Skeleton } from '@/components/ui/Skeleton'

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

const cardSkeletonStyle = css({
  borderRadius: 'lg',
  overflow: 'hidden',
  bg: 'bg.surface',
  border: '1px solid',
  borderColor: 'border.subtle',
})

const cardImageStyle = css({
  w: 'full',
  aspectRatio: '16/10',
  bg: 'bg.subtle',
  animation: 'pulse',
})

const cardBodyStyle = css({
  p: '3',
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
})

function PlaceCardSkeleton() {
  return (
    <div className={cardSkeletonStyle}>
      <div className={cardImageStyle} />
      <div className={cardBodyStyle}>
        <Skeleton width="70%" height="20px" />
        <div className={css({ display: 'flex', gap: '1' })}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width="56px" height="20px" radius="pill" />
          ))}
        </div>
        <Skeleton width="90%" height="16px" />
        <Skeleton width="60%" height="16px" />
      </div>
    </div>
  )
}

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

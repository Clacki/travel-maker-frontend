import { css } from '@/styled-system/css'
import { Skeleton } from '@/components/ui/Skeleton'

const placeCardSkeletonStyle = css({
  borderRadius: 'lg',
  overflow: 'hidden',
  bg: 'bg.surface',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border.subtle',
})

const skeletonImageStyle = css({
  w: 'full',
  aspectRatio: '16/10',
  bg: 'bg.subtle',
  animation: 'pulse',
})

const skeletonBodyStyle = css({
  p: '3',
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
})

export function PlaceCardSkeleton() {
  return (
    <div className={placeCardSkeletonStyle}>
      <div className={skeletonImageStyle} />
      <div className={skeletonBodyStyle}>
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

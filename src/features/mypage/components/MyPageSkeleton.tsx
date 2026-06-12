import { css } from '@/styled-system/css'
import { Skeleton } from '@/components/ui/Skeleton'

// ProfileCard 스켈레톤
const cardStyle = css({
  display: 'flex',
  gap: '6',
  p: '6',
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  boxShadow: 'sm',
})

const infoStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
  flex: '1',
})

const statsRowStyle = css({
  display: 'flex',
  gap: '4',
})

const tagRowStyle = css({
  display: 'flex',
  gap: '2',
})

function ProfileCardSkeleton() {
  return (
    <div className={cardStyle}>
      <Skeleton width="80px" height="80px" radius="pill" />
      <div className={infoStyle}>
        <Skeleton width="35%" height="24px" />
        <Skeleton width="55%" height="16px" />
        <div className={statsRowStyle}>
          <Skeleton width="48px" height="40px" />
          <Skeleton width="48px" height="40px" />
        </div>
        <div className={tagRowStyle}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width="56px" height="24px" radius="pill" />
          ))}
        </div>
      </div>
    </div>
  )
}

// 탭 + 카드 그리드 스켈레톤
const tabContentStyle = css({
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  p: { base: '4', md: '6' },
})

const tabListStyle = css({
  display: 'flex',
  gap: '1',
  borderBottomWidth: '1px',
  borderColor: 'border.subtle',
  pb: '1',
  mb: '4',
})

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: {
    base: '1fr',
    sm: 'repeat(2, 1fr)',
    lg: 'repeat(4, 1fr)',
  },
  gap: '4',
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
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} width="48px" height="20px" radius="pill" />
          ))}
        </div>
        <Skeleton width="85%" height="16px" />
      </div>
    </div>
  )
}

interface CardGridSkeletonProps {
  count?: number
}

export function CardGridSkeleton({ count = 8 }: CardGridSkeletonProps) {
  return (
    <div className={gridStyle}>
      {Array.from({ length: count }).map((_, i) => (
        <PlaceCardSkeleton key={i} />
      ))}
    </div>
  )
}

// 전체 마이페이지 스켈레톤 (초기 로딩용)
const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '6',
  maxW: '1120px',
  mx: 'auto',
  px: { base: '4', md: '6' },
  py: { base: '6', md: '8' },
})

export function MyPageSkeleton() {
  return (
    <div className={containerStyle}>
      <ProfileCardSkeleton />
      <div className={tabContentStyle}>
        <div className={tabListStyle}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} width="80px" height="36px" radius="sm" />
          ))}
        </div>
        <CardGridSkeleton count={8} />
      </div>
    </div>
  )
}

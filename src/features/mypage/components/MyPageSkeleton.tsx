import { css } from '@/styled-system/css'

type RadiusToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'pill'

const sk = (w: string, h: string, radius: RadiusToken = 'md') =>
  css({
    w,
    h,
    bg: 'bg.subtle',
    borderRadius: radius,
    animation: 'pulse',
    flexShrink: 0,
  })

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
      <div className={sk('80px', '80px', 'pill')} />
      <div className={infoStyle}>
        <div className={sk('35%', '6')} />
        <div className={sk('55%', '4')} />
        <div className={statsRowStyle}>
          <div className={sk('48px', '10')} />
          <div className={sk('48px', '10')} />
        </div>
        <div className={tagRowStyle}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={sk('56px', '6', 'pill')} />
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
        <div className={sk('70%', '5')} />
        <div className={css({ display: 'flex', gap: '1' })}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className={sk('48px', '5', 'pill')} />
          ))}
        </div>
        <div className={sk('85%', '4')} />
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
            <div key={i} className={sk('80px', '9', 'sm')} />
          ))}
        </div>
        <CardGridSkeleton count={8} />
      </div>
    </div>
  )
}

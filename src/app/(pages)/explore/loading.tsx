import { css } from '@/styled-system/css'

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

const lineStyle = (w: string, h = '4') =>
  css({
    h,
    w,
    bg: 'bg.subtle',
    borderRadius: 'md',
    animation: 'pulse',
  })

const tagRowStyle = css({
  display: 'flex',
  gap: '1',
})

const tagSkeletonStyle = css({
  h: '5',
  w: '14',
  bg: 'bg.subtle',
  borderRadius: 'pill',
  animation: 'pulse',
})

function PlaceCardSkeleton() {
  return (
    <div className={cardSkeletonStyle}>
      <div className={cardImageStyle} />
      <div className={cardBodyStyle}>
        <div className={lineStyle('70%', '5')} />
        <div className={tagRowStyle}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={tagSkeletonStyle} />
          ))}
        </div>
        <div className={lineStyle('90%')} />
        <div className={lineStyle('60%')} />
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
          <div className={lineStyle('10%')} />
          <div className={css({ display: 'flex', gap: '2' })}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={css({
                  h: '9',
                  w: '20',
                  bg: 'bg.subtle',
                  borderRadius: 'sm',
                  animation: 'pulse',
                })}
              />
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

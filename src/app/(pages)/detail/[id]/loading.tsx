import { PageLayout } from '@/components/layout/PageLayout'
import { css } from '@/styled-system/css'
import { Skeleton } from '@/components/ui/Skeleton'

const pageStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8',
})

const contentGridStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 7fr) minmax(0, 5fr)' },
  gap: '6',
  alignItems: 'start',
})

const rightColumnStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
})

const mainImageSkeletonStyle = css({
  w: 'full',
  aspectRatio: '16/10',
  borderRadius: 'lg',
  bg: 'bg.subtle',
  animation: 'pulse',
})

const thumbnailRowStyle = css({
  display: 'flex',
  gap: '2',
})

const infoCardSkeletonStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
  p: '6',
  borderRadius: 'xl',
  border: '1px solid',
  borderColor: 'border.default',
})

const mapSkeletonStyle = css({
  w: 'full',
  h: '200px',
  borderRadius: 'xl',
  bg: 'bg.subtle',
  animation: 'pulse',
})

export default function DetailLoading() {
  return (
    <PageLayout>
      <div className={pageStyle}>
        <Skeleton width="160px" height="16px" />

        <div className={contentGridStyle}>
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '3',
              w: 'full',
            })}
          >
            <div className={mainImageSkeletonStyle} />
            <div className={thumbnailRowStyle}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} width="80px" height="80px" radius="sm" />
              ))}
            </div>
          </div>

          <div className={rightColumnStyle}>
            <div className={infoCardSkeletonStyle}>
              <Skeleton width="60%" height="28px" />
              <Skeleton width="30%" height="16px" />
              <div
                className={css({
                  display: 'flex',
                  gap: '2',
                  flexWrap: 'wrap',
                  mt: '1',
                })}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} width="64px" height="24px" radius="pill" />
                ))}
              </div>
              <Skeleton width="100%" height="16px" />
              <Skeleton width="80%" height="16px" />
              <div
                className={css({
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2',
                  mt: '2',
                })}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} height="48px" />
                ))}
              </div>
            </div>
            <div className={mapSkeletonStyle} />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

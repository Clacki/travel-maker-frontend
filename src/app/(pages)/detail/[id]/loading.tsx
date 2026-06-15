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

        {/* 리뷰 섹션 */}
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '3',
          })}
        >
          <Skeleton width="48px" height="24px" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '3',
                p: '4',
                borderRadius: 'lg',
                border: '1px solid',
                borderColor: 'border.subtle',
              })}
            >
              <div
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2',
                })}
              >
                <Skeleton width="32px" height="32px" radius="pill" />
                <Skeleton width="80px" height="14px" />
              </div>
              <Skeleton width="100%" height="14px" />
              <Skeleton width="70%" height="14px" />
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  )
}

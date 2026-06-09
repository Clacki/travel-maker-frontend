import { PageLayout } from '@/components/layout/PageLayout'
import { css } from '@/styled-system/css'

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

const skeletonBase = css({
  bg: 'bg.subtle',
  borderRadius: 'md',
  animation: 'pulse',
})

const breadcrumbSkeletonStyle = css({
  h: '4',
  w: '40',
  bg: 'bg.subtle',
  borderRadius: 'md',
  animation: 'pulse',
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

const thumbnailSkeletonStyle = css({
  flex: '0 0 80px',
  h: '80px',
  borderRadius: 'sm',
  bg: 'bg.subtle',
  animation: 'pulse',
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

const lineSkeletonStyle = (w: string, h = '4') =>
  css({
    h,
    w,
    bg: 'bg.subtle',
    borderRadius: 'md',
    animation: 'pulse',
  })

export default function DetailLoading() {
  return (
    <PageLayout>
      <div className={pageStyle}>
        <div className={breadcrumbSkeletonStyle} />

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
                <div key={i} className={thumbnailSkeletonStyle} />
              ))}
            </div>
          </div>

          <div className={rightColumnStyle}>
            <div className={infoCardSkeletonStyle}>
              <div className={lineSkeletonStyle('60%', '7')} />
              <div className={lineSkeletonStyle('30%')} />
              <div
                className={css({
                  display: 'flex',
                  gap: '2',
                  flexWrap: 'wrap',
                  mt: '1',
                })}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={css({
                      h: '6',
                      w: '16',
                      bg: 'bg.subtle',
                      borderRadius: 'full',
                      animation: 'pulse',
                    })}
                  />
                ))}
              </div>
              <div className={lineSkeletonStyle('100%')} />
              <div className={lineSkeletonStyle('80%')} />
              <div
                className={css({
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2',
                  mt: '2',
                })}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={css({
                      h: '12',
                      bg: 'bg.subtle',
                      borderRadius: 'md',
                      animation: 'pulse',
                    })}
                  />
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

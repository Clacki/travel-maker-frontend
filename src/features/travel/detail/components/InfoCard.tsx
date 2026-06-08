import { css } from '@/styled-system/css'

import type { TravelDetail } from '../types/travelDetail.types'
import InfoGrid from './InfoGrid'
import TagList from './TagList'

interface InfoCardProps {
  detail: Pick<
    TravelDetail,
    'title' | 'rating' | 'reviewCount' | 'tags' | 'description' | 'infoItems'
  >
}

const cardStyle = css({
  bg: 'bg.muted',
  borderRadius: 'lg',
  p: '6',
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
})

const headerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
})

const titleStyle = css({
  fontSize: '2xl',
  fontWeight: 'bold',
  color: 'text.primary',
})

const ratingRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1',
})

const ratingTextStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const reviewCountStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
})

const descriptionStyle = css({
  fontSize: 'sm',
  color: 'text.primary',
  lineHeight: 'relaxed',
  borderLeftWidth: '3px',
  borderColor: 'primary.soft',
  pl: '3',
  py: '1',
})

export default function InfoCard({ detail }: InfoCardProps) {
  const { title, rating, reviewCount, tags, description, infoItems } = detail

  return (
    <div className={cardStyle}>
      <div className={headerStyle}>
        <h1 className={titleStyle}>{title}</h1>
        <div className={ratingRowStyle}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={css({ color: 'warning' })}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className={ratingTextStyle}>{rating.toFixed(1)}</span>
          <span className={reviewCountStyle}>
            ({reviewCount.toLocaleString()}개 리뷰)
          </span>
        </div>
      </div>

      <TagList tags={tags} />

      <p className={descriptionStyle}>{description}</p>

      <InfoGrid items={infoItems} />
    </div>
  )
}

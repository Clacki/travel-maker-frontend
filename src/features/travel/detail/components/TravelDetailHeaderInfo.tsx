import TagList from './TagList'

import type { Tag } from '../types/travelDetail.types'

import { css } from '@/styled-system/css'

interface TravelDetailHeaderInfoProps {
  placeName: string
  rating: number
  reviewCount: number
  tags: Tag[]
  highlightedTags?: string[]
}

const titleInfoStyle = css({
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

export function TravelDetailHeaderInfo({
  placeName,
  rating,
  reviewCount,
  tags,
  highlightedTags,
}: TravelDetailHeaderInfoProps) {
  return (
    <div className={titleInfoStyle}>
      <h1 className={titleStyle}>{placeName}</h1>
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
        <span className={ratingTextStyle}>{(rating ?? 0).toFixed(1)}</span>
        <span className={reviewCountStyle}>
          ({reviewCount.toLocaleString()}개 리뷰)
        </span>
      </div>
      <TagList tags={tags} highlightedTags={highlightedTags} />
    </div>
  )
}

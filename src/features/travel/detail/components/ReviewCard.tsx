import { css } from '@/styled-system/css'

import type { Review } from '../types/travelDetail.types'

interface ReviewCardProps {
  review: Review
}

const cardStyle = css({
  bg: 'bg.surface',
  borderRadius: 'lg',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  p: '6',
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
})

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
})

const avatarStyle = css({
  width: '10',
  height: '10',
  borderRadius: 'pill',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: '0',
})

const authorInfoStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
})

const authorNameStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const metaStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  fontSize: 'xs',
  color: 'text.secondary',
})

const contentStyle = css({
  fontSize: 'sm',
  color: 'text.primary',
  lineHeight: 'relaxed',
})

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getInitials(name: string): string {
  return name.slice(0, 1).toUpperCase()
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { author, rating, createdAt, content } = review

  return (
    <article className={cardStyle}>
      <div className={headerStyle}>
        {author.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={author.avatarUrl}
            alt={`${author.name} 프로필`}
            className={css({
              width: '10',
              height: '10',
              borderRadius: 'pill',
              objectFit: 'cover',
            })}
          />
        ) : (
          <div className={avatarStyle} aria-hidden="true">
            {getInitials(author.name)}
          </div>
        )}
        <div className={authorInfoStyle}>
          <span className={authorNameStyle}>{author.name}</span>
          <div className={metaStyle}>
            <span aria-label={`별점 ${rating}점`}>
              {'★'.repeat(rating)}
              {'☆'.repeat(5 - rating)}
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={createdAt}>{formatDate(createdAt)}</time>
          </div>
        </div>
      </div>
      <p className={contentStyle}>{content}</p>
    </article>
  )
}

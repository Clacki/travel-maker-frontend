import Image from 'next/image'
import Link from 'next/link'
import { css, cva } from '@/styled-system/css'
import { ROUTES } from '@/constants/routes'
import { LikeButton } from './LikeButton'
import { EditButton } from './EditButton'

export interface PlaceCardBaseProps {
  placeId: number
  placeName: string
  description?: string
  tags?: string[]
  rating?: number
  imageUrl?: string
}

export interface BookmarkPlaceCardProps extends PlaceCardBaseProps {
  variant: 'bookmark'
  isLiked: boolean
  onLikeToggle: (placeId: number) => void
}

export interface ReviewPlaceCardProps extends PlaceCardBaseProps {
  variant: 'review'
  onEditClick: (placeId: number) => void
  onDeleteClick: (placeId: number) => void
}

export type PlaceCardProps = BookmarkPlaceCardProps | ReviewPlaceCardProps

const cardRecipe = cva({
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    bg: 'bg.surface',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'border.subtle',
    borderRadius: 'lg',
    boxShadow: 'sm',
    transitionProperty: 'box-shadow, border-color',
    transitionDuration: '150ms',
    _hover: {
      boxShadow: 'md',
      borderColor: 'border',
    },
  },
  variants: {
    variant: {
      bookmark: {},
      review: {},
    },
  },
  defaultVariants: {
    variant: 'bookmark',
  },
})

const imageWrapperStyle = css({
  position: 'relative',
  width: 'full',
  aspectRatio: '16/10',
  bg: 'bg.muted',
  overflow: 'hidden',
  borderTopLeftRadius: 'lg',
  borderTopRightRadius: 'lg',
})

const imagePlaceholderStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'full',
  height: 'full',
  bg: 'bg.muted',
  color: 'text.secondary',
})

const ratingBadgeStyle = css({
  position: 'absolute',
  top: '2',
  left: '2',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  px: '2',
  py: '1',
  borderRadius: 'pill',
  bg: 'bg.surface',
  fontSize: 'xs',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const ratingIconStyle = css({
  color: 'primary',
})

const contentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  p: '3',
  textDecoration: 'none',
  color: 'inherit',
})

const titleStyle = css({
  fontSize: 'md',
  fontWeight: 'semibold',
  color: 'text.primary',
  lineHeight: 'tight',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: '1',
})

const tagRowStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1',
})

const tagStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  px: '2',
  py: '1',
  borderRadius: 'pill',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'xs',
  fontWeight: 'medium',
  lineHeight: 'tight',
})

const descriptionStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
  lineHeight: 'normal',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: '2',
})

export function PlaceCard(props: PlaceCardProps) {
  const {
    placeId,
    placeName,
    description,
    tags = [],
    rating,
    imageUrl,
    variant,
  } = props

  return (
    <article className={cardRecipe({ variant })}>
      {/* 이미지 영역 */}
      <div className={imageWrapperStyle}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={placeName}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={css({ objectFit: 'cover' })}
          />
        ) : (
          <div className={imagePlaceholderStyle} aria-hidden="true">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* 별점 오버레이 — 좌상단 */}
        {rating !== undefined && (
          <div className={ratingBadgeStyle}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className={ratingIconStyle}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>{rating.toFixed(1)}</span>
          </div>
        )}

        {/* variant별 액션 버튼 — 우상단 */}
        {variant === 'bookmark' && (
          <LikeButton
            isLiked={props.isLiked}
            onLikeToggle={props.onLikeToggle}
            placeId={placeId}
          />
        )}
      </div>

      {/* review variant 편집 버튼 — article 기준 */}
      {variant === 'review' && (
        <EditButton
          placeId={placeId}
          onEditClick={props.onEditClick}
          onDeleteClick={props.onDeleteClick}
        />
      )}

      {/* 카드 내용 */}
      <Link
        href={ROUTES.DETAIL(String(placeId))}
        className={contentStyle}
        aria-label={`${placeName} 상세 페이지로 이동`}
      >
        {/* 장소명 */}
        <h3 className={titleStyle} style={{ WebkitBoxOrient: 'vertical' }}>
          {placeName}
        </h3>

        {/* 태그 */}
        {tags.length > 0 && (
          <div className={tagRowStyle}>
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className={tagStyle}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 설명 */}
        {description && (
          <p
            className={descriptionStyle}
            style={{ WebkitBoxOrient: 'vertical' }}
          >
            {description}
          </p>
        )}
      </Link>
    </article>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { Star, ImageIcon } from 'lucide-react'
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
  highlightedTags?: string[]
  hrefSuffix?: string
}

export interface BookmarkPlaceCardProps extends PlaceCardBaseProps {
  variant: 'bookmark'
  isLiked: boolean
  canManage?: boolean
  onLikeToggle: (placeId: number) => void
}

export interface ReviewPlaceCardProps extends PlaceCardBaseProps {
  variant: 'review'
  reviewId?: number
  canManage?: boolean
  onEditClick?: (id: number) => void
  onDeleteClick?: (id: number) => void
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

const tagHighlightedStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  px: '2',
  py: '1',
  borderRadius: 'pill',
  color: 'primary',
  fontSize: 'xs',
  fontWeight: 'semibold',
  lineHeight: 'tight',
  backgroundImage:
    'linear-gradient(90deg, #A8DCF0 0%, #A8DCF0 30%, rgba(255,255,255,0.85) 50%, #A8DCF0 70%, #A8DCF0 100%)',
  backgroundSize: '300% 100%',
  animation: 'tagShimmer 2.5s linear infinite',
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
    highlightedTags,
    hrefSuffix,
  } = props

  return (
    <article className={cardRecipe({ variant })}>
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
            <ImageIcon size={32} />
          </div>
        )}

        {rating !== undefined && (
          <div className={ratingBadgeStyle}>
            <Star size={12} fill="currentColor" className={ratingIconStyle} />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}

        {variant === 'bookmark' && props.canManage !== false && (
          <LikeButton
            isLiked={props.isLiked}
            onLikeToggle={props.onLikeToggle}
            placeId={placeId}
          />
        )}
      </div>

      {variant === 'review' &&
        props.canManage !== false &&
        props.onEditClick &&
        props.onDeleteClick && (
          <EditButton
            placeId={placeId}
            actionId={props.reviewId}
            onEditClick={props.onEditClick}
            onDeleteClick={props.onDeleteClick}
          />
        )}

      <Link
        href={ROUTES.DETAIL(String(placeId)) + (hrefSuffix ?? '')}
        className={contentStyle}
        aria-label={`${placeName} 상세 페이지로 이동`}
      >
        <h3 className={titleStyle} style={{ WebkitBoxOrient: 'vertical' }}>
          {placeName}
        </h3>

        {tags.length > 0 && (
          <div className={tagRowStyle}>
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={
                  highlightedTags?.includes(tag)
                    ? tagHighlightedStyle
                    : tagStyle
                }
              >
                {tag}
              </span>
            ))}
          </div>
        )}

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

'use client'

import { useState } from 'react'
import { css } from '@/styled-system/css'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import type { TripPlace } from '../types/tripDetail'

const cardStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: '180px 1fr' },
  gap: '4',
  p: '4',
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  boxShadow: 'sm',
})

const imageWrapStyle = css({
  position: 'relative',
  minH: { base: '180px', md: '140px' },
  maxH: { base: '180px', md: '140px' },
  overflow: 'hidden',
  borderRadius: 'md',
  bg: 'bg.muted',
})

const imageStyle = css({
  objectFit: 'cover',
})

const contentStyle = css({
  minW: 0,
})

const headerStyle = css({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '3',
})

const orderStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  w: '8',
  h: '8',
  borderRadius: 'pill',
  bg: 'primary',
  color: 'text.inverse',
  fontSize: 'sm',
  fontWeight: 'bold',
})

const titleGroupStyle = css({
  display: 'grid',
  gap: '1',
  minW: 0,
  flex: 1,
})

const titleStyle = css({
  color: 'text.primary',
  fontSize: 'lg',
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const categoryStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
  lineHeight: 'relaxed',
})

const moreButtonStyle = css({
  mt: '1',
  color: 'primary',
  fontSize: 'xs',
  fontWeight: 'semibold',
  bg: 'transparent',
  border: 'none',
  p: '0',
  cursor: 'pointer',
  _hover: {
    textDecoration: 'underline',
  },
})

const metaStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3',
  mt: '3',
  color: 'text.secondary',
  fontSize: 'sm',
})

const metaItemStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
})

const mapButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1',
  mt: '4',
  minH: '9',
  px: '4',
  borderWidth: '1px',
  borderColor: 'primary',
  borderRadius: 'pill',
  bg: 'bg.surface',
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  transitionProperty: 'background-color, border-color, color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    bg: 'primary.soft',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

interface TripPlaceCardProps {
  place: TripPlace
}

export function TripPlaceCard({ place }: TripPlaceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <article className={cardStyle}>
      <div className={imageWrapStyle}>
        {place.imageUrl ? (
          <Image
            src={place.imageUrl}
            alt={`${place.name} 이미지`}
            fill
            sizes="(max-width: 768px) 100vw, 180px"
            className={imageStyle}
          />
        ) : null}
      </div>

      <div className={contentStyle}>
        <div className={headerStyle}>
          <span className={orderStyle}>{place.order}</span>
          <div className={titleGroupStyle}>
            <h3 className={titleStyle}>{place.name}</h3>
            {place.description ? (
              <div>
                <p
                  className={`${categoryStyle} ${
                    isExpanded ? '' : css({ lineClamp: '2' })
                  }`}
                >
                  {place.description}
                </p>
                <button
                  type="button"
                  className={moreButtonStyle}
                  onClick={() => setIsExpanded((prev) => !prev)}
                >
                  {isExpanded ? '접기' : '더보기'}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className={metaStyle}>
          <span className={metaItemStyle}>
            <MapPin size={15} aria-hidden="true" />
            {place.address}
          </span>
        </div>

        {place.latitude && place.longitude ? (
          <a
            href={`https://map.kakao.com/link/map/${encodeURIComponent(place.name)},${place.latitude},${place.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className={mapButtonStyle}
          >
            <MapPin size={15} aria-hidden="true" />
            여행지 보기
          </a>
        ) : null}
      </div>
    </article>
  )
}

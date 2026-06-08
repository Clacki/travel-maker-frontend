'use client'

import { useState } from 'react'

import Image from 'next/image'

import { LikeButton } from '@/components/ui/PlaceCard/LikeButton'
import { css } from '@/styled-system/css'

interface GallerySectionProps {
  images: string[]
  placeId: number
  isLiked: boolean
  onLikeToggle: (placeId: number) => void
}

const wrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
  width: '100%',
})

const mainImageWrapperStyle = css({
  position: 'relative',
  width: '100%',
  aspectRatio: '16/10',
  borderRadius: 'lg',
  overflow: 'hidden',
})

const thumbnailRowStyle = css({
  display: 'flex',
  gap: '2',
})

const thumbnailWrapperStyle = css({
  position: 'relative',
  flex: '1',
  aspectRatio: '1',
  borderRadius: 'sm',
  overflow: 'hidden',
  cursor: 'pointer',
  borderWidth: '2px',
  borderColor: 'transparent',
  transitionProperty: 'border-color',
  transitionDuration: '150ms',
})

const thumbnailSelectedStyle = css({
  borderColor: 'primary',
})

const moreButtonStyle = css({
  flex: '1',
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'sm',
  bg: 'bg.muted',
  color: 'text.secondary',
  fontSize: 'xl',
  fontWeight: 'semibold',
  cursor: 'pointer',
  border: 'none',
  _hover: { bg: 'border.subtle' },
  _focusVisible: { outline: 'none', boxShadow: 'focus' },
})

const THUMBNAIL_COUNT = 4

export default function GallerySection({
  images,
  placeId,
  isLiked,
  onLikeToggle,
}: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const mainImage = images[selectedIndex] ?? images[0]
  const thumbnails = images.slice(1, THUMBNAIL_COUNT + 1)

  return (
    <div className={wrapperStyle}>
      <div className={mainImageWrapperStyle}>
        <Image
          src={mainImage}
          alt="여행지 메인 이미지"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <LikeButton
          isLiked={isLiked}
          placeId={placeId}
          onLikeToggle={onLikeToggle}
        />
      </div>

      <div className={thumbnailRowStyle}>
        {thumbnails.map((src, index) => {
          const actualIndex = index + 1
          const isSelected = selectedIndex === actualIndex
          return (
            <button
              key={src}
              type="button"
              aria-label={`${actualIndex + 1}번째 이미지 보기`}
              aria-pressed={isSelected}
              className={`${thumbnailWrapperStyle} ${isSelected ? thumbnailSelectedStyle : ''}`}
              onClick={() => setSelectedIndex(actualIndex)}
            >
              <Image
                src={src}
                alt={`여행지 이미지 ${actualIndex + 1}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </button>
          )
        })}
        {images.length > THUMBNAIL_COUNT + 1 && (
          <button
            type="button"
            aria-label="이미지 전체 보기"
            className={moreButtonStyle}
            onClick={() => {
              // TODO: 이미지 전체보기 모달 연결
            }}
          >
            +
          </button>
        )}
      </div>
    </div>
  )
}

'use client'

import { useRef, useState } from 'react'

import Image from 'next/image'

import { css, cx } from '@/styled-system/css'

interface GallerySectionProps {
  images: string[]
  placeId: number
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
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  cursor: 'grab',
  userSelect: 'none',
})

const thumbnailRowDraggingStyle = css({
  cursor: 'grabbing',
})

const thumbnailWrapperStyle = css({
  position: 'relative',
  flex: '0 0 80px',
  width: '80px',
  height: '80px',
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
  flex: '0 0 80px',
  width: '80px',
  height: '80px',
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
}: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isDraggingStyle, setIsDraggingStyle] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const dragMoved = useRef(false)

  const mainImage = images[selectedIndex] ?? images[0]
  const thumbnails = images.slice(1)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!rowRef.current) return
    e.preventDefault()
    isDragging.current = true
    dragMoved.current = false
    setIsDraggingStyle(true)
    startX.current = e.pageX - rowRef.current.offsetLeft
    scrollLeft.current = rowRef.current.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !rowRef.current) return
    e.preventDefault()
    const x = e.pageX - rowRef.current.offsetLeft
    const delta = x - startX.current
    if (Math.abs(delta) > 4) dragMoved.current = true
    rowRef.current.scrollLeft = scrollLeft.current - delta
  }

  const handleMouseUp = () => {
    isDragging.current = false
    setIsDraggingStyle(false)
  }

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
      </div>

      <div
        ref={rowRef}
        className={cx(
          thumbnailRowStyle,
          isDraggingStyle && thumbnailRowDraggingStyle
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {thumbnails.map((src, index) => {
          const actualIndex = index + 1
          const isSelected = selectedIndex === actualIndex
          return (
            <button
              key={src}
              type="button"
              aria-label={`${actualIndex + 1}번째 이미지 보기`}
              aria-pressed={isSelected}
              className={cx(
                thumbnailWrapperStyle,
                isSelected && thumbnailSelectedStyle
              )}
              draggable={false}
              onClick={() => {
                if (!dragMoved.current) setSelectedIndex(actualIndex)
              }}
            >
              <Image
                src={src}
                alt={`여행지 이미지 ${actualIndex + 1}`}
                fill
                draggable={false}
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

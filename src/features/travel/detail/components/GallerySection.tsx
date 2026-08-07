'use client'

import { useRef, useState } from 'react'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

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

const thumbnailOverlayStyle = css({
  position: 'absolute',
  inset: 0,
  bg: 'primary/40',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none',
})

const checkIconStyle = css({
  w: '20px',
  h: '20px',
  color: 'white',
  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
})

export default function GallerySection({ images }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [isDraggingStyle, setIsDraggingStyle] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const dragMoved = useRef(false)

  const selectedImage = images[selectedIndex] ?? images[0]
  const mainImage = failedImages.has(selectedImage)
    ? '/thumbnail-default.svg'
    : selectedImage
  const thumbnails = images

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
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={css({ position: 'absolute', inset: 0 })}
          >
            <Image
              src={mainImage}
              alt="여행지 메인 이미지"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              style={{ objectFit: 'cover' }}
              priority
              onError={() =>
                setFailedImages((current) =>
                  new Set(current).add(selectedImage)
                )
              }
            />
          </motion.div>
        </AnimatePresence>
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
          const isSelected = selectedIndex === index
          return (
            <button
              key={src}
              type="button"
              aria-label={`${index + 1}번째 이미지 보기`}
              aria-pressed={isSelected}
              className={cx(
                thumbnailWrapperStyle,
                isSelected && thumbnailSelectedStyle
              )}
              draggable={false}
              onClick={() => {
                if (!dragMoved.current) setSelectedIndex(index)
              }}
            >
              <Image
                src={failedImages.has(src) ? '/thumbnail-default.svg' : src}
                alt={`여행지 이미지 ${index + 1}`}
                fill
                sizes="80px"
                draggable={false}
                style={{ objectFit: 'cover' }}
                onError={() =>
                  setFailedImages((current) => new Set(current).add(src))
                }
              />
              {isSelected && (
                <div className={thumbnailOverlayStyle}>
                  <svg
                    className={checkIconStyle}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

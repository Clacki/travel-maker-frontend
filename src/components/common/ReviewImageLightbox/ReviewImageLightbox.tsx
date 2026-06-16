'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { css } from '@/styled-system/css'

interface ReviewImageLightboxProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

const overlayStyle = css({
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  p: { base: '4', md: '8' },
  bg: 'rgba(0, 0, 0, 0.85)',
})

const imageStyle = css({
  maxW: 'full',
  maxH: 'calc(100dvh - 80px)',
  objectFit: 'contain',
  borderRadius: 'md',
  boxShadow: 'xl',
})

const closeButtonStyle = css({
  position: 'absolute',
  top: '4',
  right: '4',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '10',
  height: '10',
  borderRadius: 'pill',
  bg: 'rgba(0, 0, 0, 0.5)',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  transitionProperty: 'background-color',
  transitionDuration: '150ms',
  _hover: {
    bg: 'rgba(0, 0, 0, 0.75)',
  },
  _focusVisible: {
    outline: '2px solid',
    outlineColor: 'primary',
    outlineOffset: '2px',
  },
})

export function ReviewImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
}: ReviewImageLightboxProps) {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className={overlayStyle}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="리뷰 이미지 크게 보기"
    >
      <button
        type="button"
        className={closeButtonStyle}
        onClick={onClose}
        aria-label="닫기"
      >
        <X size={20} strokeWidth={2} aria-hidden="true" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={imageStyle}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

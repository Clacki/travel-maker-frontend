'use client'

import Image from 'next/image'
import { useState } from 'react'

import { css } from '@/styled-system/css'

const thumbnailStyle = css({
  width: '120px',
  height: '120px',
  borderRadius: 'lg',
  objectFit: 'cover',
})

const placeholderStyle = css({
  width: '120px',
  height: '120px',
  borderRadius: 'lg',
  bg: 'bg.muted',
})

interface ResultCardThumbnailProps {
  src: string
  alt: string
}

export function ResultCardThumbnail({ src, alt }: ResultCardThumbnailProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <div className={placeholderStyle} aria-hidden="true" />
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={120}
      height={120}
      className={thumbnailStyle}
      onError={() => setHasError(true)}
    />
  )
}

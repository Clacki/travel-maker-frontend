'use client'

import Image from 'next/image'
import { useState } from 'react'

import { css } from '@/styled-system/css'

const DEFAULT_THUMBNAIL = '/thumbnail-default.svg'

const thumbnailStyle = css({
  width: '120px',
  height: '120px',
  borderRadius: 'lg',
  objectFit: 'cover',
})

interface ResultCardThumbnailProps {
  src: string
  alt: string
}

export function ResultCardThumbnail({ src, alt }: ResultCardThumbnailProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={120}
      height={120}
      className={thumbnailStyle}
      onError={() => setImgSrc(DEFAULT_THUMBNAIL)}
    />
  )
}

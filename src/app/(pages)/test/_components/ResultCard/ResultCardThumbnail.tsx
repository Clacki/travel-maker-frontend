'use client'

import Image from 'next/image'
import { useState } from 'react'

const DEFAULT_THUMBNAIL = '/thumbnail-default.svg'

interface ResultCardThumbnailProps {
  src: string
  alt: string
}

export function ResultCardThumbnail({ src, alt }: ResultCardThumbnailProps) {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_THUMBNAIL)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      style={{ objectFit: 'cover' }}
      onError={() => setImgSrc(DEFAULT_THUMBNAIL)}
    />
  )
}

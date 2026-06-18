'use client'

import Image from 'next/image'
import { useState } from 'react'

import { css } from '@/styled-system/css'

const DEFAULT_IMAGE = '/thumbnail-default.svg'

const imageStyle = css({
  w: 'full',
  h: 'full',
  objectFit: 'cover',
})

interface TravelCardImageProps {
  src: string
  alt: string
}

export function TravelCardImage({ src, alt }: TravelCardImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className={imageStyle}
      onError={() => setImgSrc(DEFAULT_IMAGE)}
    />
  )
}

'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const DEFAULT_THUMBNAIL = '/thumbnail-default.svg'

interface ResultCardThumbnailProps {
  src: string
  alt: string
}

export function ResultCardThumbnail({ src, alt }: ResultCardThumbnailProps) {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_THUMBNAIL)
  const prevSrcRef = useRef(src)

  // src prop이 바뀔 때(sessionStorage 복원 후 S3 URL로 업데이트) 이미지 반영
  useEffect(() => {
    if (src && src !== prevSrcRef.current) {
      prevSrcRef.current = src
      setImgSrc(src)
    }
  }, [src])

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      loading="eager"
      sizes="(max-width: 768px) 100vw, 480px"
      style={{ objectFit: 'cover' }}
      onError={() => setImgSrc(DEFAULT_THUMBNAIL)}
    />
  )
}

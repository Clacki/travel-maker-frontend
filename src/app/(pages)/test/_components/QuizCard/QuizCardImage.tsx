'use client'

import Image from 'next/image'
import { useState } from 'react'

import { css, cx } from '@/styled-system/css'

const DEFAULT_IMAGE = '/thumbnail-default.svg'

interface QuizCardImageProps {
  src: string
  alt: string
  priority?: boolean
  className?: string
}

export function QuizCardImage({
  src,
  alt,
  priority = false,
  className,
}: QuizCardImageProps) {
  const [hasError, setHasError] = useState(false)
  const [prevSrc, setPrevSrc] = useState(src)

  if (prevSrc !== src) {
    setPrevSrc(src)
    setHasError(false)
  }

  return (
    <Image
      src={hasError ? DEFAULT_IMAGE : src}
      alt={alt}
      fill
      sizes="(max-width: 1040px) 50vw, 472px"
      priority={priority}
      className={cx(css({ objectFit: 'cover' }), className)}
      onError={() => setHasError(true)}
    />
  )
}

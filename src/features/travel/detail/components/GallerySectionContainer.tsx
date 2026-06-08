'use client'

import { useState } from 'react'

import GallerySection from './GallerySection'

interface GallerySectionContainerProps {
  images: string[]
  placeId: number
}

export default function GallerySectionContainer({
  images,
  placeId,
}: GallerySectionContainerProps) {
  const [isLiked, setIsLiked] = useState(false)

  const handleLikeToggle = (_placeId: number) => {
    setIsLiked((prev) => !prev)
  }

  return (
    <GallerySection
      images={images}
      placeId={placeId}
      isLiked={isLiked}
      onLikeToggle={handleLikeToggle}
    />
  )
}

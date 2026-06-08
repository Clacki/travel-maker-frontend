import GallerySection from './GallerySection'

interface GallerySectionContainerProps {
  images: string[]
  placeId: number
}

export default function GallerySectionContainer({
  images,
  placeId,
}: GallerySectionContainerProps) {
  return <GallerySection images={images} placeId={placeId} />
}

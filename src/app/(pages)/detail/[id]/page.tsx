import { notFound } from 'next/navigation'
import { isAxiosError } from 'axios'

import { getTravelDetail } from '@/features/travel/detail/api/travelDetailApi'
import { getPlaceReviews } from '@/features/travel/detail/api/reviewApi'
import TravelDetailPage from '@/features/travel/detail/TravelDetailPage'

interface DetailPageProps {
  params: Promise<{ id: string }>
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params

  let detail
  try {
    detail = await getTravelDetail(id)
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) notFound()
      throw new Error(String(error.response?.status ?? 500))
    }
    if (error instanceof Error && error.message === '404') notFound()
    throw error
  }

  const reviews = await getPlaceReviews(detail.id).catch(() => [])

  return <TravelDetailPage detail={detail} reviews={reviews} />
}

import { notFound } from 'next/navigation'
import { isAxiosError } from 'axios'

import { isAuthenticated } from '@/lib/auth'
import { getTravelDetail } from '@/features/travel/detail/api/travelDetailApi'
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
    throw error
  }

  const authenticated = await isAuthenticated()
  return <TravelDetailPage detail={detail} isAuthenticated={authenticated} />
}

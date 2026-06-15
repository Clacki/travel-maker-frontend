import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { isAxiosError } from 'axios'

import { getTravelDetail } from '@/features/travel/detail/api/travelDetailApi'
import TravelDetailPage from '@/features/travel/detail/TravelDetailPage'
import DetailLoading from './loading'

interface DetailPageProps {
  params: Promise<{ id: string }>
}

async function TravelDetailContent({ id }: { id: string }) {
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

  return <TravelDetailPage detail={detail} />
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<DetailLoading />}>
      <TravelDetailContent id={id} />
    </Suspense>
  )
}

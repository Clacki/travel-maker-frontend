import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { isAxiosError } from 'axios'

import { getTravelDetail } from '@/features/travel/detail/api/travelDetailApi'
import TravelDetailPage from '@/features/travel/detail/TravelDetailPage'
import DetailLoading from './loading'

interface DetailPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ highlight?: string }>
}

async function TravelDetailContent({
  id,
  highlightedTags,
}: {
  id: string
  highlightedTags: string[]
}) {
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

  return <TravelDetailPage detail={detail} highlightedTags={highlightedTags} />
}

export default async function DetailPage({
  params,
  searchParams,
}: DetailPageProps) {
  const { id } = await params
  const { highlight } = await searchParams
  const highlightedTags = highlight ? highlight.split(',') : []

  return (
    <Suspense fallback={<DetailLoading />}>
      <TravelDetailContent id={id} highlightedTags={highlightedTags} />
    </Suspense>
  )
}

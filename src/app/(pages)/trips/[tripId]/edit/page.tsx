import { notFound } from 'next/navigation'

import { getTripDetail } from '@/features/trips/api/tripsApi'
import { TripCourseEditPage } from '@/features/trips/edit/TripCourseEditPage'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '여행 코스 수정하기',
}

interface TripEditPageProps {
  params: Promise<{ tripId: string }>
}

export default async function TripEditPage({ params }: TripEditPageProps) {
  const { tripId } = await params
  const trip = await getTripDetail(tripId)

  if (!trip) {
    notFound()
  }

  return <TripCourseEditPage trip={trip} />
}

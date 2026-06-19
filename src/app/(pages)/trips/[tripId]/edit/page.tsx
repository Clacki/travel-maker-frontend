import { notFound } from 'next/navigation'

import { getRouteDetail } from '@/features/trips/api/routesApi'
import { TripCourseEditPage } from '@/features/trips/edit/TripCourseEditPage'
import { TripEditAuthGate } from '@/features/trips/edit/TripEditAuthGate'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '여행 코스 수정하기',
}

interface TripEditPageProps {
  params: Promise<{ tripId: string }>
}

export default async function TripEditPage({ params }: TripEditPageProps) {
  const { tripId } = await params
  const routeId = Number(tripId)

  if (!Number.isInteger(routeId) || routeId <= 0) {
    notFound()
  }

  let route
  try {
    route = await getRouteDetail(routeId)
  } catch {
    notFound()
  }

  return (
    <TripEditAuthGate ownerId={route.user_id} tripId={tripId}>
      <TripCourseEditPage route={route} />
    </TripEditAuthGate>
  )
}

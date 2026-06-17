import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { getRouteDetail } from '@/features/trips/api/routesApi'
import { toTripCourseDetail } from '@/features/trips/detail/data/tripDetailAdapter'
import { TripDetailPage } from '@/features/trips/detail/TripDetailPage'

interface TripDetailRoutePageProps {
  params: Promise<{ tripId: string }>
}

export async function generateMetadata({
  params,
}: TripDetailRoutePageProps): Promise<Metadata> {
  const { tripId } = await params
  const routeId = Number(tripId)

  if (!Number.isInteger(routeId) || routeId <= 0) {
    return { title: '여행 코스 상세' }
  }

  try {
    const route = await getRouteDetail(routeId)
    return { title: route.title }
  } catch {
    return { title: '여행 코스 상세' }
  }
}

export default async function TripDetailRoutePage({
  params,
}: TripDetailRoutePageProps) {
  const { tripId } = await params
  const routeId = Number(tripId)

  if (!Number.isInteger(routeId) || routeId <= 0) {
    notFound()
  }

  let trip
  try {
    const route = await getRouteDetail(routeId)
    trip = toTripCourseDetail(route)
  } catch {
    notFound()
  }

  return <TripDetailPage trip={trip} />
}

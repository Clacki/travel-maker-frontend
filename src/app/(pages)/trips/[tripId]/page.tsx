import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { toTripCourseDetail } from '@/features/trips/detail/data/tripDetailAdapter'
import { TripDetailPage } from '@/features/trips/detail/TripDetailPage'
import { demoRouteDetails } from '../../../../../mocks/data/routeData'

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

  const route = demoRouteDetails[routeId]
  return { title: route?.title ?? '여행 코스 상세' }
}

export default async function TripDetailRoutePage({
  params,
}: TripDetailRoutePageProps) {
  const { tripId } = await params
  const routeId = Number(tripId)

  if (!Number.isInteger(routeId) || routeId <= 0) {
    notFound()
  }

  const route = demoRouteDetails[routeId]
  if (!route) {
    notFound()
  }

  const trip = toTripCourseDetail(route)
  return <TripDetailPage trip={trip} />
}

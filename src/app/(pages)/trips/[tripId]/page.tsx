import { notFound } from 'next/navigation'
import { findTripDetailById } from '@/features/trips/detail/data/tripDetailMock'
import { TripDetailPage } from '@/features/trips/detail/TripDetailPage'

interface TripDetailRoutePageProps {
  params: Promise<{ tripId: string }>
}

export default async function TripDetailRoutePage({
  params,
}: TripDetailRoutePageProps) {
  const { tripId } = await params
  const trip = findTripDetailById(tripId)

  if (!trip) {
    notFound()
  }

  return <TripDetailPage trip={trip} />
}

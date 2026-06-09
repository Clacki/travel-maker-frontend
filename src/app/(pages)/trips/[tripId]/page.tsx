import { TripsPlaceholderPage } from '@/features/trips/components/TripsPlaceholderPage'

interface TripDetailPageProps {
  params: Promise<{ tripId: string }>
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
  const { tripId } = await params

  return <TripsPlaceholderPage mode="detail" tripId={tripId} />
}

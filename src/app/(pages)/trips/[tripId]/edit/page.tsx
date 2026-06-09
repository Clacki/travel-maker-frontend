import { TripsPlaceholderPage } from '@/features/trips/components/TripsPlaceholderPage'

interface TripEditPageProps {
  params: Promise<{ tripId: string }>
}

export default async function TripEditPage({ params }: TripEditPageProps) {
  const { tripId } = await params

  return <TripsPlaceholderPage mode="edit" tripId={tripId} />
}

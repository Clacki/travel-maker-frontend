import { isAuthenticated } from '@/lib/auth'
import { getTravelDetail } from '@/features/travel/detail/api/travelDetailApi'
import TravelDetailPage from '@/features/travel/detail/TravelDetailPage'

interface DetailPageProps {
  params: Promise<{ id: string }>
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params
  const [detail, authenticated] = await Promise.all([
    getTravelDetail(id),
    isAuthenticated(),
  ])

  return <TravelDetailPage detail={detail} isAuthenticated={authenticated} />
}

import { getTravelDetail } from '@/features/travel/detail/api/travelDetailApi'
import TravelDetailPage from '@/features/travel/detail/TravelDetailPage'

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const detail = await getTravelDetail(id)

  return <TravelDetailPage detail={detail} />
}

import type { TravelDetail } from './types/travelDetail.types'

interface TravelDetailPageProps {
  detail: TravelDetail
}

export default function TravelDetailPage({ detail }: TravelDetailPageProps) {
  return (
    <div>
      <p>{detail.title}</p>
    </div>
  )
}

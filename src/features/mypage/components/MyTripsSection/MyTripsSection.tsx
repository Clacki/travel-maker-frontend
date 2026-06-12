import { EmptyState } from '@/components/common/status'

interface MyTripsSectionProps {
  canManage: boolean
  onCreateTrip: () => void
}

export function MyTripsSection({
  canManage,
  onCreateTrip,
}: MyTripsSectionProps) {
  return (
    <EmptyState
      title="아직 만든 여행코스가 없어요"
      description="마음에 드는 장소를 모아 나만의 여행코스를 만들어보세요."
      actionLabel={canManage ? '여행코스 만들기' : undefined}
      onAction={canManage ? onCreateTrip : undefined}
    />
  )
}

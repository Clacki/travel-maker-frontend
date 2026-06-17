import InfoGrid from './InfoGrid'
import { buildTravelDetailInfoItems } from '../lib/buildTravelDetailInfoItems'

import type { PlaceInfo } from '../types/travelDetail.types'

interface TravelDetailInfoItemsProps {
  addressPrimary: string | null
  addressDetail: string | null
  info: PlaceInfo | null
}

export function TravelDetailInfoItems({
  addressPrimary,
  addressDetail,
  info,
}: TravelDetailInfoItemsProps) {
  return (
    <InfoGrid
      items={buildTravelDetailInfoItems({
        addressPrimary,
        addressDetail,
        info,
      })}
    />
  )
}

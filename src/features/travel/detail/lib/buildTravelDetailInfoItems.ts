import type { PlaceInfo } from '../types/travelDetail.types'
import { formatDetailText } from '../utils/formatDetailText'

export type TravelDetailInfoItem = {
  label: string
  value: string
}

interface BuildTravelDetailInfoItemsParams {
  addressPrimary: string | null
  addressDetail: string | null
  info: PlaceInfo | null
}

export function buildTravelDetailInfoItems({
  addressPrimary,
  addressDetail,
  info,
}: BuildTravelDetailInfoItemsParams): TravelDetailInfoItem[] {
  const items = [
    addressPrimary
      ? {
          label: '위치',
          value: formatDetailText(
            addressDetail ? `${addressPrimary} ${addressDetail}` : addressPrimary
          ),
        }
      : null,
    info?.operating_hours
      ? {
          label: '운영',
          value: formatDetailText(info.operating_hours),
        }
      : null,
    info?.closed_days
      ? { label: '휴무일', value: formatDetailText(info.closed_days) }
      : null,
    info?.admission_fee
      ? {
          label: '입장료',
          value: formatDetailText(info.admission_fee),
        }
      : null,
    info?.parking !== null && info?.parking !== undefined
      ? { label: '주차', value: info.parking ? '가능' : '불가' }
      : null,
    info?.spend_time ? { label: '소요시간', value: info.spend_time } : null,
    info?.pet !== null && info?.pet !== undefined
      ? {
          label: '반려동물',
          value: info.pet ? '동반 가능' : '동반 불가',
        }
      : null,
    info?.baby_carriage !== null && info?.baby_carriage !== undefined
      ? { label: '유모차', value: info.baby_carriage ? '가능' : '불가' }
      : null,
    info?.credit_card !== null && info?.credit_card !== undefined
      ? { label: '카드결제', value: info.credit_card ? '가능' : '불가' }
      : null,
    info?.discount_info
      ? { label: '할인정보', value: info.discount_info }
      : null,
    info?.accom_count ? { label: '수용인원', value: info.accom_count } : null,
  ].filter((item): item is TravelDetailInfoItem => item !== null)

  return items
    .slice(0, 4)
    .concat(Array(4).fill({ label: '', value: '' }))
    .slice(0, 4)
}

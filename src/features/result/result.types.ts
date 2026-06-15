import type { LucideIcon } from 'lucide-react'

export type CompassAxis = {
  /** 카테고리명 — 꼭짓점 바깥 상단 표시 (예: '활동성') */
  subject: string
  /** 성향 배지 — 꼭짓점 바깥 하단 teal 필로 표시 (예: '자연형') */
  badge: string
  value: number
}

export type CompassTrait = {
  icon: LucideIcon
  title: string
  description: string
}

export type CompassData = {
  axes: CompassAxis[]
  reading: string
  traits: CompassTrait[]
  /** 그래프 중앙 타입 이미지 경로 */
  centerImageSrc: string
  /** 그래프 중앙 하단 필 라벨 */
  centerLabel: string
}

export type RecommendedDestination = {
  id: string
  imageSrc?: string
  region?: string
  title: string
  description: string
  hashtags: string[]
}

export type TravelType = {
  typeCode: string
  imageSrc: string
  title: string
  subtitle: string
  description: string
  isMyType: boolean
}

export type RelatedTravelType = {
  travel_type_id: number
  type_key: string
  name: string
  description: string
  image_url?: string | null
  type_tags?: string[] | null
}

export type TestResultResponse = {
  typeCode: string
  typeName: string
  /** 영문 타입명 — ResultCard 우측 상단에 표시 (예: 'MOONLIGHT CAT') */
  typeNameEn: string
  typeLabel: string
  description: string
  thumbnailSrc: string
  keywords: string[]
  /** API에서 제공되지 않으므로 optional. 표시 시 조건부 렌더링 필요 */
  matchScore?: number
  typeRank: number
  compassData: CompassData
  recommendedDestinations: RecommendedDestination[]
  allTypes: TravelType[]
  compatible_type?: RelatedTravelType | null
  incompatible_type?: RelatedTravelType | null
}

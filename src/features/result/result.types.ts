export type CompassAxis = {
  /** 카테고리명 — 꼭짓점 바깥 상단 표시 (예: '활동성') */
  subject: string
  /** 성향 배지 — 꼭짓점 바깥 하단 teal 필로 표시 (예: '자연형') */
  badge: string
  value: number
}

export type CompassTrait = {
  icon: string
  title: string
  description: string
}

export type CompassData = {
  axes: CompassAxis[]
  reading: string
  traits: CompassTrait[]
  /** 그래프 중앙 이모지 */
  centerEmoji: string
  /** 그래프 중앙 하단 필 라벨 */
  centerLabel: string
}

export type RecommendedDestination = {
  id: string
  imageSrc?: string
  region: string
  title: string
  description: string
  hashtags: string[]
}

export type TravelType = {
  typeCode: string
  icon: string
  imageSrc?: string
  title: string
  subtitle: string
  description: string
  isMyType: boolean
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
  matchScore: number
  typeRank: number
  compassData: CompassData
  recommendedDestinations: RecommendedDestination[]
  allTypes: TravelType[]
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { css } from '@/styled-system/css'

import { ROUTES } from '@/constants/routes'
import {
  TRAVEL_TYPE_MAP,
  TYPE_KEY_ORDER,
} from '@/features/result/result.constants'
import {
  buildCompassAxes,
  buildDescription,
} from '@/features/result/quizCalculator'
import type { TypeKey } from '@/features/result/quizCalculator'
import type { RelatedTravelType } from '@/features/result/result.types'
import { useQuizStore } from '@/store/quizStore'

import { CompassSection } from './CompassSection'
import { CtaSection } from './CtaSection'
import { DestinationsSection } from './DestinationsSection'
import { HeroSection } from './HeroSection'
import { OtherTypesSection } from './OtherTypesSection'
import {
  TypeCompatibilitySection,
  type TypeCompatibilityCardData,
} from './TypeCompatibilitySection'

const TRAIT_FALLBACK_ICONS = ['🌟', '📍', '💡', '🎯']

interface ResultClientLayerProps {
  sharedTypeKey?: string
}

function isValidTypeKey(key: string): key is TypeKey {
  return key in TRAVEL_TYPE_MAP
}

function normalizeRelatedType(
  type: RelatedTravelType | null
): TypeCompatibilityCardData | null {
  if (!type) {
    return null
  }

  return {
    id: type.travel_type_id,
    typeKey: type.type_key,
    name: type.name,
    description: type.description,
    imageUrl: type.image_url ?? undefined,
    tags: type.type_tags ?? [],
  }
}

export function ResultClientLayer({ sharedTypeKey }: ResultClientLayerProps) {
  const { resultVector, typeKey: storeTypeKey, apiResult } = useQuizStore()
  const router = useRouter()

  // type_key: API 우선 → 로컬 계산 → sharedTypeKey 순으로 폴백
  const effectiveTypeKey =
    (apiResult?.type_key && isValidTypeKey(apiResult.type_key)
      ? apiResult.type_key
      : null) ??
    storeTypeKey ??
    (sharedTypeKey && isValidTypeKey(sharedTypeKey) ? sharedTypeKey : null)

  useEffect(() => {
    if (!resultVector && !effectiveTypeKey) {
      router.replace(ROUTES.TEST)
    }
  }, [resultVector, effectiveTypeKey, router])

  if (!effectiveTypeKey) {
    return null
  }

  const typeData = TRAVEL_TYPE_MAP[effectiveTypeKey]

  // result_vector: API가 JSON 문자열로 반환하므로 파싱 필요
  const parsedApiVector: number[] | null = (() => {
    if (!apiResult?.result_vector) return null
    try {
      const parsed = JSON.parse(apiResult.result_vector)
      return Array.isArray(parsed) ? parsed : null
    } catch {
      return null
    }
  })()

  // result_vector: 파싱된 API 값 우선 → 로컬 계산 → buildDefaultVector 순으로 폴백
  const effectiveVector =
    parsedApiVector ?? resultVector ?? buildDefaultVector(effectiveTypeKey)

  const description =
    apiResult?.description ??
    (resultVector
      ? buildDescription(resultVector)
      : typeData.traits[0].description)
  const compassAxes = buildCompassAxes(effectiveVector)
  const typeIndex = TYPE_KEY_ORDER[effectiveTypeKey]
  const typeLabel = `TYPE · ${String(typeIndex).padStart(2, '0')} / 08`

  // API 응답의 travel_type_id를 우선 사용.
  // fallback인 typeIndex(1~8)는 TYPE_KEY_ORDER 순서와 백엔드 DB ID가 일치한다고 가정.
  const effectiveTravelTypeId = apiResult?.travel_type_id ?? typeIndex

  // 퀴즈를 완료했으나 API 실패로 destinations를 받지 못한 경우
  const isDestinationsFailed = storeTypeKey !== null && apiResult === null

  const thumbnailSrc = apiResult?.image_url || typeData.imageSrc
  const keywords = apiResult?.type_tags ?? typeData.tags

  // name: API 우선 → TRAVEL_TYPE_MAP 폴백
  const typeName = apiResult?.name ?? typeData.name

  const traits = apiResult?.detail_cards
    ? apiResult.detail_cards.map((card, i) => ({
        icon: typeData.traits[i]?.icon ?? TRAIT_FALLBACK_ICONS[i] ?? '🌟',
        title: card.title,
        description: card.description,
      }))
    : typeData.traits

  // API destinations → RecommendedDestination 매핑
  // image_url이 null이면 undefined로 전달 → TravelCard 내부에서 기본 이미지로 폴백
  const recommendedDestinations = (apiResult?.destinations ?? []).map((d) => ({
    id: String(d.place_id),
    imageSrc: d.image_url ?? undefined,
    title: d.place_name,
    description: d.description ?? '',
    hashtags: d.tags,
    matchRate: d.match_rate,
  }))

  const allTypes = (Object.entries(TYPE_KEY_ORDER) as [TypeKey, number][])
    .sort(([, a], [, b]) => a - b)
    .map(([key]) => {
      const travelType = TRAVEL_TYPE_MAP[key]
      return {
        typeCode: travelType.typeCode,
        imageSrc: travelType.imageSrc,
        title: travelType.name,
        subtitle: travelType.nameEn,
        description: travelType.tags.join(' · '),
        isMyType: travelType.typeCode === typeData.typeCode,
      }
    })

  const compatibleCard = normalizeRelatedType(apiResult?.compatible_type ?? null)
  const incompatibleCard = normalizeRelatedType(apiResult?.incompatible_type ?? null)

  const result = {
    typeCode: typeData.typeCode,
    typeName,
    typeNameEn: typeData.nameEn,
    typeLabel,
    description,
    thumbnailSrc,
    keywords,
    matchScore: apiResult?.accuracy,
    typeRank: typeIndex,
    compassData: {
      centerImageSrc: typeData.imageSrc,
      centerLabel: typeName,
      axes: compassAxes,
      reading: buildDescription(effectiveVector),
      traits,
    },
    allTypes,
    recommendedDestinations,
  }

  return (
    <>
      <HeroSection result={result} typeKey={effectiveTypeKey} />
      <CompassSection compassData={result.compassData} />
      {recommendedDestinations.length > 0 ? (
        <DestinationsSection
          destinations={recommendedDestinations}
          typeName={result.typeName}
        />
      ) : isDestinationsFailed ? (
        <div
          className={css({
            w: 'full',
            py: '12',
            display: 'flex',
            justifyContent: 'center',
          })}
        >
          <p
            className={css({
              fontSize: 'sm',
              color: 'text.secondary',
            })}
          >
            추천 여행지를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        </div>
      ) : null}
      <TypeCompatibilitySection
        compatibleType={compatibleCard}
        incompatibleType={incompatibleCard}
      />
      <OtherTypesSection allTypes={result.allTypes} />
      <CtaSection travelTypeId={effectiveTravelTypeId} />
    </>
  )
}

function buildDefaultVector(typeKey: TypeKey): number[] {
  const vector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
  vector[0] = typeKey[0] === 't' ? 0.8 : 0.2
  vector[2] = typeKey[1] === 't' ? 0.8 : 0.2
  vector[3] = typeKey[2] === 't' ? 0.8 : 0.2
  return vector
}

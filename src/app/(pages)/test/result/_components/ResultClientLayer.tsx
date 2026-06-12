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
import { useQuizStore } from '@/store/quizStore'

import { CompassSection } from './CompassSection'
import { CtaSection } from './CtaSection'
import { DestinationsSection } from './DestinationsSection'
import { HeroSection } from './HeroSection'
import { OtherTypesSection } from './OtherTypesSection'

interface ResultClientLayerProps {
  sharedTypeKey?: string
}

/** TypeKey 유효성 검사 */
function isValidTypeKey(key: string): key is TypeKey {
  return key in TRAVEL_TYPE_MAP
}

export function ResultClientLayer({ sharedTypeKey }: ResultClientLayerProps) {
  const {
    resultVector,
    typeKey: storeTypeKey,
    destinations,
    travelTypeId: storeTravelTypeId,
  } = useQuizStore()
  const router = useRouter()

  // sharedTypeKey가 있으면 store 없이도 렌더링 가능
  const effectiveTypeKey =
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

  // sharedTypeKey로 접근한 경우 기본 벡터 생성 (CompassSection용)
  const effectiveVector = resultVector ?? buildDefaultVector(effectiveTypeKey)

  const description = resultVector
    ? buildDescription(resultVector)
    : typeData.traits[0].description
  const compassAxes = buildCompassAxes(effectiveVector)
  const typeIndex = TYPE_KEY_ORDER[effectiveTypeKey]
  const typeLabel = `TYPE · ${String(typeIndex).padStart(2, '0')} / 08`
  // API 응답의 travel_type_id를 우선 사용.
  // fallback인 typeIndex(1~8)는 TYPE_KEY_ORDER 순서와 백엔드 DB ID가 일치한다고 가정.
  const effectiveTravelTypeId = storeTravelTypeId ?? typeIndex

  // 퀴즈를 완료했으나 API 실패로 destinations를 받지 못한 경우
  const isDestinationsFailed = storeTypeKey !== null && destinations === null

  // API destinations → RecommendedDestination 매핑
  // image_url이 null이면 undefined로 전달 → TravelCard 내부에서 기본 이미지로 폴백
  const recommendedDestinations = (destinations ?? []).map((d) => ({
    id: String(d.place_id),
    imageSrc: d.image_url ?? undefined,
    title: d.place_name,
    description: d.description ?? '',
    hashtags: d.tags,
  }))

  // TRAVEL_TYPE_MAP을 TYPE_KEY_ORDER 순서로 정렬해 allTypes 구성
  const allTypes = (Object.entries(TYPE_KEY_ORDER) as [TypeKey, number][])
    .sort(([, a], [, b]) => a - b)
    .map(([key]) => {
      const t = TRAVEL_TYPE_MAP[key]
      return {
        typeCode: t.typeCode,
        imageSrc: t.imageSrc,
        title: t.name,
        subtitle: t.nameEn,
        description: t.tags.join(' · '),
        isMyType: t.typeCode === typeData.typeCode,
      }
    })

  const result = {
    typeCode: typeData.typeCode,
    typeName: typeData.name,
    typeNameEn: typeData.nameEn,
    typeLabel,
    description,
    thumbnailSrc: typeData.imageSrc,
    keywords: typeData.tags,
    typeRank: typeIndex,
    compassData: {
      centerImageSrc: typeData.imageSrc,
      centerLabel: typeData.name,
      axes: compassAxes,
      reading: description,
      traits: typeData.traits,
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
            추천 여행지를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>
      ) : null}
      <OtherTypesSection allTypes={result.allTypes} />
      <CtaSection travelTypeId={effectiveTravelTypeId} />
    </>
  )
}

/**
 * sharedTypeKey에서 기본 벡터를 생성한다.
 * typeKey의 각 문자(t/f)를 해당 축의 대표값(0.8/0.2)으로 변환하고,
 * 나머지 축(계획성, 경험지향, 소비스타일)은 중립값(0.5)으로 설정한다.
 */
function buildDefaultVector(typeKey: TypeKey): number[] {
  const vector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
  // typeKey 순서: 활동성(index 0), 사교성(index 2), 공간지향(index 3)
  vector[0] = typeKey[0] === 't' ? 0.8 : 0.2 // 활동성
  vector[2] = typeKey[1] === 't' ? 0.8 : 0.2 // 사교성
  vector[3] = typeKey[2] === 't' ? 0.8 : 0.2 // 공간지향
  return vector
}

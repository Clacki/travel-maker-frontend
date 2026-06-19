'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'

import { css } from '@/styled-system/css'

import { ROUTES } from '@/constants/routes'
import {
  TRAVEL_TYPE_MAP,
  TYPE_KEY_ORDER,
  COMPASS_AXES_CONFIG,
} from '@/features/result/result.constants'
import {
  buildCompassAxes,
  buildDescription,
} from '@/features/result/quizCalculator'
import type { TypeKey } from '@/features/result/quizCalculator'
import type {
  CompassAxis,
  RelatedTravelType,
} from '@/features/result/result.types'
import type {
  QuizSubmitResponse,
  ResultVectorItem,
} from '@/features/result/quizSubmit.types'
import { getSharedQuizResult } from '@/features/result/quizSubmitApi'
import {
  readSessionResultCache,
  subscribeSessionResultCache,
} from '@/features/result/sessionResultCache'
import { useQuizStore } from '@/store/quizStore'

import { ErrorState } from '@/components/common/status/ErrorState'

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
  sharedVector?: string
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

/**
 * submit API의 result_vector({ label, value }[])를 RadarChart용 CompassAxis[]로 변환.
 * COMPASS_AXES_CONFIG 꼭짓점 순서에 맞게 정렬해 반환한다.
 * label이 하나라도 매핑 안 되면 null 반환 → buildDefaultCompassAxes 폴백.
 */
function buildCompassAxesFromApiVector(
  items: ResultVectorItem[] | null | undefined
): CompassAxis[] | null {
  if (!items?.length) {
    return null
  }

  // badge → config 역방향 맵 (label은 string이므로 Map 키를 string으로 선언)
  const badgeToConfig = new Map<string, (typeof COMPASS_AXES_CONFIG)[number]>(
    COMPASS_AXES_CONFIG.flatMap((cfg) => [
      [cfg.trueBadge, cfg],
      [cfg.falseBadge, cfg],
    ])
  )

  const subjectToAxis = new Map<string, CompassAxis>()
  for (const item of items) {
    const cfg = badgeToConfig.get(item.label)
    if (cfg) {
      subjectToAxis.set(cfg.subject, {
        subject: cfg.subject,
        badge: item.label,
        value: item.value,
      })
    }
  }

  // COMPASS_AXES_CONFIG 순서(꼭짓점 배치 순서)로 정렬
  const axes = COMPASS_AXES_CONFIG.map((cfg) =>
    subjectToAxis.get(cfg.subject)
  ).filter((a): a is CompassAxis => a !== undefined)

  return axes.length === COMPASS_AXES_CONFIG.length ? axes : null
}

function buildRecommendedDestinations(apiResult: QuizSubmitResponse | null) {
  return (apiResult?.destinations ?? []).map((d) => ({
    id: String(d.place_id),
    imageSrc: d.image_url ?? undefined,
    title: d.place_name,
    description: d.description ?? '',
    hashtags: d.tags,
    matchRate: d.match_rate,
  }))
}

function buildResultViewModel(
  apiResult: QuizSubmitResponse | null,
  storeTypeKey: TypeKey | null,
  resultVector: number[] | null,
  effectiveTypeKey: TypeKey
) {
  const typeData = TRAVEL_TYPE_MAP[effectiveTypeKey]

  // submit API result_vector({ label, value }[]) → CompassAxis[] 변환
  // 실패 시 buildDefaultVector 폴백
  const compassAxes =
    buildCompassAxesFromApiVector(apiResult?.result_vector) ??
    buildCompassAxes(buildDefaultVector(effectiveTypeKey))

  const description =
    apiResult?.description ??
    (resultVector
      ? buildDescription(resultVector)
      : typeData.traits[0].description)
  const typeIndex = TYPE_KEY_ORDER[effectiveTypeKey]
  const typeLabel = `TYPE · ${String(typeIndex).padStart(2, '0')} / 08`

  // API 응답의 travel_type_id를 우선 사용.
  // fallback인 typeIndex(1~8)는 TYPE_KEY_ORDER 순서와 백엔드 DB ID가 일치한다고 가정.
  const effectiveTravelTypeId = apiResult?.travel_type_id ?? typeIndex

  // API image_url만 사용. 없으면 undefined → ResultCard에서 /thumbnail-default.svg 처리
  const thumbnailSrc = apiResult?.image_url ?? undefined
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

  // image_url이 null이면 undefined로 전달 → TravelCard 내부에서 기본 이미지로 폴백
  const recommendedDestinations = buildRecommendedDestinations(apiResult)

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

  const compatibleCard = normalizeRelatedType(
    apiResult?.compatible_type ?? null
  )
  const incompatibleCard = normalizeRelatedType(
    apiResult?.incompatible_type ?? null
  )

  return {
    effectiveTravelTypeId,
    recommendedDestinations,
    compatibleCard,
    incompatibleCard,
    result: {
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
        axes: compassAxes,
        reading: description,
        traits,
      },
      allTypes,
      recommendedDestinations,
    },
  }
}

export function ResultClientLayer({
  sharedTypeKey,
  sharedVector,
}: ResultClientLayerProps) {
  const {
    resultVector,
    typeKey: storeTypeKey,
    apiResult: storeApiResult,
    apiError: storeApiError,
  } = useQuizStore()
  const router = useRouter()

  // 공유 링크로 접근한 경우: API로 결과 조회
  const [sharedResult, setSharedResult] = useState<QuizSubmitResponse | null>(
    null
  )
  const [sharedError, setSharedError] = useState(false)

  const isSharedAccess =
    !!sharedTypeKey && !!sharedVector && !storeApiResult && !storeTypeKey

  useEffect(() => {
    if (!isSharedAccess) {
      return
    }

    let cancelled = false
    getSharedQuizResult(sharedTypeKey, sharedVector)
      .then((result) => {
        if (!cancelled) {
          setSharedResult(result)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSharedError(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [isSharedAccess, sharedTypeKey, sharedVector])

  // sessionStorage에서 이 타입의 결과를 복원 (store가 비어있을 때 사용)
  // server snapshot = null → hydration mismatch 방지
  // subscribeSessionResultCache → writeSessionResultCache 호출 시 리렌더 트리거
  const sessionKey = sharedTypeKey ?? storeTypeKey ?? ''
  const cachedApiResult = useSyncExternalStore(
    subscribeSessionResultCache,
    () => readSessionResultCache(sessionKey),
    () => null
  )

  const apiResult = storeApiResult ?? sharedResult ?? cachedApiResult
  const apiError = storeApiError || sharedError

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

  const {
    effectiveTravelTypeId,
    recommendedDestinations,
    compatibleCard,
    incompatibleCard,
    result,
  } = buildResultViewModel(
    apiResult,
    storeTypeKey,
    resultVector,
    effectiveTypeKey
  )

  return (
    <>
      <HeroSection result={result} typeKey={effectiveTypeKey} />
      <CompassSection compassData={result.compassData} />
      {recommendedDestinations.length > 0 ? (
        <DestinationsSection
          destinations={recommendedDestinations}
          typeName={result.typeName}
        />
      ) : apiError ? (
        <div className={css({ w: 'full', py: '12' })}>
          <ErrorState
            title="결과를 불러오지 못했어요"
            description="추천 여행지와 궁합 정보를 가져오는 데 실패했습니다. 잠시 후 다시 시도해 주세요."
          />
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

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
import { mockResultData } from '@/features/result/data/resultDataMock'
import { useQuizStore } from '@/store/quizStore'

import { CompassSection } from './CompassSection'
import { CtaSection } from './CtaSection'
import { DestinationsSection } from './DestinationsSection'
import { HeroSection } from './HeroSection'
import { OtherTypesSection } from './OtherTypesSection'
import { ShareButton } from './ShareButton'

interface ResultClientLayerProps {
  sharedTypeKey?: string
}

/** TypeKey 유효성 검사 */
function isValidTypeKey(key: string): key is TypeKey {
  return key in TRAVEL_TYPE_MAP
}

export function ResultClientLayer({ sharedTypeKey }: ResultClientLayerProps) {
  const { resultVector, typeKey: storeTypeKey } = useQuizStore()
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

  const result = {
    ...mockResultData,
    typeCode: typeData.typeCode,
    typeName: typeData.name,
    typeNameEn: typeData.nameEn,
    typeLabel,
    description,
    keywords: typeData.tags,
    compassData: {
      ...mockResultData.compassData,
      centerEmoji: typeData.emoji,
      centerLabel: typeData.name,
      axes: compassAxes,
      reading: description,
      traits: typeData.traits,
    },
    allTypes: mockResultData.allTypes.map((t) => ({
      ...t,
      isMyType: t.typeCode === typeData.typeCode,
    })),
  }

  return (
    <>
      <HeroSection result={result} />
      <div
        className={css({
          maxW: '6xl',
          mx: 'auto',
          px: '6',
          py: '4',
          display: 'flex',
          justifyContent: 'center',
        })}
      >
        <ShareButton typeKey={effectiveTypeKey} />
      </div>
      <CompassSection compassData={result.compassData} />
      <DestinationsSection
        destinations={result.recommendedDestinations}
        typeName={result.typeName}
      />
      <OtherTypesSection allTypes={result.allTypes} />
      <CtaSection travelTypeId={typeIndex} />
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

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
  const {
    resultVector,
    typeKey: storeTypeKey,
    destinations,
    travelTypeId: storeTravelTypeId,
    compatibleType,
    incompatibleType,
  } = useQuizStore()
  const router = useRouter()

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
  const effectiveVector = resultVector ?? buildDefaultVector(effectiveTypeKey)
  const description = resultVector
    ? buildDescription(resultVector)
    : typeData.traits[0].description
  const compassAxes = buildCompassAxes(effectiveVector)
  const typeIndex = TYPE_KEY_ORDER[effectiveTypeKey]
  const typeLabel = `TYPE · ${String(typeIndex).padStart(2, '0')} / 08`
  const effectiveTravelTypeId = storeTravelTypeId ?? typeIndex
  const isDestinationsFailed = storeTypeKey !== null && destinations === null

  const recommendedDestinations = (destinations ?? []).map((destination) => ({
    id: String(destination.place_id),
    imageSrc: destination.image_url ?? undefined,
    title: destination.place_name,
    description: destination.description ?? '',
    hashtags: destination.tags,
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

  const compatibleCard = normalizeRelatedType(compatibleType)
  const incompatibleCard = normalizeRelatedType(incompatibleType)

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

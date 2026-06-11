'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { ROUTES } from '@/constants/routes'
import {
  TRAVEL_TYPE_MAP,
  TYPE_KEY_ORDER,
} from '@/features/result/result.constants'
import {
  buildCompassAxes,
  buildDescription,
} from '@/features/result/quizCalculator'
import { mockResultData } from '@/features/result/data/resultDataMock'
import { useQuizStore } from '@/store/quizStore'

import { CompassSection } from './CompassSection'
import { CtaSection } from './CtaSection'
import { DestinationsSection } from './DestinationsSection'
import { HeroSection } from './HeroSection'
import { OtherTypesSection } from './OtherTypesSection'

interface ResultClientLayerProps {
  isAuthenticated: boolean
}

export function ResultClientLayer({ isAuthenticated }: ResultClientLayerProps) {
  const { resultVector, typeKey } = useQuizStore()
  const router = useRouter()

  useEffect(() => {
    if (!resultVector || !typeKey) {
      router.replace(ROUTES.TEST)
    }
  }, [resultVector, typeKey, router])

  if (!resultVector || !typeKey) return null

  const typeData = TRAVEL_TYPE_MAP[typeKey]
  const description = buildDescription(resultVector)
  const compassAxes = buildCompassAxes(resultVector)
  const typeIndex = TYPE_KEY_ORDER[typeKey]
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
      <CompassSection compassData={result.compassData} />
      <DestinationsSection
        destinations={result.recommendedDestinations}
        typeName={result.typeName}
      />
      <OtherTypesSection allTypes={result.allTypes} />
      <CtaSection isAuthenticated={isAuthenticated} />
    </>
  )
}

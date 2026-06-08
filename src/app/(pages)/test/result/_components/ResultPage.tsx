import { cookies } from 'next/headers'

import { getTestResult } from '@/features/result/resultApi'

import { HeroSection } from './HeroSection'
import { CompassSection } from './CompassSection'
import { DestinationsSection } from './DestinationsSection'
import { OtherTypesSection } from './OtherTypesSection'
import { CtaSection } from './CtaSection'

export async function ResultPage() {
  const result = await getTestResult()
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.has('refresh_token')

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

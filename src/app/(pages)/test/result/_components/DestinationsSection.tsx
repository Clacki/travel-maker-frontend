import { css } from '@/styled-system/css'

import { TravelCard } from '@/app/(pages)/test/_components/TravelCard/TravelCard'

import type { RecommendedDestination } from '@/features/result/result.types'

import { SectionHeader } from './SectionHeader'

interface DestinationsSectionProps {
  destinations: RecommendedDestination[]
  typeName: string
}

const sectionStyle = css({
  w: 'full',
  py: '16',
})

const innerStyle = css({
  maxW: '6xl',
  mx: 'auto',
  px: '6',
  display: 'flex',
  flexDirection: 'column',
  gap: '10',
})

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '6',
  md: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  lg: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
})

export function DestinationsSection({
  destinations,
  typeName,
}: DestinationsSectionProps) {
  return (
    <section className={sectionStyle}>
      <div className={innerStyle}>
        <SectionHeader
          label="CURATED FOR YOU"
          heading="이 타입에게 어울리는 여행지"
          subheading={`${typeName} 타입을 위해 선별한 여행지예요.`}
          align="center"
        />

        <div className={gridStyle}>
          {destinations.map((dest) => (
            <TravelCard
              key={dest.id}
              imageSrc={dest.imageSrc}
              region={dest.region}
              title={dest.title}
              description={dest.description}
              hashtags={dest.hashtags}
              matchRate={dest.matchRate}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

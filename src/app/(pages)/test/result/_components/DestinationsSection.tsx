import { css } from '@/styled-system/css'

import { TravelCard } from '@/app/(pages)/test/_components/TravelCard/TravelCard'

import type { RecommendedDestination } from '@/features/result/result.types'

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

const headerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: '2',
})

const labelStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'primary',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
})

const headingStyle = css({
  fontSize: '2xl',
  fontWeight: 'bold',
  color: 'text.primary',
})

const subheadingStyle = css({
  fontSize: 'md',
  color: 'text.secondary',
  lineHeight: 'normal',
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
        <div className={headerStyle}>
          <span className={labelStyle}>CURATED FOR YOU</span>
          <h2 className={headingStyle}>이 타입에게 어울리는 여행지</h2>
          <p className={subheadingStyle}>
            {typeName} 타입을 위해 선별한 여행지예요.
          </p>
        </div>

        <div className={gridStyle}>
          {destinations.map((dest) => (
            <TravelCard
              key={dest.id}
              imageSrc={dest.imageSrc}
              region={dest.region}
              title={dest.title}
              description={dest.description}
              hashtags={dest.hashtags}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

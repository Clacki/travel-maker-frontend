import { css } from '@/styled-system/css'

import { TypeCard } from '@/components/common/TypeCard/TypeCard'

import type { TravelType } from '@/features/result/result.types'

interface OtherTypesSectionProps {
  allTypes: TravelType[]
}

const sectionStyle = css({
  w: 'full',
  py: '16',
})

const innerStyle = css({
  maxW: '7xl',
  mx: 'auto',
  px: '6',
  display: 'flex',
  flexDirection: 'column',
  gap: '10',
})

const headerStyle = css({
  display: 'flex',
  flexDirection: 'column',
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
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '6',
  md: {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
})

export function OtherTypesSection({ allTypes }: OtherTypesSectionProps) {
  return (
    <section className={sectionStyle}>
      <div className={innerStyle}>
        <div className={headerStyle}>
          <span className={labelStyle}>8 TRAVEL TYPES</span>
          <h2 className={headingStyle}>다른 여행 성향도 있어요</h2>
          <p className={subheadingStyle}>
            친구는 어떤 타입일까요? 8가지 여행 성격을 둘러보세요.
          </p>
        </div>

        <div className={gridStyle}>
          {allTypes.map((t) => (
            <TypeCard
              key={t.typeCode}
              icon={t.icon}
              title={t.title}
              subtitle={t.subtitle}
              description={t.description}
              isMyType={t.isMyType}
              fullWidth
            />
          ))}
        </div>
      </div>
    </section>
  )
}

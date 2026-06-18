import { css } from '@/styled-system/css'

import type { CompassData } from '@/features/result/result.types'

import { RadarChart } from './RadarChart'
import { SectionHeader } from './SectionHeader'

interface CompassSectionProps {
  compassData: CompassData
}

/* 풀 width 섹션 */
const sectionStyle = css({
  w: 'full',
  py: '16',
})

/* 콘텐츠 최대 너비 제한 + 좌우 패딩 */
const innerStyle = css({
  maxW: '6xl',
  mx: 'auto',
  px: '6',
  display: 'flex',
  flexDirection: 'column',
  gap: '10',
})

const contentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '8',
  md: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10',
  },
})

const chartAreaStyle = css({
  flex: '1',
  minWidth: '0',
  display: 'flex',
  justifyContent: 'center',
})

const rightAreaStyle = css({
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  gap: '6',
})

const traitsGridStyle = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '4',
  sm: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
})

const traitCardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  p: '6',
  bg: 'bg.surface',
  borderRadius: 'lg',
  borderWidth: '1px',
  borderColor: 'border.subtle',
})

const traitIconStyle = css({
  color: 'primary',
  flexShrink: '0',
})

const traitTitleStyle = css({
  fontSize: 'md',
  fontWeight: 'bold',
  color: 'text.primary',
})

const traitDescriptionStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  lineHeight: 'normal',
})

const readingSectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
  p: '6',
  bg: 'bg.muted',
  borderRadius: 'lg',
})

const readingLabelStyle = css({
  fontSize: 'xs',
  fontWeight: 'semibold',
  color: 'primary',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
})

const readingTextStyle = css({
  fontSize: 'md',
  color: 'text.primary',
  lineHeight: 'normal',
})

export function CompassSection({ compassData }: CompassSectionProps) {
  return (
    <section className={sectionStyle}>
      <div className={innerStyle}>
        <SectionHeader
          label="TRAVEL COMPASS"
          heading="나의 여행 성향 나침반"
          subheading="6가지 축으로 분석한 당신의 여행 성향을 확인해보세요."
          align="center"
        />

        {/* Chart + Traits + Reading */}
        <div className={contentStyle}>
          <div className={chartAreaStyle}>
            <RadarChart axes={compassData.axes} />
          </div>

          <div className={rightAreaStyle}>
            {/* Traits 카드 2x2 */}
            <div className={traitsGridStyle}>
              {compassData.traits.map((trait) => {
                const Icon = trait.icon
                return (
                  <article key={trait.title} className={traitCardStyle}>
                    <Icon size={22} className={traitIconStyle} />
                    <h3 className={traitTitleStyle}>{trait.title}</h3>
                    <p className={traitDescriptionStyle}>{trait.description}</p>
                  </article>
                )
              })}
            </div>

            {/* Compass reading */}
            <div className={readingSectionStyle}>
              <span className={readingLabelStyle}>COMPASS READING</span>
              <p className={readingTextStyle}>{compassData.reading}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

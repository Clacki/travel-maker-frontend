import { LayoutContainer } from '@/components/layout/LayoutContainer'
import { css, cx } from '@/styled-system/css'

const featureItems = [
  '취향진단',
  '여행지 탐색',
  '여행코스',
  '여행후기',
] as const

const footerStyle = css({
  bg: 'bg.surface',
  borderTopWidth: '1px',
  borderTopColor: 'border.subtle',
})

const footerInnerStyle = css({
  py: { base: '8', md: '10' },
  display: 'grid',
  gap: { base: '5', md: '6' },
})

const brandBlockStyle = css({
  display: 'grid',
  gap: '3',
  maxW: '640px',
})

const footerLogoStyle = css({
  color: 'primary',
  fontSize: 'xl',
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const footerDescriptionStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
  lineHeight: 'relaxed',
})

const featureBlockStyle = css({
  display: 'grid',
  gap: '2',
})

const featureTitleStyle = css({
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'bold',
})

const featureListStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'medium',
  lineHeight: 'normal',
})

const featureSeparatorStyle = css({
  color: 'text.secondary',
})

const copyrightStyle = css({
  pt: '5',
  borderTopWidth: '1px',
  borderTopColor: 'border.subtle',
  color: 'text.secondary',
  fontSize: 'xs',
  lineHeight: 'normal',
})

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cx(footerStyle, className)}>
      <LayoutContainer className={footerInnerStyle}>
        <div className={brandBlockStyle}>
          <strong className={footerLogoStyle}>TravelMaker</strong>
          <p className={footerDescriptionStyle}>
            여행 취향을 이해하고, 나에게 맞는 국내 여행지를 더 쉽게 발견하도록
            돕는 서비스입니다.
          </p>
        </div>

        <div className={featureBlockStyle}>
          <h2 className={featureTitleStyle}>주요 기능</h2>
          <p className={featureListStyle}>
            {featureItems.map((item, index) => (
              <span key={item}>
                {index > 0 && (
                  <span className={featureSeparatorStyle}> · </span>
                )}
                {item}
              </span>
            ))}
          </p>
        </div>

        <p className={copyrightStyle}>© 2026 TravelMaker. Portfolio Project.</p>
      </LayoutContainer>
    </footer>
  )
}

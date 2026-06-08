import Link from 'next/link'

import { css, cx } from '@/styled-system/css'

import { buttonRecipe } from '@/components/common/button/Button'

interface CtaSectionProps {
  isAuthenticated: boolean
}

/* 섹션 배경은 페이지색 유지 */
const sectionStyle = css({
  w: 'full',
  py: '16',
})

/* max-width 제한 + 좌우 패딩 */
const innerStyle = css({
  maxW: '6xl',
  mx: 'auto',
  px: '6',
})

/* 둥근 직사각형 카드 */
const cardStyle = css({
  bg: 'primary',
  borderRadius: '2xl',
  px: '12',
  py: '12',
  display: 'flex',
  flexDirection: 'column',
  gap: '6',
})

const labelStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.inverse',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  opacity: '0.85',
})

const headingStyle = css({
  fontSize: '2xl',
  fontWeight: 'bold',
  color: 'text.inverse',
  lineHeight: 'tight',
  wordBreak: 'keep-all',
  md: {
    fontSize: '3xl',
  },
})

const descriptionStyle = css({
  fontSize: 'md',
  color: 'text.inverse',
  lineHeight: 'relaxed',
  opacity: '0.85',
  maxW: '2xl',
  wordBreak: 'keep-all',
})

const ctaLinkStyle = buttonRecipe({
  variant: 'neutral',
  size: 'sm',
  shape: 'pill',
})

export function CtaSection({ isAuthenticated }: CtaSectionProps) {
  if (isAuthenticated) return null

  return (
    <section className={sectionStyle}>
      <div className={innerStyle}>
        <div className={cardStyle}>
          <span className={labelStyle}>NEXT STEP</span>
          <h2 className={headingStyle}>
            이 여행 스타일로 다음 여행을 시작해볼까요?
          </h2>
          <p className={descriptionStyle}>
            추천 여행지를 둘러보고, 나에게 맞는 여행 코스를 찾아보세요.
            로그인하면 새로운 도시들에 더 쉽게 떠날 수 있어요.
          </p>
          <Link
            href="/login"
            className={cx(
              ctaLinkStyle,
              css({ alignSelf: 'flex-start', color: 'primary' })
            )}
          >
            로그인하기 →
          </Link>
        </div>
      </div>
    </section>
  )
}

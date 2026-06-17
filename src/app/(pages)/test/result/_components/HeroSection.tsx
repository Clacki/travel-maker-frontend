import Link from 'next/link'

import { css } from '@/styled-system/css'

import { ResultCard } from '@/app/(pages)/test/_components/ResultCard/ResultCard'
import { ROUTES } from '@/constants/routes'

import type { TypeKey } from '@/features/result/quizCalculator'
import type { TestResultResponse } from '@/features/result/result.types'

import { ShareButton } from './ShareButton'

interface HeroSectionProps {
  result: TestResultResponse
  typeKey: TypeKey
}

/* 풀 width 배경 래퍼 */
const sectionStyle = css({
  w: 'full',
  bg: 'bg.canvas',
  py: '16',
  md: {
    py: '20',
  },
})

/* 콘텐츠 최대 너비 제한 + 좌우 패딩 */
const innerStyle = css({
  maxW: '6xl',
  mx: 'auto',
  px: '6',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10',
  md: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: '16',
  },
})

const textAreaStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '5',
  flex: '1',
})

const badgeStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1.5',
  px: '3',
  py: '1',
  borderRadius: 'pill',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'xs',
  fontWeight: 'semibold',
  letterSpacing: '0.05em',
  w: 'fit-content',
})

const badgeDotStyle = css({
  w: '1.5',
  h: '1.5',
  borderRadius: 'pill',
  bg: 'primary',
  flexShrink: '0',
})

const headingStyle = css({
  fontSize: '4xl',
  fontWeight: 'bold',
  color: 'text.primary',
  lineHeight: 'tight',
  wordBreak: 'keep-all',
})

const headingHighlightStyle = css({
  color: 'primary',
})

const descriptionStyle = css({
  fontSize: 'md',
  color: 'text.secondary',
  lineHeight: 'relaxed',
  wordBreak: 'keep-all',
})

const retryLinkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  px: '6',
  borderRadius: 'pill',
  bg: 'bg.surface',
  color: 'text.primary',
  fontWeight: 'medium',
  fontSize: 'sm',
  borderWidth: '1px',
  borderColor: 'primary.soft',
  transitionProperty: 'background-color',
  transitionDuration: '150ms',
  _hover: {
    bg: 'bg.muted',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
  w: 'fit-content',
})

/* 폴라로이드 + ResultCard 묶음 컨테이너 */
const cardStackStyle = css({
  position: 'relative',
  flex: '1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  pt: '14',
  pb: '8',
  w: 'full',
  maxWidth: '480px' /* ResultCard 최대 표시 너비 — 디자인 기준값 */,
  mx: 'auto',
  md: {
    mx: '0',
  },
})

/* 메인 ResultCard 래퍼 */
const cardAreaStyle = css({
  position: 'relative',
  zIndex: '1',
  w: 'full',
})

/* 상단 좌측 폴라로이드 (어두운 야경) — -12도 회전 */
const polaroidTopStyle = css({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  p: '3',
  pb: '6',
  bg: 'bg.surface',
  borderRadius: 'sm',
  boxShadow: 'md',
  w: '140px',
  zIndex: '0',
  top: '0',
  left: '0',
  transform: 'rotate(-12deg)',
})

/* 하단 우측 폴라로이드 (밝은 자연) — +10도 회전 */
const polaroidBottomStyle = css({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  p: '3',
  pb: '6',
  bg: 'bg.surface',
  borderRadius: 'sm',
  boxShadow: 'md',
  w: '140px',
  zIndex: '0',
  bottom: '0',
  right: '-3' /* -12px: 폴라로이드 우측 살짝 넘침 효과 */,
  transform: 'rotate(10deg)',
})

/* 폴라로이드 사진 영역 — 상단 (어두운 톤) */
const photoTopStyle = css({
  w: 'full',
  h: '100px',
  borderRadius: 'xs',
  /* 실제 사진 없으므로 토큰 기반 배경색으로 대체. 추후 실제 여행 사진으로 교체 */
  bg: 'bg.muted',
})

/* 폴라로이드 사진 영역 — 하단 (밝은 톤) */
const photoBottomStyle = css({
  w: 'full',
  h: '100px',
  borderRadius: 'xs',
  /* 실제 사진 없으므로 토큰 기반 배경색으로 대체. 추후 실제 여행 사진으로 교체 */
  bg: 'primary.soft',
})

const polaroidCaptionStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
  textAlign: 'center',
  fontStyle: 'italic',
})

const buttonRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  flexWrap: 'wrap',
  mt: '2',
  alignSelf: 'flex-start',
})

export function HeroSection({ result, typeKey }: HeroSectionProps) {
  return (
    <section className={sectionStyle}>
      <div className={innerStyle}>
        {/* 좌측 텍스트 영역 */}
        <div className={textAreaStyle}>
          {/* YOUR TRAVEL STYLE 배지 */}
          <span className={badgeStyle}>
            <span className={badgeDotStyle} />
            YOUR TRAVEL STYLE
          </span>

          {/* 헤딩 — typeName만 primary 색상 */}
          <h1 className={headingStyle}>
            {'당신은 '}
            <span className={headingHighlightStyle}>{result.typeName}</span>
            {' 타입이에요'}
          </h1>

          <p className={descriptionStyle}>{result.description}</p>

          <div className={buttonRowStyle}>
            <Link href={ROUTES.TEST} className={retryLinkStyle}>
              테스트 다시하기
            </Link>
            <ShareButton typeKey={typeKey} />
          </div>
        </div>

        {/* 우측 카드 스택 영역 */}
        <div className={cardStackStyle}>
          {/* 폴라로이드 — 좌상단, -12도 회전 */}
          <div className={polaroidTopStyle}>
            <div className={photoTopStyle} />
            <span className={polaroidCaptionStyle}>Cafe · slow morning</span>
          </div>

          {/* 폴라로이드 — 우하단, +10도 회전 */}
          <div className={polaroidBottomStyle}>
            <div className={photoBottomStyle} />
            <span className={polaroidCaptionStyle}>Nature · fresh air</span>
          </div>

          {/* 메인 ResultCard */}
          <div className={cardAreaStyle}>
            <ResultCard
              typeLabel={result.typeLabel}
              typeName={result.typeNameEn}
              thumbnailSrc={result.thumbnailSrc}
              title={result.typeName}
              keywords={result.keywords}
              matchScore={result.matchScore}
              typeRank={result.typeRank}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

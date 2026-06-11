import { css } from '@/styled-system/css'

import { KeywordTag } from '@/components/common/tag/KeywordTag'

import { ResultCardThumbnail } from './ResultCardThumbnail'

export interface ResultCardProps {
  typeLabel: string
  typeName: string
  thumbnailSrc?: string
  thumbnailAlt?: string
  title: string
  description: string
  keywords: string[]
  /** 매칭도 (0~100 숫자, "64" → "64%" 로 표시). API에서 제공되지 않으면 미표시 */
  matchScore?: number
  /** 타입 순위 (8종 중 n번째, "1" → "8종 중 1" 로 표시) */
  typeRank: number
}

const cardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  w: 'full',
  bg: 'bg.surface',
  borderRadius: '2xl',
  boxShadow: 'md',
  overflow: 'hidden',
})

const headerStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  px: '6',
  pt: '6',
  pb: '3',
})

const typeLabelStyle = css({
  fontSize: 'xs',
  fontWeight: 'medium',
  color: 'text.secondary',
})

const typeNameStyle = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  color: 'primary',
})

const bannerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  mx: '6',
  py: '8',
  borderRadius: 'xl',
  /* TODO: gradient token이 없으므로 primary.soft 단색 처리. 디자인 확정 후 linear-gradient 적용 */
  bg: 'primary.soft',
})

const titleSectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
  px: '6',
  pt: '6',
  pb: '4',
})

const titleStyle = css({
  fontSize: '2xl',
  fontWeight: 'bold',
  color: 'text.primary',
})

const descriptionStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  lineHeight: 'normal',
})

const dividerStyle = css({
  mx: '6',
  borderTopWidth: '1px',
  borderColor: 'border.subtle',
})

const tagSectionStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
  px: '6',
  py: '4',
})

const statSectionStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: '6',
  pt: '4',
  pb: '6',
})

const statItemStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1',
})

const statValueStyle = css({
  fontSize: 'xl',
  fontWeight: 'bold',
  color: 'text.primary',
})

const statLabelStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
})

const matchRateValueStyle = css({
  fontSize: 'xl',
  fontWeight: 'bold',
  color: 'primary',
})

export function ResultCard({
  typeLabel,
  typeName,
  thumbnailSrc,
  thumbnailAlt = '',
  title,
  description,
  keywords,
  matchScore,
  typeRank,
}: ResultCardProps) {
  const displayedKeywords = keywords.slice(0, 3)

  return (
    <article className={cardStyle}>
      {/* Header */}
      <div className={headerStyle}>
        <span className={typeLabelStyle}>{typeLabel}</span>
        <span className={typeNameStyle}>{typeName}</span>
      </div>

      {/* Banner with thumbnail */}
      <div className={bannerStyle}>
        <ResultCardThumbnail
          src={thumbnailSrc ?? '/thumbnail-default.svg'}
          alt={thumbnailAlt}
        />
      </div>

      {/* Title section */}
      <div className={titleSectionStyle}>
        <h3 className={titleStyle}>{title}</h3>
        <p className={descriptionStyle}>{description}</p>
      </div>

      {/* Divider */}
      <hr className={dividerStyle} />

      {/* Keywords */}
      <div className={tagSectionStyle}>
        {displayedKeywords.map((keyword) => (
          <KeywordTag key={keyword} label={keyword} variant="result" />
        ))}
      </div>

      {/* Divider */}
      <hr className={dividerStyle} />

      {/* Stats */}
      <div className={statSectionStyle}>
        {matchScore !== undefined && (
          <div className={statItemStyle}>
            <span className={statValueStyle}>{`${matchScore}%`}</span>
            <span className={statLabelStyle}>매칭도</span>
          </div>
        )}
        <div className={statItemStyle}>
          <span className={statValueStyle}>12문항</span>
          <span className={statLabelStyle}>테스트</span>
        </div>
        <div className={statItemStyle}>
          <span className={matchRateValueStyle}>{`8종 중 ${typeRank}`}</span>
          <span className={statLabelStyle}>타입</span>
        </div>
      </div>
    </article>
  )
}

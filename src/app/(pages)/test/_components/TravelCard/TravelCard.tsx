import { css } from '@/styled-system/css'

import { KeywordTag } from '@/components/common/tag/KeywordTag'

import { TravelCardImage } from './TravelCardImage'

export interface TravelCardProps {
  imageSrc?: string
  imageAlt?: string
  /** 이미지 위에 표시되는 지역명 배지 (예: "제주특별자치도") */
  region?: string
  title: string
  description: string
  hashtags: string[]
  ctaText?: string
}

const cardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  w: 'full',
  bg: 'bg.surface',
  borderRadius: '3xl',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  boxShadow: 'md',
  overflow: 'hidden',
  pb: '0',
})

const imageWrapperStyle = css({
  position: 'relative',
  mx: '4',
  mt: '4',
  h: '220px',
  borderRadius: '2xl',
  overflow: 'hidden',
  bg: 'primary.soft',
})

const badgeStyle = css({
  position: 'absolute',
  top: '3',
  left: '3',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: '3',
  h: '7',
  borderRadius: 'pill',
  bg: 'bg.surface',
  fontSize: 'xs',
  fontWeight: 'medium',
  color: 'text.primary',
  zIndex: 1,
})

const contentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
  px: '5',
  pt: '4',
  pb: '3',
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
  lineClamp: '2',
})

const tagSectionStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
  pt: '3',
})

const ctaWrapperStyle = css({
  px: '5',
  pb: '5',
  pt: '2',
})

const ctaButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  w: 'full',
  px: '5',
  py: '3',
  bg: 'bg.surface',
  borderRadius: 'xl',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  _hover: {
    bg: 'bg.muted',
  },
})

const ctaTextStyle = css({
  fontSize: 'sm',
  fontWeight: 'medium',
  color: 'text.primary',
})

const ctaIconStyle = css({
  w: '5',
  h: '5',
  color: 'text.primary',
})

export function TravelCard({
  imageSrc,
  imageAlt = '',
  region,
  title,
  description,
  hashtags,
  ctaText = '자세히 보기',
}: TravelCardProps) {
  const displayedHashtags = hashtags.slice(0, 3)

  return (
    <article className={cardStyle}>
      {/* Image area (inset with rounded corners) */}
      <div className={imageWrapperStyle}>
        <TravelCardImage
          src={imageSrc ?? '/thumbnail-default.svg'}
          alt={imageAlt}
        />
        {region && <span className={badgeStyle}>{region}</span>}
      </div>

      {/* Content */}
      <div className={contentStyle}>
        <h3 className={titleStyle}>{title}</h3>
        <p className={descriptionStyle}>{description}</p>

        {displayedHashtags.length > 0 && (
          <div className={tagSectionStyle}>
            {displayedHashtags.map((tag) => (
              <KeywordTag key={tag} label={tag} variant="result" />
            ))}
          </div>
        )}
      </div>

      {/* CTA button */}
      <div className={ctaWrapperStyle}>
        <button type="button" className={ctaButtonStyle}>
          <span className={ctaTextStyle}>{ctaText}</span>
          <svg
            className={ctaIconStyle}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M7.5 4.5L13 10L7.5 15.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  )
}

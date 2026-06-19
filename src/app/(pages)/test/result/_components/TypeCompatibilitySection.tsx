import Image from 'next/image'
import { ImageIcon } from 'lucide-react'

import { css, cx } from '@/styled-system/css'

import { SectionHeader } from './SectionHeader'

export type TypeCompatibilityCardData = {
  id: number
  typeKey: string
  name: string
  description: string
  imageUrl?: string
  tags: string[]
  reason?: string
}

interface TypeCompatibilitySectionProps {
  compatibleType?: TypeCompatibilityCardData | null
  incompatibleType?: TypeCompatibilityCardData | null
}

type CompatibilityTone = 'compatible' | 'incompatible'

const sectionStyle = css({
  w: 'full',
  py: '16',
  bg: 'bg.canvas',
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
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
})

const cardStyle = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  overflow: 'hidden',
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  boxShadow: 'sm',
  sm: {
    gridTemplateColumns: '180px 1fr',
  },
})

const imageFrameStyle = css({
  position: 'relative',
  minH: '180px',
  bg: 'bg.muted',
})

const imageStyle = css({
  objectFit: 'cover',
})

const imageFallbackStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'full',
  height: 'full',
  minH: '180px',
  color: 'text.secondary',
})

const cardContentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
  p: '6',
})

const labelStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  width: 'fit-content',
  px: '3',
  py: '1',
  borderRadius: 'pill',
  fontSize: 'xs',
  fontWeight: 'semibold',
})

const compatibleLabelStyle = css({
  bg: 'primary.soft',
  color: 'primary',
})

const incompatibleLabelStyle = css({
  bg: 'bg.muted',
  color: 'text.secondary',
})

const titleStyle = css({
  fontSize: 'xl',
  fontWeight: 'bold',
  color: 'text.primary',
  lineHeight: 'tight',
  wordBreak: 'keep-all',
})

const descriptionStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  lineHeight: 'normal',
  wordBreak: 'keep-all',
})

const reasonStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  lineHeight: 'normal',
  wordBreak: 'keep-all',

  borderLeftWidth: '2px',
  borderLeftColor: 'border.subtle',
  pl: '3',
})

const tagListStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

const tagStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  px: '2.5',
  py: '1',
  borderRadius: 'pill',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'xs',
  fontWeight: 'medium',
  lineHeight: 'tight',
})

const labelText: Record<CompatibilityTone, string> = {
  compatible: '나와 잘 맞는 타입',
  incompatible: '나와 잘 맞지 않는 타입',
}

function CompatibilityCard({
  type,
  tone,
}: {
  type: TypeCompatibilityCardData
  tone: CompatibilityTone
}) {
  return (
    <article className={cardStyle}>
      <div className={imageFrameStyle}>
        {type.imageUrl ? (
          <Image
            src={type.imageUrl}
            alt={type.name}
            fill
            sizes="(max-width: 768px) 100vw, 180px"
            className={imageStyle}
          />
        ) : (
          <div className={imageFallbackStyle} aria-hidden="true">
            <ImageIcon size={36} />
          </div>
        )}
      </div>

      <div className={cardContentStyle}>
        <span
          className={cx(
            labelStyle,
            tone === 'compatible'
              ? compatibleLabelStyle
              : incompatibleLabelStyle
          )}
        >
          {labelText[tone]}
        </span>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '2',
          })}
        >
          <h3 className={titleStyle}>{type.name}</h3>
          <p className={descriptionStyle}>{type.description}</p>
          {type.reason && <p className={reasonStyle}>{type.reason}</p>}
        </div>
        {type.tags.length > 0 && (
          <div className={tagListStyle}>
            {type.tags.map((tag) => (
              <span key={tag} className={tagStyle}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export function TypeCompatibilitySection({
  compatibleType,
  incompatibleType,
}: TypeCompatibilitySectionProps) {
  if (!compatibleType && !incompatibleType) {
    return null
  }

  return (
    <section className={sectionStyle}>
      <div className={innerStyle}>
        <SectionHeader
          label="TYPE CHEMISTRY"
          heading="나와 어울리는 여행 타입 궁합"
          subheading="함께하면 편안한 타입과 조금 다른 리듬을 가진 타입을 확인해 보세요."
          align="center"
        />

        <div className={gridStyle}>
          {compatibleType && (
            <CompatibilityCard type={compatibleType} tone="compatible" />
          )}
          {incompatibleType && (
            <CompatibilityCard type={incompatibleType} tone="incompatible" />
          )}
        </div>
      </div>
    </section>
  )
}

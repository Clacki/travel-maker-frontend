import { css, cx } from '@/styled-system/css'

import type { QuizChoice } from '@/features/test/quiz.types'

import { QuizCardImage } from './QuizCardImage'

interface QuizCardProps {
  choice: QuizChoice
  side: 'A' | 'B'
  isSelected: boolean
  priority?: boolean
  onClick: () => void
}

const cardBase = css({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  bg: 'bg.surface',
  borderWidth: '3px',
  borderStyle: 'solid',
  borderColor: 'transparent',
  borderRadius: '2xl',
  overflow: 'hidden',
  cursor: 'pointer',
  w: 'full',
  h: 'full',
  boxShadow: 'md',
  transitionProperty: 'border-color, box-shadow',
  transitionDuration: '250ms',
  transitionTimingFunction: 'ease-out',
  userSelect: 'none',
  '& .polaroid-image': { transition: 'transform 500ms ease-out' },
  '&:hover .polaroid-image': { transform: 'scale(1.06)' },
  _hover: {
    borderColor: 'primary',
    boxShadow: 'card.active',
  },
  '&[data-selected=true]': {
    borderColor: 'primary',
    boxShadow: 'card.active',
  },
})

const cardRotateA = css({ transform: 'rotate(-3deg)' })
const cardRotateB = css({ transform: 'rotate(3deg)' })

const imageWrapper = css({
  position: 'relative',
  flex: '1',
  minH: '0',
  overflow: 'hidden',
  borderRadius: 'xl',
  mx: '3',
  mt: '3',
})

const textArea = css({
  px: '4',
  pt: '3',
  pb: '4',
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
  textAlign: 'left',
})

const labelStyle = css({
  fontSize: 'md',
  fontWeight: 'bold',
  color: 'text.primary',
  lineHeight: 'tight',
})

const descStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
})

export function QuizCard({
  choice,
  side,
  isSelected,
  priority = false,
  onClick,
}: QuizCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-selected={isSelected}
      aria-pressed={isSelected}
      aria-label={`${side}: ${choice.label}`}
      className={cx(cardBase, side === 'A' ? cardRotateA : cardRotateB)}
    >
      <div className={imageWrapper}>
        <QuizCardImage
          src={choice.imageSrc}
          alt={choice.imageAlt}
          priority={priority}
          className="polaroid-image"
        />
      </div>
      <div className={textArea}>
        <span className={labelStyle}>{choice.label}</span>
        <span className={descStyle}>{choice.description}</span>
      </div>
    </button>
  )
}

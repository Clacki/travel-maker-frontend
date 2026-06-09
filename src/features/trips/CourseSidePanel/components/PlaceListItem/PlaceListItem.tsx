import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react'

import type { CoursePlace } from '@/features/trips/types/course.types'

import { css } from '@/styled-system/css'

interface PlaceListItemProps {
  index: number
  place: CoursePlace
  isFirst: boolean
  isLast: boolean
  onRemove: (placeId: string) => void
  onMoveUp: (placeId: string) => void
  onMoveDown: (placeId: string) => void
}

const itemStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  p: '3',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
})

const indexBadgeStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  w: '6',
  h: '6',
  borderRadius: 'pill',
  bg: 'primary',
  color: 'text.inverse',
  fontSize: 'xs',
  fontWeight: 'bold',
})

const ghostButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  w: '6',
  h: '6',
  borderRadius: 'xs',
  color: 'text.secondary',
  bg: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: 'xs',
  _hover: {
    color: 'primary',
    bg: 'primary.soft',
  },
  _disabled: {
    color: 'border',
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const infoStyle = css({
  flex: 1,
  minW: 0,
})

const nameStyle = css({
  fontWeight: 'medium',
  truncate: true,
})

const addressStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
  truncate: true,
})

const actionsStyle = css({
  display: 'flex',
  gap: '1',
  flexShrink: 0,
})

export function PlaceListItem({
  index,
  place,
  isFirst,
  isLast,
  onRemove,
  onMoveUp,
  onMoveDown,
}: PlaceListItemProps) {
  return (
    <div className={itemStyle}>
      <span className={indexBadgeStyle}>{index}</span>
      <div className={infoStyle}>
        <p className={nameStyle}>{place.name}</p>
        <p className={addressStyle}>{place.address}</p>
      </div>
      <div className={actionsStyle}>
        <button
          type="button"
          className={ghostButtonStyle}
          aria-label="위로 이동"
          disabled={isFirst}
          onClick={() => onMoveUp(place.id)}
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          className={ghostButtonStyle}
          aria-label="아래로 이동"
          disabled={isLast}
          onClick={() => onMoveDown(place.id)}
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          className={ghostButtonStyle}
          aria-label={`${place.name} 삭제`}
          onClick={() => onRemove(place.id)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default PlaceListItem

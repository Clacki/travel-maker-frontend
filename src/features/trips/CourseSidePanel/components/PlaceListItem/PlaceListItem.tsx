'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'

import type { CoursePlace } from '@/features/trips/types/course.types'

import { css, cx } from '@/styled-system/css'

interface PlaceListItemProps {
  index: number
  place: CoursePlace
  selectedPlaceId: string | null
  onRemove: (placeId: string) => void
  onSelect: (placeId: string) => void
}

const itemStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  p: '3',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  bg: 'bg.surface',
  cursor: 'pointer',
})

const itemSelectedStyle = css({
  borderColor: 'primary',
  bg: 'primary.soft',
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

const dragHandleStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: 'text.secondary',
  cursor: 'grab',
  _hover: {
    color: 'text.primary',
  },
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
  selectedPlaceId,
  onRemove,
  onSelect,
}: PlaceListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: place.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  const isSelected = place.id === selectedPlaceId

  const handleClick = () => {
    if (!isDragging) {
      onSelect(place.id)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cx(itemStyle, isSelected && itemSelectedStyle)}
      onClick={handleClick}
    >
      <button
        type="button"
        className={dragHandleStyle}
        aria-label="드래그하여 순서 변경"
        onClick={(e) => e.stopPropagation()}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>
      <span className={indexBadgeStyle}>{index}</span>
      <div className={infoStyle}>
        <p className={nameStyle}>{place.name}</p>
        <p className={addressStyle}>{place.address}</p>
      </div>
      <div className={actionsStyle}>
        <button
          type="button"
          className={ghostButtonStyle}
          aria-label={`${place.name} 삭제`}
          onClick={(e) => {
            e.stopPropagation()
            onRemove(place.id)
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default PlaceListItem

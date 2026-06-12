'use client'

import { useMemo } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Clock, GripVertical, Trash2 } from 'lucide-react'

import {
  DEFAULT_STAY_MINUTES,
  type CoursePlace,
} from '@/features/trips/types/course.types'

import { css, cx } from '@/styled-system/css'

const STAY_OPTIONS = [30, 60, 90, 120, 150, 180] as const

const formatTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

const formatCategory = (category: string): string => {
  const parts = category.split(' > ')
  return parts[parts.length - 1]
}

interface PlaceListItemProps {
  index: number
  place: CoursePlace
  isSelected: boolean
  arrivalTimeMinutes: number
  onRemove: (placeId: string) => void
  onSelect: (placeId: string | null) => void
  onUpdate: (patch: Partial<Pick<CoursePlace, 'stayMinutes' | 'memo'>>) => void
}

const itemStyle = css({
  display: 'flex',
  flexDirection: 'column',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  bg: 'bg.surface',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
})

const itemSelectedStyle = css({
  borderColor: 'primary',
  bg: 'primary.soft',
})

const itemHeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  p: '3',
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

const categoryTagStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  px: '1.5',
  py: '0.5',
  borderRadius: 'xs',
  bg: 'bg.muted',
  color: 'text.secondary',
  fontSize: 'xs',
  lineHeight: '1',
  whiteSpace: 'nowrap',
})

const metaRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  mt: '1',
  fontSize: 'xs',
  color: 'text.secondary',
})

const metaItemStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5',
})

const editPanelStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
  px: '3',
  pb: '3',
  pt: '1',
  borderTopWidth: '1px',
  borderColor: 'border.subtle',
})

const editLabelStyle = css({
  fontSize: 'xs',
  fontWeight: 'medium',
  color: 'text.primary',
  mb: '1',
})

const selectStyle = css({
  w: 'full',
  px: '2',
  py: '1.5',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  bg: 'bg.surface',
  fontSize: 'sm',
  color: 'text.primary',
  cursor: 'pointer',
  _focusVisible: {
    outline: 'none',
    borderColor: 'primary',
    boxShadow: 'focus',
  },
})

const textareaStyle = css({
  w: 'full',
  px: '2',
  py: '1.5',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  bg: 'bg.surface',
  fontSize: 'sm',
  color: 'text.primary',
  resize: 'vertical',
  minH: '16',
  _focusVisible: {
    outline: 'none',
    borderColor: 'primary',
    boxShadow: 'focus',
  },
  _placeholder: {
    color: 'text.secondary',
  },
})

export function PlaceListItem({
  index,
  place,
  isSelected,
  arrivalTimeMinutes,
  onRemove,
  onSelect,
  onUpdate,
}: PlaceListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: place.id })

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 10 : undefined,
    }),
    [transform, transition, isDragging]
  )

  const handleClick = () => {
    if (!isDragging) {
      onSelect(isSelected ? null : place.id)
    }
  }

  const stayMinutes = place.stayMinutes ?? DEFAULT_STAY_MINUTES

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cx(itemStyle, isSelected && itemSelectedStyle)}
      onClick={handleClick}
    >
      {/* 카드 헤더 */}
      <div className={itemHeaderStyle}>
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
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '1.5',
            })}
          >
            <p className={nameStyle}>{place.name}</p>
            {place.category && (
              <span className={categoryTagStyle}>
                {formatCategory(place.category)}
              </span>
            )}
          </div>
          <p className={addressStyle}>{place.address}</p>
          <div className={metaRowStyle}>
            <span className={metaItemStyle}>
              <Clock size={12} />
              도착 {formatTime(arrivalTimeMinutes)}
            </span>
            <span className={metaItemStyle}>머무는 시간 {stayMinutes}분</span>
          </div>
          {place.memo && (
            <p
              className={css({
                mt: '1.5',
                px: '2',
                py: '1',
                fontSize: 'xs',
                color: 'text.secondary',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                borderWidth: '1px',
                borderColor: 'primary',
                borderRadius: 'xs',
                display: 'inline-block',
              })}
            >
              {place.memo}
            </p>
          )}
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

      {/* 인라인 편집 패널 */}
      {isSelected && !isDragging && (
        <div className={editPanelStyle} onClick={(e) => e.stopPropagation()}>
          <div>
            <label className={editLabelStyle}>머무는 시간</label>
            <select
              className={selectStyle}
              value={stayMinutes}
              onChange={(e) =>
                onUpdate({ stayMinutes: Number(e.target.value) })
              }
            >
              {STAY_OPTIONS.map((min) => (
                <option key={min} value={min}>
                  {min}분
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={editLabelStyle}>메모</label>
            <textarea
              className={textareaStyle}
              placeholder="메모를 입력하세요"
              value={place.memo ?? ''}
              onChange={(e) => onUpdate({ memo: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PlaceListItem

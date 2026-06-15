'use client'

import { Check, Clock, Plus, ScanEye } from 'lucide-react'

import { css, cx } from '@/styled-system/css'
import type { Place } from '@/features/explore/types/places.types'

interface PlaceSearchResultCardProps {
  place: Place
  isAdded: boolean
  onAdd?: () => void
  onViewOnMap?: () => void
}

const cardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  p: '3',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  bg: 'bg.surface',
})

const nameRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  flexWrap: 'wrap',
})

const nameStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const tagBadgeStyle = css({
  display: 'inline-flex',
  px: '2',
  py: '0.5',
  fontSize: 'xs',
  fontWeight: 'medium',
  color: 'primary',
  bg: 'primary.soft',
  borderRadius: 'pill',
  lineHeight: '1.4',
})

const descriptionStyle = css({
  fontSize: 'xs',
  color: 'text.primary',
  lineHeight: 'relaxed',
  overflow: 'hidden',
  lineClamp: 2,
})

const viewMapButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  px: '2.5',
  py: '1.5',
  fontSize: 'xs',
  fontWeight: 'medium',
  borderRadius: 'sm',
  border: 'none',
  bg: 'bg.muted',
  color: 'text.primary',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  _hover: { bg: 'border.subtle' },
})

const stayStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1',
  fontSize: 'xs',
  color: 'text.secondary',
})

const actionsStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: '2',
  mt: '1',
})

const addButtonBaseStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  px: '2.5',
  py: '1.5',
  fontSize: 'xs',
  fontWeight: 'semibold',
  borderRadius: 'sm',
  border: 'none',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background-color 150ms',
})

const addButtonActiveStyle = css({
  bg: 'primary',
  color: 'text.inverse',
  _hover: {
    bg: 'primary.hover',
  },
})

const addButtonDisabledStyle = css({
  bg: 'bg.muted',
  color: 'text.secondary',
  cursor: 'not-allowed',
})

const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) {
    return `${h}시간 ${m}분`
  }
  if (h > 0) {
    return `${h}시간`
  }
  return `${m}분`
}

export function PlaceSearchResultCard({
  place,
  isAdded,
  onAdd,
  onViewOnMap,
}: PlaceSearchResultCardProps) {
  return (
    <article className={cardStyle}>
      {/* 장소명 + 태그 */}
      <div className={nameRowStyle}>
        <span className={nameStyle}>{place.place_name}</span>
        {place.tags.map((tag) => (
          <span key={tag.id} className={tagBadgeStyle}>
            {tag.tag_name}
          </span>
        ))}
      </div>

      {/* 설명 */}
      {place.description && (
        <p className={descriptionStyle}>{place.description}</p>
      )}

      {/* 추천 체류 시간 */}
      <div className={stayStyle}>
        <Clock size={12} />
        {place.recommended_duration
          ? `추천 체류 ${formatDuration(place.recommended_duration)} · 추가 후 변경 가능`
          : '추가 후 변경 가능'}
      </div>

      {/* 액션 버튼 */}
      <div className={actionsStyle}>
        {onViewOnMap && (
          <button
            type="button"
            className={viewMapButtonStyle}
            onClick={onViewOnMap}
          >
            <ScanEye size={12} />
            지도에서 보기
          </button>
        )}
        <button
          type="button"
          disabled={isAdded || onAdd === undefined}
          onClick={onAdd}
          className={cx(
            addButtonBaseStyle,
            isAdded || onAdd === undefined
              ? addButtonDisabledStyle
              : addButtonActiveStyle
          )}
          title={
            onAdd === undefined
              ? '위치 정보가 없어 추가할 수 없는 장소예요'
              : undefined
          }
        >
          {isAdded ? (
            <>
              <Check size={12} />
              추가됨
            </>
          ) : (
            <>
              <Plus size={12} />
              추가
            </>
          )}
        </button>
      </div>
    </article>
  )
}

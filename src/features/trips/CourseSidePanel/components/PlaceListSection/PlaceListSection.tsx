import type { CoursePlace } from '@/features/trips/types/course.types'
import { MAX_PLACES } from '@/features/trips/types/course.types'

import { css } from '@/styled-system/css'

import { PlaceListItem } from '../PlaceListItem'

interface PlaceListSectionProps {
  places: CoursePlace[]
  onRemove: (placeId: string) => void
  onMoveUp: (placeId: string) => void
  onMoveDown: (placeId: string) => void
}

const sectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
})

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const titleStyle = css({
  fontSize: 'md',
  fontWeight: 'semibold',
})

const badgeStyle = css({
  bg: 'primary.soft',
  color: 'primary',
  borderRadius: 'pill',
  fontSize: 'xs',
  px: '2',
  py: '0.5',
  fontWeight: 'medium',
})

const guideStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
})

const listStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
})

export function PlaceListSection({
  places,
  onRemove,
  onMoveUp,
  onMoveDown,
}: PlaceListSectionProps) {
  return (
    <div className={sectionStyle}>
      <div className={headerStyle}>
        <h3 className={titleStyle}>선택한 장소</h3>
        <span className={badgeStyle}>
          {places.length}/{MAX_PLACES}
        </span>
      </div>
      <p className={guideStyle}>
        최소 2개, 최대 7개의 장소를 선택할 수 있어요.
      </p>
      <div className={listStyle}>
        {places.map((place, idx) => (
          <PlaceListItem
            key={place.id}
            index={idx + 1}
            place={place}
            isFirst={idx === 0}
            isLast={idx === places.length - 1}
            onRemove={onRemove}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
          />
        ))}
      </div>
    </div>
  )
}

export default PlaceListSection

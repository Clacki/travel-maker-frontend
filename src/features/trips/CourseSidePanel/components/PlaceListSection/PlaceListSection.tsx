'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'

import type { CoursePlace } from '@/features/trips/types/course.types'

import { css } from '@/styled-system/css'

import { PlaceListItem } from '../PlaceListItem'

interface PlaceListSectionProps {
  places: CoursePlace[]
  onRemove: (placeId: string) => void
  onReorder: (newPlaces: CoursePlace[]) => void
}

const sectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
})

const listStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
})

export function PlaceListSection({
  places,
  onRemove,
  onReorder,
}: PlaceListSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = places.findIndex((p) => p.id === active.id)
    const newIndex = places.findIndex((p) => p.id === over.id)
    const reordered = arrayMove(places, oldIndex, newIndex)
    onReorder(reordered)
  }

  return (
    <div className={sectionStyle}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={places.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={listStyle}>
            {places.map((place, idx) => (
              <PlaceListItem
                key={place.id}
                index={idx + 1}
                place={place}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default PlaceListSection

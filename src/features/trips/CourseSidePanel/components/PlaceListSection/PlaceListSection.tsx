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
import { useCourseStore } from '@/store/tripsStore'

import { css } from '@/styled-system/css'

import { PlaceListItem } from '../PlaceListItem'

interface PlaceListSectionProps {
  places: CoursePlace[]
  onRemove: (placeId: string) => void
  onReorder: (newPlaces: CoursePlace[]) => void
}

const DEFAULT_STAY_MINUTES = 60

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
  const selectedPlaceId = useCourseStore((state) => state.selectedPlaceId)
  const setSelectedPlaceId = useCourseStore((state) => state.setSelectedPlaceId)
  const departureTime = useCourseStore((state) => state.departureTime)
  const updatePlaceDetail = useCourseStore((state) => state.updatePlaceDetail)

  // 각 장소별 도착 예상시간(분) 계산
  const arrivalTimes = places.reduce<number[]>((acc, place, idx) => {
    if (idx === 0) {
      const startMinutes = departureTime.hour * 60 + departureTime.minute
      acc.push(startMinutes)
    } else {
      const prevArrival = acc[idx - 1]
      const prevStay = places[idx - 1].stayMinutes ?? DEFAULT_STAY_MINUTES
      acc.push(prevArrival + prevStay)
    }
    return acc
  }, [])

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
                isSelected={place.id === selectedPlaceId}
                arrivalTimeMinutes={arrivalTimes[idx] ?? 0}
                onRemove={onRemove}
                onSelect={setSelectedPlaceId}
                onUpdate={(patch) => updatePlaceDetail(place.id, patch)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default PlaceListSection

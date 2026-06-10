'use client'

import { useCourseStore } from '@/store/tripsStore'
import type { CoursePlace } from '@/features/trips/types/course.types'

import { css } from '@/styled-system/css'

import { CourseInfoSection } from './components/CourseInfoSection'
import { PlaceListSection } from './components/PlaceListSection'

const cardStyle = css({
  bg: 'bg.surface',
  borderRadius: '2xl',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  p: '4',
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
})

const cardTitleStyle = css({
  fontSize: 'md',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const cardDescStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
  mt: '0.5',
})

const cardHeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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

export function CourseInfoCard() {
  const {
    title,
    description,
    selectedRegion,
    selectedThemes,
    setTitle,
    setDescription,
    setRegion,
    toggleTheme,
  } = useCourseStore()

  return (
    <div className={cardStyle}>
      <div>
        <h2 className={cardTitleStyle}>코스 기본 정보</h2>
        <p className={cardDescStyle}>여행의 분위기와 테마를 알려주세요</p>
      </div>
      <CourseInfoSection
        title={title}
        description={description}
        selectedRegion={selectedRegion}
        selectedThemes={selectedThemes}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onRegionChange={setRegion}
        onThemeToggle={toggleTheme}
      />
    </div>
  )
}

export function CoursePlaceCard() {
  const { places, selectedDay, removePlace, reorderPlaces } = useCourseStore()

  const dayPlaces = places.filter((p) => p.dayIndex === selectedDay)
  const otherPlaces = places.filter((p) => p.dayIndex !== selectedDay)

  const handleReorder = (reorderedDayPlaces: CoursePlace[]) => {
    reorderPlaces([...otherPlaces, ...reorderedDayPlaces])
  }

  return (
    <div className={cardStyle}>
      <div className={cardHeaderStyle}>
        <div>
          <h2 className={cardTitleStyle}>선택한 코스</h2>
          <p className={cardDescStyle}>드래그로 방문 순서를 정할 수 있습니다</p>
        </div>
        <span className={badgeStyle}>장소 {dayPlaces.length}곳</span>
      </div>
      <PlaceListSection
        places={dayPlaces}
        onRemove={removePlace}
        onReorder={handleReorder}
      />
    </div>
  )
}

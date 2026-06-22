'use client'

import dynamic from 'next/dynamic'

import { useCourseStore } from '@/store/tripsStore'
import type { CoursePlace } from '@/features/trips/types/course.types'
import {
  cardStyle,
  cardTitleStyle,
  cardDescStyle,
  cardHeaderStyle,
  cardBadgeStyle,
} from '@/features/trips/styles/courseEditor.styles'

import { css, cx } from '@/styled-system/css'

import { CourseInfoSection } from './components/CourseInfoSection'

const loadingStyle = css({ h: '20' })

const PlaceListSection = dynamic(
  () => import('./components/PlaceListSection').then((m) => m.PlaceListSection),
  { ssr: false, loading: () => <div className={loadingStyle} /> }
)

const placeCardDescStyle = css({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  WebkitLineClamp: { base: 2, lg: 1 },
  wordBreak: 'keep-all',
})

export function CourseInfoCard() {
  const title = useCourseStore((s) => s.title)
  const description = useCourseStore((s) => s.description)
  const selectedRegion = useCourseStore((s) => s.selectedRegion)
  const selectedThemes = useCourseStore((s) => s.selectedThemes)
  const setTitle = useCourseStore((s) => s.setTitle)
  const setDescription = useCourseStore((s) => s.setDescription)
  const setRegion = useCourseStore((s) => s.setRegion)
  const toggleTheme = useCourseStore((s) => s.toggleTheme)

  return (
    <div className={cardStyle}>
      <div className={cardHeaderStyle}>
        <div>
          <h2 className={cardTitleStyle}>코스 기본 정보</h2>
          <p className={cardDescStyle}>여행의 분위기와 테마를 설정해주세요</p>
        </div>
        <span className={cardBadgeStyle}>필수 항목</span>
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
  const places = useCourseStore((s) => s.places)
  const selectedDay = useCourseStore((s) => s.selectedDay)
  const removePlace = useCourseStore((s) => s.removePlace)
  const reorderPlaces = useCourseStore((s) => s.reorderPlaces)

  const dayPlaces = places.filter((p) => p.dayIndex === selectedDay)
  const otherPlaces = places.filter((p) => p.dayIndex !== selectedDay)

  const handleReorder = (reorderedDayPlaces: CoursePlace[]) => {
    reorderPlaces([...otherPlaces, ...reorderedDayPlaces])
  }

  return (
    <div className={cardStyle}>
      <div className={cardHeaderStyle}>
        <div>
          <h2 className={cardTitleStyle}>선택한 코스 · {selectedDay}일차</h2>
          <p className={cx(cardDescStyle, placeCardDescStyle)}>
            장소를 드래그하여 순서를 변경하거나 삭제할 수 있어요
          </p>
        </div>
        <span className={cardBadgeStyle}>필수 항목</span>
      </div>
      <PlaceListSection
        places={dayPlaces}
        onRemove={removePlace}
        onReorder={handleReorder}
      />
    </div>
  )
}

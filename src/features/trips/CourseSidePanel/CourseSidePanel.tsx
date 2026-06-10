'use client'

import { useCourseStore } from '@/store/tripsStore'
import { Button } from '@/components/common/button/Button'
import { MIN_PLACES } from '@/features/trips/types/course.types'

import { css } from '@/styled-system/css'

import { CourseInfoSection } from './components/CourseInfoSection'
import { PlaceListSection } from './components/PlaceListSection'

const panelStyle = css({
  bg: 'bg.surface',
  borderRadius: 'lg',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  boxShadow: 'md',
  p: '6',
  display: 'flex',
  flexDirection: 'column',
  gap: '6',
})

export function CourseSidePanel() {
  const {
    title,
    description,
    selectedRegion,
    selectedThemes,
    places,
    setTitle,
    setDescription,
    setRegion,
    toggleTheme,
    removePlace,
    movePlaceUp,
    movePlaceDown,
  } = useCourseStore()

  const isSaveEnabled =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    selectedRegion !== null &&
    selectedThemes.length > 0 &&
    places.length >= MIN_PLACES

  const handleSave = () => {
    // TODO: 코스 저장 API 연동
  }

  return (
    <div className={panelStyle}>
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
      <PlaceListSection
        places={places}
        onRemove={removePlace}
        onMoveUp={movePlaceUp}
        onMoveDown={movePlaceDown}
      />
      <Button
        variant="primary"
        fullWidth
        size="lg"
        shape="pill"
        disabled={!isSaveEnabled}
        onClick={handleSave}
      >
        코스 저장하기
      </Button>
    </div>
  )
}

export default CourseSidePanel

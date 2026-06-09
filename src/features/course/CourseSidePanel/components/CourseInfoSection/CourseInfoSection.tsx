import { REGION_OPTIONS, THEME_OPTIONS } from '@/features/course/course.types'

import { css } from '@/styled-system/css'

import { TagToggleGroup } from '../TagToggleGroup'

interface CourseInfoSectionProps {
  title: string
  description: string
  selectedRegion: string | null
  selectedThemes: string[]
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onRegionChange: (region: string | null) => void
  onThemeToggle: (theme: string) => void
}

const sectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
})

const sectionTitleStyle = css({
  fontSize: 'md',
  fontWeight: 'semibold',
})

const fieldStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
})

const labelStyle = css({
  fontSize: 'sm',
  fontWeight: 'medium',
  color: 'text.primary',
})

const inputStyle = css({
  borderWidth: '1px',
  borderColor: 'border',
  borderRadius: 'sm',
  p: '3',
  w: 'full',
  fontSize: 'sm',
  _focus: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const textareaStyle = css({
  borderWidth: '1px',
  borderColor: 'border',
  borderRadius: 'sm',
  p: '3',
  w: 'full',
  fontSize: 'sm',
  resize: 'vertical',
  minH: '80px',
  _focus: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

export function CourseInfoSection({
  title,
  description,
  selectedRegion,
  selectedThemes,
  onTitleChange,
  onDescriptionChange,
  onRegionChange,
  onThemeToggle,
}: CourseInfoSectionProps) {
  const handleRegionToggle = (value: string) => {
    if (selectedRegion === value) {
      onRegionChange(null)
    } else {
      onRegionChange(value)
    }
  }

  return (
    <div className={sectionStyle}>
      <h3 className={sectionTitleStyle}>코스 정보</h3>
      <div className={fieldStyle}>
        <label htmlFor="course-title" className={labelStyle}>
          코스 제목
        </label>
        <input
          id="course-title"
          type="text"
          className={inputStyle}
          placeholder="예: 강릉 감성 카페 코스"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>
      <div className={fieldStyle}>
        <label htmlFor="course-description" className={labelStyle}>
          코스 설명
        </label>
        <textarea
          id="course-description"
          className={textareaStyle}
          placeholder="코스에 대한 간단한 설명을 입력해주세요."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
      <TagToggleGroup
        label="지역"
        options={REGION_OPTIONS}
        selectedValues={selectedRegion ? [selectedRegion] : []}
        onToggle={handleRegionToggle}
      />
      <TagToggleGroup
        label="테마"
        options={THEME_OPTIONS}
        selectedValues={selectedThemes}
        onToggle={onThemeToggle}
      />
    </div>
  )
}

export default CourseInfoSection

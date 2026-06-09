import { FilterTag } from '@/components/common/tag/FilterTag'

import { css } from '@/styled-system/css'

interface TagToggleGroupProps {
  label: string
  options: readonly string[]
  selectedValues: string[]
  onToggle: (value: string) => void
}

const groupStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
})

const labelStyle = css({
  fontSize: 'sm',
  fontWeight: 'medium',
  color: 'text.primary',
})

const tagsStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

export function TagToggleGroup({
  label,
  options,
  selectedValues,
  onToggle,
}: TagToggleGroupProps) {
  return (
    <div className={groupStyle}>
      <span className={labelStyle}>{label}</span>
      <div className={tagsStyle}>
        {options.map((option) => (
          <FilterTag
            key={option}
            label={option}
            isSelected={selectedValues.includes(option)}
            onClick={() => onToggle(option)}
          />
        ))}
      </div>
    </div>
  )
}

export default TagToggleGroup

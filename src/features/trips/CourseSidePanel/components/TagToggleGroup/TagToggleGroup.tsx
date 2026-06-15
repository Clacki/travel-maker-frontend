'use client'

import { useState } from 'react'

import { FilterTag } from '@/components/common/tag/FilterTag'

import { css } from '@/styled-system/css'

interface TagToggleGroupProps {
  label: string
  options: readonly string[]
  selectedValues: string[]
  onToggle: (value: string) => void
  collapseAt?: number
}

const groupStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
})

const labelStyle = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'text.primary',
})

const tagsStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

const moreButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  px: '2.5',
  py: '1',
  fontSize: 'xs',
  fontWeight: 'medium',
  color: 'text.secondary',
  bg: 'bg.muted',
  borderRadius: 'pill',
  border: 'none',
  cursor: 'pointer',
  _hover: {
    color: 'text.primary',
    bg: 'border.subtle',
  },
})

export function TagToggleGroup({
  label,
  options,
  selectedValues,
  onToggle,
  collapseAt,
}: TagToggleGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const needsCollapse = collapseAt !== undefined && options.length > collapseAt
  const visibleOptions =
    needsCollapse && !isExpanded ? options.slice(0, collapseAt) : options

  // 접혀 있어도 선택된 항목은 항상 노출
  const hiddenSelected =
    needsCollapse && !isExpanded
      ? options.slice(collapseAt).filter((o) => selectedValues.includes(o))
      : []

  const displayOptions = [...visibleOptions, ...hiddenSelected]
  const hiddenCount = needsCollapse
    ? options.length - collapseAt! - hiddenSelected.length
    : 0

  return (
    <div className={groupStyle}>
      <span className={labelStyle}>{label}</span>
      <div className={tagsStyle}>
        {displayOptions.map((option) => (
          <FilterTag
            key={option}
            label={option}
            isSelected={selectedValues.includes(option)}
            onClick={() => onToggle(option)}
          />
        ))}
        {needsCollapse && !isExpanded && hiddenCount > 0 && (
          <button
            type="button"
            className={moreButtonStyle}
            onClick={() => setIsExpanded(true)}
          >
            +{hiddenCount} 더보기
          </button>
        )}
        {needsCollapse && isExpanded && (
          <button
            type="button"
            className={moreButtonStyle}
            onClick={() => setIsExpanded(false)}
          >
            접기
          </button>
        )}
      </div>
    </div>
  )
}

export default TagToggleGroup

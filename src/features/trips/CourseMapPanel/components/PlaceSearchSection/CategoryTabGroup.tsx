'use client'

import { css, cx } from '@/styled-system/css'

interface CategoryTabGroupProps {
  active: string
  onChange: (category: string) => void
}

const CATEGORIES = ['전체', '관광지', '카페', '자연', '맛집', '액티비티']

const scrollContainerStyle = css({
  display: 'flex',
  gap: '2',
  overflowX: 'auto',
  pb: '1',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
})

const tabBaseStyle = css({
  flexShrink: 0,
  px: '3',
  py: '1.5',
  fontSize: 'xs',
  fontWeight: 'medium',
  borderRadius: 'pill',
  cursor: 'pointer',
  border: 'none',
  whiteSpace: 'nowrap',
  transitionProperty: 'background-color, color',
  transitionDuration: '150ms',
})

const tabActiveStyle = css({
  bg: 'primary',
  color: 'text.inverse',
})

const tabInactiveStyle = css({
  bg: 'bg.muted',
  color: 'text.secondary',
  _hover: {
    color: 'text.primary',
  },
})

export function CategoryTabGroup({ active, onChange }: CategoryTabGroupProps) {
  return (
    <div className={scrollContainerStyle}>
      {CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={cx(
            tabBaseStyle,
            active === category ? tabActiveStyle : tabInactiveStyle
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

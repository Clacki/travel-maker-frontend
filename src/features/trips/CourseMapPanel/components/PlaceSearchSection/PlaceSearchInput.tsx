'use client'

import { Search, X } from 'lucide-react'

import { css } from '@/styled-system/css'

interface PlaceSearchInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

const inputWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  px: '3',
  py: '2',
  bg: 'bg.muted',
  borderRadius: 'sm',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  _focusWithin: {
    borderColor: 'primary',
    boxShadow: 'focus',
  },
})

const inputStyle = css({
  flex: 1,
  bg: 'transparent',
  border: 'none',
  outline: 'none',
  fontSize: 'sm',
  color: 'text.primary',
  _placeholder: {
    color: 'text.secondary',
  },
})

const clearButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  w: '4',
  h: '4',
  border: 'none',
  bg: 'transparent',
  color: 'text.secondary',
  cursor: 'pointer',
  borderRadius: 'pill',
  _hover: {
    color: 'text.primary',
    bg: 'border.subtle',
  },
})

export function PlaceSearchInput({
  value,
  onChange,
  placeholder = '장소를 검색해보세요',
}: PlaceSearchInputProps) {
  return (
    <div className={inputWrapperStyle}>
      <Search size={16} color="var(--colors-text-secondary)" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputStyle}
      />
      {value && (
        <button
          type="button"
          className={clearButtonStyle}
          onClick={() => onChange('')}
          aria-label="검색어 지우기"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}

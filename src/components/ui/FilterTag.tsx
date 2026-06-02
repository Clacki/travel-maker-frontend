'use client'

import type { ReactNode } from 'react'

import { css } from '@/styled-system/css'

export interface FilterTagProps {
  label: string
  isSelected?: boolean
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
}

export function FilterTag({
  label,
  isSelected = false,
  icon,
  onClick,
  disabled = false,
}: FilterTagProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      disabled={disabled}
      onClick={onClick}
      className={css({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2',
        minH: '8',
        px: '4',
        borderRadius: 'pill',
        fontSize: 'sm',
        fontWeight: 'medium',
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
        bg: 'primary.soft',
        color: 'primary',
        transitionProperty: 'background-color, color',
        transitionDuration: '150ms',
        _pressed: {
          bg: 'primary',
          color: 'text.inverse',
        },
        _hover: {
          bg: 'bg.muted',
          _pressed: {
            bg: 'primary.hover',
          },
        },
        _focusVisible: {
          outline: 'none',
          boxShadow: 'focus',
        },
        _disabled: {
          opacity: 0.4,
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
      })}
    >
      {icon}
      {label}
    </button>
  )
}

export default FilterTag

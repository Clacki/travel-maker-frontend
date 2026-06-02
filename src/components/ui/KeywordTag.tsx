'use client'

import type { ReactNode } from 'react'

import { css } from '@/styled-system/css'

export interface KeywordTagProps {
  label: string
  isSelected?: boolean
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
}

export function KeywordTag({
  label,
  isSelected = false,
  icon,
  onClick,
  disabled = false,
}: KeywordTagProps) {
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
        gap: '1.5',
        height: '28px',
        px: '3',
        borderRadius: 'pill',
        fontSize: 'xs',
        fontWeight: 'medium',
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
        bg: 'primary.soft',
        color: 'primary',
        transition: 'background-color 0.15s ease, color 0.15s ease',
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
      {`#${label}`}
    </button>
  )
}

export default KeywordTag

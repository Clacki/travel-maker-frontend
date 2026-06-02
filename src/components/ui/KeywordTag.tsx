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
        bg: isSelected ? 'primary' : 'primary.soft',
        color: isSelected ? 'text.inverse' : 'primary',
        transition: 'background-color 0.15s ease, color 0.15s ease',
        _hover: {
          bg: isSelected ? 'primary.hover' : 'bg.muted',
        },
        _focusVisible: {
          outline: 'none',
          boxShadow: 'focus',
        },
        _disabled: {
          opacity: 0.4,
          cursor: 'not-allowed',
          _hover: {
            bg: isSelected ? 'primary' : 'primary.soft',
          },
        },
      })}
    >
      {icon != null && (
        <span
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          {icon}
        </span>
      )}
      {`#${label}`}
    </button>
  )
}

export default KeywordTag

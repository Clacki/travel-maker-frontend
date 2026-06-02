'use client'

import type { ReactNode } from 'react'

import { css } from '@/styled-system/css'

export interface MypageTagProps {
  label: string
  isSelected?: boolean
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
}

export function MypageTag({
  label,
  isSelected = false,
  icon,
  onClick,
  disabled = false,
}: MypageTagProps) {
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
        height: '30px',
        px: '3.5',
        borderRadius: 'xl',
        fontSize: 'sm',
        fontWeight: 'medium',
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border',
        bg: 'bg.surface',
        color: 'text.primary',
        transition:
          'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
        _pressed: {
          bg: 'primary',
          color: 'text.inverse',
          borderColor: 'transparent',
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

export default MypageTag

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
        borderWidth: isSelected ? '0' : '1px',
        borderStyle: 'solid',
        borderColor: isSelected ? 'transparent' : 'border',
        bg: isSelected ? 'primary' : 'bg.surface',
        color: isSelected ? 'text.inverse' : 'text.primary',
        transition:
          'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease',
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
            bg: isSelected ? 'primary' : 'bg.surface',
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
      {label}
    </button>
  )
}

export default MypageTag

'use client'

import type { ReactNode } from 'react'
import { cva } from '@/styled-system/css'

export type FilterTagVariant = 'default' | 'filter'

export interface FilterTagProps {
  label: string
  isSelected?: boolean
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: FilterTagVariant
}

const filterTagStyle = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    px: '4',
    borderRadius: 'pill',
    fontSize: 'sm',
    lineHeight: 'normal',
    whiteSpace: 'nowrap',
    transitionProperty: 'background-color, border-color, color, box-shadow',
    transitionDuration: '150ms',
    _focusVisible: {
      outline: 'none',
      boxShadow: 'focus',
    },
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  variants: {
    variant: {
      default: {
        minH: '8',
        fontWeight: 'medium',
        bg: 'primary.soft',
        color: 'primary',
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
      },
      filter: {
        minH: '9',
        borderWidth: '1px',
        borderColor: 'transparent',
        bg: 'bg.muted',
        color: 'text.secondary',
        fontWeight: 'semibold',
        _hover: {
          borderColor: 'primary',
          color: 'primary',
        },
        _pressed: {
          bg: 'primary',
          borderColor: 'primary',
          color: 'text.inverse',
          _hover: {
            bg: 'primary.hover',
            borderColor: 'primary.hover',
            color: 'text.inverse',
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export function FilterTag({
  label,
  isSelected = false,
  icon,
  onClick,
  disabled = false,
  variant = 'default',
}: FilterTagProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      disabled={disabled}
      onClick={onClick}
      className={filterTagStyle({ variant })}
    >
      {icon}
      {label}
    </button>
  )
}

export default FilterTag

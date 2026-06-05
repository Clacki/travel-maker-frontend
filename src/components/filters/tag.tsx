'use client'

import { css } from '@/styled-system/css'

export type TagVariant = 'default' | 'region' | 'toggle'

interface TagProps {
  label: string
  emoji?: string
  isActive?: boolean
  variant?: TagVariant
  onClick?: () => void
}

const baseStyle = css.raw({
  borderRadius: 'pill',
  fontWeight: 'medium',
  cursor: 'pointer',
  transitionProperty: 'background-color, color, border-color',
  transitionDuration: '150ms',
  borderWidth: '1px',
  borderColor: 'transparent',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  alignItems: 'center',
  border: 'none',
  _focusVisible: { outline: 'none', boxShadow: 'focus' },
})

export function Tag({
  label,
  emoji,
  isActive = false,
  variant = 'default',
  onClick,
}: TagProps) {
  if (variant === 'toggle') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={css(baseStyle, {
          px: '4',
          py: '2',
          fontSize: 'xs',
          gap: '1',
          bg: isActive ? 'primary' : 'bg.muted',
          color: isActive ? 'text.inverse' : 'text.secondary',
          _hover: {
            bg: isActive ? 'primary' : 'primary.soft',
            color: isActive ? 'text.inverse' : 'primary',
          },
        })}
      >
        <span
          className={css({
            w: '2',
            h: '2',
            borderRadius: 'pill',
            bg: isActive ? 'text.inverse' : 'text.secondary',
            transitionProperty: 'background-color',
            transitionDuration: '150ms',
            flexShrink: 0,
          })}
        />
        {label}
      </button>
    )
  }

  if (variant === 'region') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={css(baseStyle, {
          px: '3',
          py: '1',
          fontSize: 'xs',
          bg: isActive ? 'primary' : 'bg.muted',
          color: isActive ? 'text.inverse' : 'text.secondary',
          _hover: {
            bg: isActive ? 'primary' : 'primary.soft',
            color: isActive ? 'text.inverse' : 'primary',
          },
        })}
      >
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={css(baseStyle, {
        px: '4',
        py: '2',
        fontSize: 'xs',
        bg: isActive ? 'primary' : 'bg.muted',
        color: isActive ? 'text.inverse' : 'text.secondary',
        _hover: {
          bg: isActive ? 'primary' : 'primary.soft',
          color: isActive ? 'text.inverse' : 'primary',
        },
      })}
    >
      {emoji && (
        <span className={css({ mr: '1', fontSize: 'md' })}>{emoji}</span>
      )}
      {label}
    </button>
  )
}

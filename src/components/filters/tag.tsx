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
  borderRadius: '50px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.18s ease',
  border: '1.5px solid transparent',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  alignItems: 'center',
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
      <span
        onClick={onClick}
        className={css(baseStyle, {
          padding: '6px 14px',
          fontSize: '12px',
          gap: '5px',
          bg: isActive ? 'primary' : 'secondary',
          color: isActive ? 'primary.foreground' : 'muted.foreground',
          borderColor: isActive ? 'primary' : 'transparent',
          _hover: {
            bg: isActive ? 'primary' : 'primary/10',
            color: isActive ? 'primary.foreground' : 'primary',
            borderColor: isActive ? 'primary' : 'primary/30',
          },
        })}
      >
        <span
          className={css({
            w: '6px',
            h: '6px',
            borderRadius: '50%',
            bg: isActive ? 'primary.foreground' : 'muted.foreground',
            transition: 'background 0.18s',
            flexShrink: 0,
          })}
        />
        {label}
      </span>
    )
  }

  if (variant === 'region') {
    return (
      <span
        onClick={onClick}
        className={css(baseStyle, {
          padding: '5px 12px',
          fontSize: '11.5px',
          bg: isActive ? 'primary' : 'secondary',
          color: isActive ? 'primary.foreground' : 'muted.foreground',
          borderColor: isActive ? 'primary' : 'transparent',
          _hover: {
            bg: isActive ? 'primary' : 'primary/10',
            color: isActive ? 'primary.foreground' : 'primary',
            borderColor: isActive ? 'primary' : 'primary/30',
          },
        })}
      >
        {label}
      </span>
    )
  }

  // default variant
  return (
    <span
      onClick={onClick}
      className={css(baseStyle, {
        padding: '6px 14px',
        fontSize: '12px',
        bg: isActive ? 'primary' : 'secondary',
        color: isActive ? 'primary.foreground' : 'muted.foreground',
        borderColor: isActive ? 'primary' : 'transparent',
        _hover: {
          bg: isActive ? 'primary' : 'primary/10',
          color: isActive ? 'primary.foreground' : 'primary',
          borderColor: isActive ? 'primary' : 'primary/30',
        },
      })}
    >
      {emoji && (
        <span className={css({ mr: '4px', fontSize: '1rem' })}>{emoji}</span>
      )}
      {label}
    </span>
  )
}

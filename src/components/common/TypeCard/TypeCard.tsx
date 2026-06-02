'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { css, cva, cx } from '@/styled-system/css'

const cardStyle = cva({
  base: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '4',
    borderWidth: '1px',
    borderStyle: 'solid',
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color, color, box-shadow',
    transitionDuration: '150ms',
    fontFamily: 'body',
    textAlign: 'left',
    userSelect: 'none',
    _focusVisible: {
      outline: 'none',
      boxShadow: 'focus',
    },
    _disabled: {
      pointerEvents: 'none',
    },
  },
  variants: {
    state: {
      default: {
        width: '305px',
        height: '170px',
        padding: '6',
        borderRadius: '2xl',
        bg: 'bg.surface',
        borderColor: 'border.subtle',
        boxShadow: 'md',
      },
      active: {
        width: '335px',
        height: '190px',
        padding: '6',
        borderRadius: '2xl',
        bg: 'primary.soft',
        borderColor: 'primary',
        boxShadow: 'card.active',
      },
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

const iconWrapperStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'pill',
    flexShrink: 0,
  },
  variants: {
    state: {
      default: {
        width: '40px',
        height: '40px',
        bg: 'primary.soft',
      },
      active: {
        width: '56px',
        height: '56px',
        bg: 'teal.25',
      },
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

const badgeStyle = css({
  position: 'absolute',
  top: '3',
  right: '4',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: '3',
  py: '1',
  borderRadius: 'pill',
  bg: 'primary',
  color: 'text.inverse',
  fontSize: 'xs',
  fontWeight: 'semibold',
  lineHeight: 'tight',
})

export interface TypeCardProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  icon: ReactNode
  title: string
  subtitle: string
  description: string
  isSelected?: boolean
  isMyType?: boolean
}

export function TypeCard({
  icon,
  title,
  subtitle,
  description,
  isSelected = false,
  isMyType = false,
  className,
  type = 'button',
  ...props
}: TypeCardProps) {
  const state = isSelected ? 'active' : 'default'

  return (
    <button
      type={type}
      className={cx(cardStyle({ state }), className)}
      aria-pressed={isSelected}
      {...props}
    >
      {isMyType && isSelected && <span className={badgeStyle}>MY TYPE</span>}

      <div className={iconWrapperStyle({ state })}>{icon}</div>

      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '1',
          minWidth: 0,
        })}
      >
        <span
          className={css({
            fontSize: 'lg',
            fontWeight: 'bold',
            color: 'text.primary',
          })}
        >
          {title}
        </span>
        <span
          className={css({
            fontSize: 'sm',
            fontWeight: 'medium',
            color: 'text.secondary',
          })}
        >
          {subtitle}
        </span>
        <p
          className={css({
            fontSize: 'xs',
            color: 'text.secondary',
            lineHeight: 'normal',
            mt: '1',
          })}
        >
          {description}
        </p>
      </div>
    </button>
  )
}

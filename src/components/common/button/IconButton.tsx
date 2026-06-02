import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva } from '@/styled-system/css'
import { cx } from '@/styled-system/css'

const iconButtonRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: 'sm',
    bg: 'bg.surface',
    borderColor: 'border.subtle',
    color: 'text.primary',
    userSelect: 'none',
    transitionProperty: 'background-color, border-color, color, box-shadow',
    transitionDuration: '150ms',
    _hover: {
      bg: 'primary.soft',
      borderColor: 'primary',
      color: 'primary',
    },
    _focusVisible: {
      outline: 'none',
      boxShadow: 'focus',
    },
    _disabled: {
      pointerEvents: 'none',
      bg: 'bg.muted',
      borderColor: 'bg.muted',
      color: 'text.secondary',
    },
    '& svg': {
      width: '1em',
      height: '1em',
    },
  },
  variants: {
    size: {
      sm: {
        width: '8',
        height: '8',
        fontSize: 'sm',
      },
      md: {
        width: '10',
        height: '10',
        fontSize: 'md',
      },
      lg: {
        width: '12',
        height: '12',
        fontSize: 'lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'children'
> {
  'aria-label': string
  children: ReactNode
  size?: IconButtonSize
}

export function IconButton({
  children,
  className,
  type = 'button',
  size,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cx(iconButtonRecipe({ size }), className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cva, cx } from '@/styled-system/css'

const buttonRecipe = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    borderWidth: '1px',
    borderStyle: 'solid',
    fontWeight: 'semibold',
    lineHeight: 'tight',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    transitionProperty: 'background-color, border-color, color, box-shadow',
    transitionDuration: '150ms',
    _focusVisible: {
      outline: 'none',
      boxShadow: 'focus',
    },
    _disabled: {
      pointerEvents: 'none',
    },
  },
  variants: {
    variant: {
      primary: {
        bg: 'primary',
        borderColor: 'primary',
        color: 'text.inverse',
        _hover: {
          bg: 'primary.hover',
          borderColor: 'primary.hover',
        },
        _disabled: {
          bg: 'bg.muted',
          borderColor: 'bg.muted',
          color: 'text.secondary',
        },
      },
      secondary: {
        bg: 'primary.soft',
        borderColor: 'primary.soft',
        color: 'primary',
        _hover: {
          borderColor: 'primary',
        },
        _disabled: {
          bg: 'bg.muted',
          borderColor: 'bg.muted',
          color: 'text.secondary',
        },
      },
      outline: {
        bg: 'bg.surface',
        borderColor: 'primary',
        color: 'primary',
        _hover: {
          bg: 'primary.soft',
        },
        _disabled: {
          bg: 'bg.surface',
          borderColor: 'border.subtle',
          color: 'text.secondary',
        },
      },
      ghost: {
        bg: 'transparent',
        borderColor: 'transparent',
        color: 'primary',
        _hover: {
          bg: 'primary.soft',
        },
        _disabled: {
          bg: 'transparent',
          color: 'text.secondary',
        },
      },
      neutral: {
        bg: 'bg.muted',
        borderColor: 'bg.muted',
        color: 'text.primary',
        _hover: {
          borderColor: 'border.subtle',
        },
        _disabled: {
          bg: 'bg.muted',
          borderColor: 'bg.muted',
          color: 'text.secondary',
        },
      },
    },
    size: {
      sm: {
        minH: '8',
        px: '3',
        fontSize: 'sm',
      },
      md: {
        minH: '10',
        px: '5',
        fontSize: 'md',
      },
      lg: {
        minH: '12',
        px: '6',
        fontSize: 'lg',
      },
    },
    shape: {
      rounded: {
        borderRadius: 'sm',
      },
      pill: {
        borderRadius: 'pill',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
      },
      false: {},
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    shape: 'rounded',
    fullWidth: false,
  },
})

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'neutral'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonShape = 'rounded' | 'pill'

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: ButtonShape
  fullWidth?: boolean
}

export function Button({
  children,
  className,
  type = 'button',
  variant,
  size,
  shape,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cx(
        buttonRecipe({ variant, size, shape, fullWidth }),
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

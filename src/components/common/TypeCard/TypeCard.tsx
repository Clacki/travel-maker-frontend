// 'use client' 유지: <button> 기반 컴포넌트로 onClick 등 이벤트 핸들러를 수신할 수 있음
'use client'

import Image from 'next/image'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { css, cva, cx } from '@/styled-system/css'

const cardStyle = cva({
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2',
    width: '305px',
    height: '170px',
    padding: '5',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '2xl',
    boxShadow: 'md',
    cursor: 'default',
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
    myType: {
      true: {
        bg: 'primary.soft',
        borderColor: 'primary',
      },
      false: {
        bg: 'bg.surface',
        borderColor: 'border.subtle',
      },
    },
    fullWidth: {
      true: {
        width: 'full',
      },
    },
  },
  defaultVariants: {
    myType: false,
    fullWidth: false,
  },
})

const iconWrapperStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'pill',
    flexShrink: 0,
    width: '40px',
    height: '40px',
  },
  variants: {
    myType: {
      true: { bg: 'bg.surface' },
      false: { bg: 'primary.soft' },
    },
    noBg: {
      true: { bg: 'transparent' },
    },
  },
  defaultVariants: { myType: false, noBg: false },
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
  imageSrc?: string
  title: string
  subtitle: string
  description: string
  isMyType?: boolean
  fullWidth?: boolean
}

export function TypeCard({
  icon,
  imageSrc,
  title,
  subtitle,
  description,
  isMyType = false,
  fullWidth = false,
  className,
  type = 'button',
  ...props
}: TypeCardProps) {
  return (
    <button
      type={type}
      className={cx(cardStyle({ myType: isMyType, fullWidth }), className)}
      {...props}
    >
      {isMyType && <span className={badgeStyle}>MY TYPE</span>}

      <div className={iconWrapperStyle({ myType: isMyType })}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={title}
            width={36}
            height={36}
            unoptimized
            className={css({ objectFit: 'contain' })}
          />
        ) : (
          icon
        )}
      </div>

      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5',
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
            mt: '0',
          })}
        >
          {description}
        </p>
      </div>
    </button>
  )
}

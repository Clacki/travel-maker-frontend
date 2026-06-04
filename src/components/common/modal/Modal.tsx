'use client'

import type { MouseEvent, ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import { cva, css, cx } from '@/styled-system/css'

export type ModalSize = 'sm' | 'md' | 'lg'

export type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
  closeOnOverlayClick?: boolean
  className?: string
}

const overlayStyle = css({
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: { base: '4', md: '6' },
  py: { base: '6', md: '8' },
  // TODO: Replace with a semantic overlay token when the design system defines one.
  bg: 'rgba(38, 50, 56, 0.48)',
})

const dialogStyle = cva({
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: 'full',
    maxH: 'calc(100dvh - 48px)',
    overflow: 'hidden',
    bg: 'bg.surface',
    color: 'text.primary',
    borderWidth: '1px',
    borderColor: 'border.subtle',
    borderRadius: 'xl',
    boxShadow: 'md',
    _focusVisible: {
      outline: 'none',
      boxShadow: 'focus',
    },
  },
  variants: {
    size: {
      sm: {
        maxW: '360px',
      },
      md: {
        maxW: '480px',
      },
      lg: {
        maxW: '640px',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const headerStyle = css({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '4',
  px: { base: '5', md: '6' },
  pt: { base: '5', md: '6' },
  pb: '3',
})

const titleStyle = css({
  color: 'text.primary',
  fontSize: { base: 'lg', md: 'xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const closeButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '8',
  height: '8',
  mt: '-1',
  mr: '-1',
  borderWidth: '1px',
  borderColor: 'transparent',
  borderRadius: 'pill',
  bg: 'transparent',
  color: 'text.secondary',
  fontSize: '2xl',
  lineHeight: '1',
  transitionProperty: 'background-color, border-color, color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    bg: 'bg.muted',
    color: 'text.primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const bodyStyle = css({
  overflowY: 'auto',
  px: { base: '5', md: '6' },
  pb: { base: '5', md: '6' },
  color: 'text.primary',
  fontSize: 'md',
  lineHeight: 'normal',
})

const footerStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: '3',
  px: { base: '5', md: '6' },
  py: '4',
  borderTopWidth: '1px',
  borderColor: 'border.subtle',
  bg: 'bg.surface',
})

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    dialogRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose()
    }
  }

  const handleDialogClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <div className={overlayStyle} onClick={handleOverlayClick}>
      <div
        ref={dialogRef}
        aria-labelledby={title ? titleId : undefined}
        aria-modal="true"
        className={cx(dialogStyle({ size }), className)}
        onClick={handleDialogClick}
        role="dialog"
        tabIndex={-1}
      >
        <div className={headerStyle}>
          {title ? (
            <h2 className={titleStyle} id={titleId}>
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            aria-label="모달 닫기"
            className={closeButtonStyle}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className={bodyStyle}>{children}</div>

        {footer && <div className={footerStyle}>{footer}</div>}
      </div>
    </div>
  )
}

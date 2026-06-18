'use client'

import { css } from '@/styled-system/css'

interface ToastProps {
  message: string
  visible: boolean
}

const toastStyle = css({
  position: 'fixed',
  bottom: '8',
  left: '50%',
  zIndex: '9999',
  px: '5',
  py: '3',
  bg: 'text.primary',
  color: 'text.inverse',
  borderRadius: 'full',
  fontSize: 'sm',
  fontWeight: 'medium',
  whiteSpace: 'nowrap',
  boxShadow: 'md',
  pointerEvents: 'none',
  transition: 'opacity 200ms ease, transform 200ms ease',
})

const visibleStyle = css({
  opacity: 1,
  transform: 'translateX(-50%) translateY(0)',
})

const hiddenStyle = css({
  opacity: 0,
  transform: 'translateX(-50%) translateY(8px)',
})

export function Toast({ message, visible }: ToastProps) {
  return (
    <div className={`${toastStyle} ${visible ? visibleStyle : hiddenStyle}`}>
      {message}
    </div>
  )
}

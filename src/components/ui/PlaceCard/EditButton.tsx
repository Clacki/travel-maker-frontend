'use client'

import { useEffect, useRef, useState } from 'react'
import { css } from '@/styled-system/css'

export interface EditButtonProps {
  placeId: number
  onEditClick: (placeId: number) => void
  onDeleteClick: (placeId: number) => void
}

const wrapperStyle = css({
  position: 'absolute',
  top: '0',
  right: '0',
})

const triggerStyle = css({
  position: 'absolute',
  top: '2',
  right: '2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '8',
  height: '8',
  borderRadius: 'pill',
  bg: 'bg.surface',
  border: 'none',
  cursor: 'pointer',
  color: 'text.secondary',
  transitionProperty: 'background-color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    bg: 'primary.soft',
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const dropdownStyle = css({
  position: 'absolute',
  top: '11',
  right: '2',
  zIndex: '10',
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'md',
  boxShadow: 'md',
  overflow: 'hidden',
  minW: '28',
})

const menuItemStyle = css({
  display: 'block',
  width: '100%',
  px: '4',
  py: '2',
  fontSize: 'sm',
  textAlign: 'left',
  color: 'text.primary',
  bg: 'transparent',
  border: 'none',
  cursor: 'pointer',
  _hover: {
    bg: 'bg.muted',
  },
  _focusVisible: {
    outline: 'none',
    bg: 'bg.muted',
  },
})

const deleteItemStyle = css({
  display: 'block',
  width: '100%',
  px: '4',
  py: '2',
  fontSize: 'sm',
  textAlign: 'left',
  color: 'warning',
  bg: 'transparent',
  border: 'none',
  cursor: 'pointer',
  _hover: {
    bg: 'bg.muted',
  },
  _focusVisible: {
    outline: 'none',
    bg: 'bg.muted',
  },
})

export function EditButton({
  placeId,
  onEditClick,
  onDeleteClick,
}: EditButtonProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className={wrapperStyle}>
      <button
        type="button"
        aria-label="리뷰 수정/삭제 메뉴 열기"
        aria-expanded={open}
        aria-haspopup="menu"
        className={triggerStyle}
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>

      {open && (
        <div role="menu" className={dropdownStyle}>
          <button
            type="button"
            role="menuitem"
            className={menuItemStyle}
            onClick={() => {
              onEditClick(placeId)
              setOpen(false)
            }}
          >
            수정
          </button>
          <button
            type="button"
            role="menuitem"
            className={deleteItemStyle}
            onClick={() => {
              onDeleteClick(placeId)
              setOpen(false)
            }}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  )
}

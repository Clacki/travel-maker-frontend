'use client'

import { useEffect, useRef, useState } from 'react'
import { Pencil } from 'lucide-react'
import { css } from '@/styled-system/css'

export interface EditButtonProps {
  placeId: number
  actionId?: number
  onEditClick: (id: number) => void
  onDeleteClick: (id: number) => void
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
  actionId,
  onEditClick,
  onDeleteClick,
}: EditButtonProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const targetId = actionId ?? placeId

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
        <Pencil size={16} />
      </button>

      {open && (
        <div role="menu" className={dropdownStyle}>
          <button
            type="button"
            role="menuitem"
            className={menuItemStyle}
            onClick={() => {
              onEditClick(targetId)
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
              onDeleteClick(targetId)
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

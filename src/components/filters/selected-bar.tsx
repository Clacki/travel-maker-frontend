'use client'

import { css } from '@/styled-system/css'

interface SelectedBarProps {
  selectedItems: { id: string; label: string }[]
  onRemove: (id: string) => void
}

export function SelectedBar({ selectedItems, onRemove }: SelectedBarProps) {
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2',
        px: '6',
        py: '3',
        bg: 'primary.soft',
        minH: '12',
        alignItems: 'center',
        borderTopLeftRadius: 'lg',
        borderTopRightRadius: 'lg',
      })}
    >
      <span
        className={css({
          fontSize: 'xs',
          fontWeight: 'semibold',
          color: 'primary',
          mr: '1',
        })}
      >
        선택됨
      </span>

      {selectedItems.length === 0 ? (
        <span
          className={css({
            fontSize: 'sm',
            color: 'text.secondary',
            fontWeight: 'normal',
          })}
        >
          태그를 선택해보세요
        </span>
      ) : (
        selectedItems.map((item) => (
          <span
            key={item.id}
            className={css({
              bg: 'bg.surface',
              borderWidth: '1px',
              borderColor: 'primary',
              color: 'primary',
              fontSize: 'xs',
              fontWeight: 'semibold',
              px: '3',
              py: '1',
              borderRadius: 'pill',
              display: 'flex',
              alignItems: 'center',
              gap: '1',
            })}
          >
            {item.label}
            <button
              type="button"
              aria-label={`${item.label} 선택 해제`}
              onClick={() => onRemove(item.id)}
              className={css({
                cursor: 'pointer',
                color: 'text.secondary',
                fontSize: 'sm',
                lineHeight: 1,
                border: 'none',
                bg: 'transparent',
                p: '0',
                _hover: { color: 'text.primary' },
                _focusVisible: { outline: 'none', boxShadow: 'focus' },
              })}
            >
              ×
            </button>
          </span>
        ))
      )}
    </div>
  )
}

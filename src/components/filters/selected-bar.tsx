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
        gap: '6px',
        padding: '12px 24px',
        bg: 'primary/8',
        minH: '48px',
        alignItems: 'center',
        borderRadius: '11px 11px 0 0',
      })}
    >
      <span
        className={css({
          fontSize: '11px',
          fontWeight: 600,
          color: 'primary',
          letterSpacing: '0.05em',
          mr: '4px',
        })}
      >
        선택됨
      </span>

      {selectedItems.length === 0 ? (
        <span
          className={css({
            fontSize: '12px',
            color: 'muted.foreground',
            fontWeight: 400,
          })}
        >
          태그를 선택해보세요
        </span>
      ) : (
        selectedItems.map((item) => (
          <span
            key={item.id}
            className={css({
              bg: 'card',
              border: '1.5px solid',
              borderColor: 'primary/30',
              color: 'primary',
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            })}
          >
            {item.label}
            <span
              onClick={() => onRemove(item.id)}
              className={css({
                cursor: 'pointer',
                color: 'muted.foreground',
                fontSize: '13px',
                lineHeight: 1,
                _hover: { color: 'foreground' },
              })}
            >
              ×
            </span>
          </span>
        ))
      )}
    </div>
  )
}

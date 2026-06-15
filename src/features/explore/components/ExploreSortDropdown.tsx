'use client'

import { type RefObject } from 'react'
import { css } from '@/styled-system/css'
import { SORT_LABELS, type SortKey } from '../constants'

interface ExploreSortDropdownProps {
  sort: SortKey
  isOpen: boolean
  isLoggedIn: boolean
  dropdownRef: RefObject<HTMLDivElement | null>
  onToggle: () => void
  onSelect: (key: SortKey) => void
  totalCount: number
  hasFilter: boolean
}

export function ExploreSortDropdown({
  sort,
  isOpen,
  isLoggedIn,
  dropdownRef,
  onToggle,
  onSelect,
  totalCount,
  hasFilter,
}: ExploreSortDropdownProps) {
  return (
    <section
      className={css({
        py: 5,
        px: 6,
        borderBottom: hasFilter ? '1px solid' : 'none',
        borderColor: 'border',
      })}
    >
      <div className={css({ maxW: '7xl', mx: 'auto' })}>
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 4,
          })}
        >
          <p className={css({ fontSize: 'sm', color: 'text.secondary' })}>
            {hasFilter ? '필터 적용됨 · ' : ''}
            {totalCount}개의 여행지
          </p>

          <div ref={dropdownRef} className={css({ position: 'relative' })}>
            <button
              type="button"
              onClick={onToggle}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                px: '14px',
                py: '7px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1.5px solid',
                borderColor: 'primary',
                bg: 'primary',
                color: 'text.inverse',
                transitionProperty: 'opacity',
                transitionDuration: '150ms',
                _hover: { opacity: 0.88 },
              })}
            >
              {SORT_LABELS[sort]}
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 150ms',
                }}
              >
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isOpen && (
              <div
                className={css({
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  right: 0,
                  bg: 'bg.surface',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: 'border',
                  boxShadow: 'md',
                  overflow: 'hidden',
                  zIndex: 10,
                  minW: '120px',
                })}
              >
                {(Object.keys(SORT_LABELS) as SortKey[])
                  .filter((key) => key !== 'recommended' || isLoggedIn)
                  .map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onSelect(key)}
                      className={css({
                        display: 'block',
                        w: 'full',
                        px: '14px',
                        py: '9px',
                        fontSize: '13px',
                        fontWeight: sort === key ? 600 : 400,
                        textAlign: 'left',
                        cursor: 'pointer',
                        bg: sort === key ? 'bg.subtle' : 'transparent',
                        color: sort === key ? 'primary' : 'text.secondary',
                        border: 'none',
                        _hover: { bg: 'bg.subtle', color: 'text.primary' },
                      })}
                    >
                      {SORT_LABELS[key]}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

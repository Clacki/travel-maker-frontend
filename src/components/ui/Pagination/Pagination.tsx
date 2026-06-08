'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { css } from '@/styled-system/css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
  }
  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }
  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    totalPages,
  ]
}

const navButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  w: '36px',
  h: '36px',
  borderRadius: 'sm',
  border: '1.5px solid',
  borderColor: 'border',
  bg: 'bg.surface',
  color: 'text.secondary',
  cursor: 'pointer',
  _hover: { borderColor: 'primary', color: 'primary' },
  _disabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
    _hover: { borderColor: 'border', color: 'text.secondary' },
  },
})

const pageButtonStyle = (isActive: boolean) =>
  css({
    w: '36px',
    h: '36px',
    borderRadius: 'sm',
    border: '1.5px solid',
    fontSize: 'sm',
    fontWeight: 'semibold',
    cursor: 'pointer',
    transitionProperty: 'background-color, color, border-color',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out',
    borderColor: isActive ? 'primary' : 'border',
    bg: isActive ? 'primary' : 'bg.surface',
    color: isActive ? 'text.inverse' : 'text.secondary',
    _hover: isActive ? {} : { borderColor: 'primary', color: 'primary' },
  })

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2',
        mt: 12,
      })}
    >
      <button
        type="button"
        aria-label="이전 페이지"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={navButtonStyle}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${i}`}
            className={css({
              px: '2',
              color: 'text.secondary',
              fontSize: 'sm',
            })}
          >
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-label={`${page}페이지`}
            aria-current={currentPage === page ? 'page' : undefined}
            onClick={() => onPageChange(page)}
            className={pageButtonStyle(currentPage === page)}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="다음 페이지"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={navButtonStyle}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

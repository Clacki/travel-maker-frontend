'use client'

import { useState } from 'react'
import { css } from '@/styled-system/css'
import { ChevronDown, ChevronRight } from 'lucide-react'

export type BadgeVariant = 'multi' | 'single' | 'bool'

interface FilterSectionProps {
  icon: string
  label: string
  typeLabel: string
  badgeVariant: BadgeVariant
  isLast?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
}

const badgeStyles: Record<
  BadgeVariant,
  { bg: string; color: string; text: string }
> = {
  multi: {
    bg: 'var(--colors-primary)/15',
    color: 'var(--colors-primary)',
    text: '복수 선택',
  },
  single: {
    bg: 'oklch(0.95 0.08 80)/50',
    color: 'oklch(0.55 0.15 60)',
    text: '1개 선택',
  },
  bool: {
    bg: 'oklch(0.95 0.05 300)/50',
    color: 'oklch(0.50 0.15 290)',
    text: 'on / off',
  },
}

export function FilterSection({
  icon,
  label,
  typeLabel,
  badgeVariant,
  isLast = false,
  defaultOpen = true,
  children,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const badge = badgeStyles[badgeVariant]

  return (
    <div
      className={css({
        borderBottom: isLast ? 'none' : '1px solid',
        borderColor: 'border',
      })}
    >
      {/* Header row - clickable to toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={css({
          width: '100%',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          cursor: 'pointer',
          border: 'none',
          bg: 'transparent',
          transition: 'background 0.15s',
          _hover: { bg: 'secondary/40' },
        })}
      >
        {/* Left: icon + label */}
        <span
          className={css({
            fontSize: '13px',
            fontWeight: 700,
            color: 'foreground',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          })}
        >
          <span className={css({ fontSize: '15px' })}>{icon}</span>
          {label}
        </span>

        {/* Right: badge + chevron */}
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          })}
        >
          <span
            className={css({
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              padding: '3px 9px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              bg: 'primary/10',
              color: 'primary',
            })}
          >
            {badge.text}
          </span>
          {isOpen ? (
            <ChevronDown
              size={14}
              className={css({ color: 'muted.foreground' })}
            />
          ) : (
            <ChevronRight
              size={14}
              className={css({ color: 'muted.foreground' })}
            />
          )}
        </div>
      </button>

      {/* Tags area - conditionally rendered */}
      {isOpen && (
        <div
          className={css({
            padding: '0 20px 12px 20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '7px',
          })}
        >
          {children}
        </div>
      )}
    </div>
  )
}

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

export function FilterSection({
  icon,
  label,
  badgeVariant,
  isLast = false,
  defaultOpen = true,
  children,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const badgeLabel =
    badgeVariant === 'multi'
      ? '복수 선택'
      : badgeVariant === 'single'
        ? '1개 선택'
        : 'on / off'

  return (
    <div
      className={css({
        borderBottom: isLast ? 'none' : '1px solid',
        borderColor: 'border',
      })}
    >
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
          transitionProperty: 'background-color',
          transitionDuration: '150ms',
          transitionTimingFunction: 'ease-in-out',
          _hover: { bg: 'bg.muted' },
        })}
      >
        <span
          className={css({
            fontSize: '13px',
            fontWeight: 700,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          })}
        >
          <span className={css({ fontSize: '15px' })}>{icon}</span>
          {label}
        </span>

        <div
          className={css({ display: 'flex', alignItems: 'center', gap: '8px' })}
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
            {badgeLabel}
          </span>
          {isOpen ? (
            <ChevronDown
              size={14}
              className={css({ color: 'text.secondary' })}
            />
          ) : (
            <ChevronRight
              size={14}
              className={css({ color: 'text.secondary' })}
            />
          )}
        </div>
      </button>

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

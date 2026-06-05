'use client'

import { useState } from 'react'
import { css } from '@/styled-system/css'
import { ChevronDown, ChevronRight } from 'lucide-react'

export type BadgeVariant = 'multi' | 'single' | 'bool'

interface FilterSectionProps {
  icon: string
  label: string
  badgeVariant: BadgeVariant
  isLast?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
}

const badgeTextMap: Record<BadgeVariant, string> = {
  multi: '복수 선택',
  single: '1개 선택',
  bool: 'on / off',
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

  return (
    <div
      className={css({
        borderBottomWidth: isLast ? '0' : '1px',
        borderColor: 'border.subtle',
      })}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={css({
          width: 'full',
          py: '3',
          px: '5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '3',
          cursor: 'pointer',
          border: 'none',
          bg: 'transparent',
          transitionProperty: 'background-color',
          transitionDuration: '150ms',
          _hover: { bg: 'bg.muted' },
          _focusVisible: { outline: 'none', boxShadow: 'focus' },
        })}
      >
        <span
          className={css({
            fontSize: 'sm',
            fontWeight: 'bold',
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: '1',
          })}
        >
          <span>{icon}</span>
          {label}
        </span>

        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '2',
          })}
        >
          <span
            className={css({
              fontSize: 'xs',
              fontWeight: 'semibold',
              px: '2',
              py: '1',
              borderRadius: 'xs',
              whiteSpace: 'nowrap',
              bg: 'primary.soft',
              color: 'primary',
            })}
          >
            {badgeTextMap[badgeVariant]}
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
            pb: '3',
            px: '5',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2',
          })}
        >
          {children}
        </div>
      )}
    </div>
  )
}

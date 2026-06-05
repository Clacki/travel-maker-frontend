'use client'

import { useState, useCallback, useMemo } from 'react'
import { css } from '@/styled-system/css'
import { ChevronDown } from 'lucide-react'
import { FilterTag } from '@/components/common/tag'
import { Button } from '@/components/common/button'
import { SelectedBar } from '@/components/filters/selected-bar'

type TagData = {
  id: string
  label: string
  emoji?: string
  variant?: string
}

export type FilterSectionData = {
  id: string
  icon: string
  label: string
  badgeVariant: 'multi' | 'single' | 'bool'
  selectionMode: 'multi' | 'single'
  tags: TagData[]
}

interface FilterCardProps {
  sections: FilterSectionData[]
  onApply?: (selected: Record<string, string[]>) => void
  onReset?: () => void
  resultCount?: number
  initialSelected?: Record<string, string[]>
}

const badgeTextMap: Record<string, string> = {
  multi: '복수 선택',
  single: '1개 선택',
  bool: 'on / off',
}

export function FilterCard({
  sections,
  onApply,
  onReset,
  resultCount,
  initialSelected,
}: FilterCardProps) {
  const [selected, setSelected] = useState<Record<string, string[]>>(
    initialSelected ?? {}
  )
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const handleTagClick = useCallback(
    (sectionId: string, tagId: string, selectionMode: 'multi' | 'single') => {
      setSelected((prev) => {
        const current = prev[sectionId] || []

        if (selectionMode === 'single') {
          if (current.includes(tagId)) {
            const next = { ...prev }
            delete next[sectionId]
            return next
          }
          return { ...prev, [sectionId]: [tagId] }
        }

        if (current.includes(tagId)) {
          const filtered = current.filter((id) => id !== tagId)
          if (filtered.length === 0) {
            const next = { ...prev }
            delete next[sectionId]
            return next
          }
          return { ...prev, [sectionId]: filtered }
        }
        return { ...prev, [sectionId]: [...current, tagId] }
      })
    },
    []
  )

  const handleRemoveChip = useCallback((tagId: string) => {
    setSelected((prev) => {
      const next: Record<string, string[]> = {}
      for (const [key, ids] of Object.entries(prev)) {
        const filtered = ids.filter((id) => id !== tagId)
        if (filtered.length > 0) {
          next[key] = filtered
        }
      }
      return next
    })
  }, [])

  const handleReset = useCallback(() => {
    setSelected({})
    onReset?.()
  }, [onReset])

  const handleApply = useCallback(() => {
    onApply?.(selected)
  }, [onApply, selected])

  const selectedItems = useMemo(() => {
    const items: { id: string; label: string }[] = []
    for (const section of sections) {
      const sectionSelected = selected[section.id] || []
      for (const tag of section.tags) {
        if (sectionSelected.includes(tag.id)) {
          const label = tag.emoji ? `${tag.emoji} ${tag.label}` : tag.label
          items.push({ id: tag.id, label })
        }
      }
    }
    return items
  }, [sections, selected])

  const handleTabClick = useCallback((sectionId: string) => {
    setActiveSection((prev) => (prev === sectionId ? null : sectionId))
  }, [])

  const activeSectionData = useMemo(
    () => sections.find((s) => s.id === activeSection) ?? null,
    [sections, activeSection]
  )

  return (
    <div
      className={css({
        bg: 'bg.surface',
        borderRadius: 'lg',
        borderWidth: '1px',
        borderColor: 'border.subtle',
        boxShadow: 'sm',
        position: 'relative',
      })}
    >
      <SelectedBar selectedItems={selectedItems} onRemove={handleRemoveChip} />

      <div className={css({ position: 'relative' })}>
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2',
            px: '4',
            py: '3',
            bg: 'bg.canvas',
            borderBottomLeftRadius: activeSection ? '0' : 'lg',
            borderBottomRightRadius: activeSection ? '0' : 'lg',
          })}
        >
          {sections.map((section) => {
            const isActive = activeSection === section.id
            const sectionCount = (selected[section.id] || []).length

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleTabClick(section.id)}
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1',
                  px: '4',
                  py: '2',
                  borderRadius: 'sm',
                  fontSize: 'sm',
                  fontWeight: 'semibold',
                  cursor: 'pointer',
                  border: 'none',
                  transitionProperty: 'background-color, color',
                  transitionDuration: '150ms',
                  bg: isActive ? 'primary' : 'primary.soft',
                  color: isActive ? 'text.inverse' : 'primary',
                  _hover: isActive ? {} : { bg: 'bg.muted' },
                  _focusVisible: { outline: 'none', boxShadow: 'focus' },
                })}
              >
                <span>{section.icon}</span>
                {section.label}
                {sectionCount > 0 && (
                  <span
                    className={css({
                      w: '4',
                      h: '4',
                      borderRadius: 'pill',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'xs',
                      fontWeight: 'bold',
                      lineHeight: 1,
                      bg: isActive ? 'text.inverse' : 'primary',
                      color: isActive ? 'primary' : 'text.inverse',
                    })}
                  >
                    {sectionCount}
                  </span>
                )}
                {isActive && <ChevronDown size={12} />}
              </button>
            )
          })}
        </div>

        {activeSectionData && (
          <div
            className={css({
              position: 'absolute',
              top: '100%',
              left: '-1px',
              right: '-1px',
              zIndex: 50,
              borderWidth: '1px',
              borderColor: 'border.subtle',
              borderTop: 'none',
              borderBottomLeftRadius: 'lg',
              borderBottomRightRadius: 'lg',
              boxShadow: 'md',
              bg: 'bg.surface',
              px: '5',
              py: '4',
            })}
          >
            <div
              className={css({
                display: 'flex',
                justifyContent: 'flex-end',
                mb: '3',
              })}
            >
              <span
                className={css({
                  fontSize: 'xs',
                  color: 'text.secondary',
                  fontWeight: 'medium',
                })}
              >
                {badgeTextMap[activeSectionData.badgeVariant] ?? ''}
              </span>
            </div>
            <div
              className={css({
                display: 'flex',
                flexWrap: 'wrap',
                gap: '2',
              })}
            >
              {activeSectionData.tags.map((tag) => (
                <FilterTag
                  key={tag.id}
                  label={tag.emoji ? `${tag.emoji} ${tag.label}` : tag.label}
                  isSelected={(selected[activeSectionData.id] || []).includes(
                    tag.id
                  )}
                  onClick={() =>
                    handleTagClick(
                      activeSectionData.id,
                      tag.id,
                      activeSectionData.selectionMode
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className={css({
          px: '5',
          py: '3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bg: 'bg.muted',
          borderBottomLeftRadius: 'lg',
          borderBottomRightRadius: 'lg',
        })}
      >
        <span className={css({ fontSize: 'sm', color: 'text.secondary' })}>
          선택된 조건으로{' '}
          <strong className={css({ color: 'primary', fontWeight: 'bold' })}>
            {resultCount != null ? resultCount : '-'}
          </strong>
          개 여행지 검색 가능
        </span>
        <div className={css({ display: 'flex', gap: '2' })}>
          <Button variant="neutral" size="sm" onClick={handleReset}>
            초기화
          </Button>
          <Button variant="primary" size="sm" onClick={handleApply}>
            여행지 보기 →
          </Button>
        </div>
      </div>
    </div>
  )
}

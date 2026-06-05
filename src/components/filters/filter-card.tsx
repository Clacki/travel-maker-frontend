'use client'

import { useState, useCallback, useMemo } from 'react'
import { css } from '@/styled-system/css'
import { ChevronDown } from 'lucide-react'
import { Tag } from '@/components/filters/tag'
import { SelectedBar } from '@/components/filters/selected-bar'
import type { FilterSectionData } from '@/lib/filter-data'

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

        // Multi mode: toggle
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

  const totalSelected = selectedItems.length

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
        bg: 'card',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'border',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        position: 'relative',
      })}
    >
      {/* Selected bar */}
      <SelectedBar selectedItems={selectedItems} onRemove={handleRemoveChip} />

      {/* Tab buttons + floating panel */}
      <div className={css({ position: 'relative' })}>
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            padding: '10px 16px',
            bg: 'background',
            borderRadius: activeSection ? '0' : '0 0 11px 11px',
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
                  gap: '4px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 0.15s',
                  bg: isActive ? 'primary' : 'secondary',
                  color: isActive ? 'primary.foreground' : 'muted.foreground',
                  _hover: isActive
                    ? {}
                    : { bg: 'primary/10', color: 'primary' },
                })}
              >
                <span className={css({ fontSize: '14px' })}>
                  {section.icon}
                </span>
                {section.label}
                {sectionCount > 0 && (
                  <span
                    className={css({
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 700,
                      lineHeight: 1,
                      bg: isActive ? 'primary.foreground' : 'primary',
                      color: isActive ? 'primary' : 'primary.foreground',
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

        {/* Floating tag panel */}
        {activeSectionData && (
          <div
            className={css({
              position: 'absolute',
              top: '100%',
              left: '-1px',
              right: '-1px',
              zIndex: 50,
              border: '1px solid',
              borderColor: 'border/70',
              borderTop: 'none',
              borderRadius: '0 0 12px 12px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(16px)',
              bg: 'card/92',
              padding: '14px 20px 16px',
            })}
          >
            {/* Type label */}
            <div
              className={css({
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '10px',
              })}
            >
              <span
                className={css({
                  fontSize: '11px',
                  color: 'muted.foreground',
                  fontWeight: 500,
                })}
              >
                {badgeTextMap[activeSectionData.badgeVariant] ?? ''}
              </span>
            </div>
            {/* Tags */}
            <div
              className={css({
                display: 'flex',
                flexWrap: 'wrap',
                gap: '7px',
              })}
            >
              {activeSectionData.tags.map((tag) => (
                <Tag
                  key={tag.id}
                  label={tag.label}
                  emoji={tag.emoji}
                  variant={tag.variant || 'default'}
                  isActive={(selected[activeSectionData.id] || []).includes(
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

      {/* Footer */}
      <div
        className={css({
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bg: 'secondary/30',
          borderRadius: '0 0 11px 11px',
        })}
      >
        <span className={css({ fontSize: '13px', color: 'muted.foreground' })}>
          선택된 조건으로{' '}
          <strong className={css({ color: 'primary', fontWeight: 700 })}>
            {resultCount != null ? resultCount : totalSelected > 0 ? '-' : '-'}
          </strong>
          개 여행지 검색 가능
        </span>
        <div className={css({ display: 'flex', gap: '8px' })}>
          <button
            onClick={handleReset}
            className={css({
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              borderColor: 'border',
              transition: 'all 0.15s',
              bg: 'secondary',
              color: 'muted.foreground',
              _hover: { bg: 'muted', color: 'foreground' },
            })}
          >
            초기화
          </button>
          <button
            onClick={handleApply}
            className={css({
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.15s',
              bg: 'primary',
              color: 'primary.foreground',
              _hover: { opacity: 0.88 },
            })}
          >
            여행지 보기 →
          </button>
        </div>
      </div>
    </div>
  )
}

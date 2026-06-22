'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { FilterTag } from '@/components/common/tag'
import { Button } from '@/components/common/button'
import { css, cva } from '@/styled-system/css'

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
  onApply?: (selected: Record<string, string[]>, searchValue: string) => void
  onReset?: () => void
  resultCount?: number
  initialSelected?: Record<string, string[]>
  onChange?: (selected: Record<string, string[]>) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
}

const badgeTextMap: Record<string, string> = {
  multi: '복수 선택',
  single: '1개 선택',
  bool: 'on / off',
}

const cardWrapperStyle = css({
  bg: 'bg.surface',
  borderRadius: 'lg',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  boxShadow: 'sm',
  position: 'relative',
})

const tabBarStyle = cva({
  base: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: { base: '1', sm: '2' },
    px: '4',
    py: '3',
    bg: 'bg.canvas',
  },
  variants: {
    isExpanded: {
      true: {
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0',
      },
      false: {
        borderBottomLeftRadius: 'lg',
        borderBottomRightRadius: 'lg',
      },
    },
  },
  defaultVariants: { isExpanded: false },
})

const tabButtonStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '1',
    px: { base: '2', sm: '4' },
    py: '2',
    borderRadius: 'sm',
    fontSize: { base: 'xs', sm: 'sm' },
    fontWeight: 'semibold',
    cursor: 'pointer',
    border: 'none',
    flexShrink: 0,
    transitionProperty: 'background-color, color',
    transitionDuration: '150ms',
    _focusVisible: { outline: 'none', boxShadow: 'focus' },
  },
  variants: {
    isActive: {
      true: {
        bg: 'primary',
        color: 'text.inverse',
      },
      false: {
        bg: 'primary.soft',
        color: 'primary',
        _hover: { bg: 'bg.muted' },
      },
    },
  },
  defaultVariants: { isActive: false },
})

const badgeCountStyle = cva({
  base: {
    w: '4',
    h: '4',
    borderRadius: 'pill',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'xs',
    fontWeight: 'bold',
    lineHeight: 1,
  },
  variants: {
    isActive: {
      true: { bg: 'text.inverse', color: 'primary' },
      false: { bg: 'primary', color: 'text.inverse' },
    },
  },
  defaultVariants: { isActive: false },
})

const dropdownPanelStyle = css({
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
})

const badgeHintStyle = css({
  fontSize: 'xs',
  color: 'text.secondary',
  fontWeight: 'medium',
})

const tagGridStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

const footerBarStyle = css({
  px: '5',
  py: '3',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  bg: 'bg.muted',
  borderBottomLeftRadius: 'lg',
  borderBottomRightRadius: 'lg',
})

const resultTextStyle = css({
  fontSize: 'sm',
  color: 'text.secondary',
})

const resultCountStyle = css({
  color: 'primary',
  fontWeight: 'bold',
})

const actionGroupStyle = css({
  display: 'flex',
  gap: '2',
  marginLeft: 'auto',
  flexShrink: 0,
})

export function FilterCard({
  sections,
  onApply,
  onReset,
  resultCount,
  initialSelected,
  onChange,
  searchValue = '',
  onSearchChange,
}: FilterCardProps) {
  const initialSelectedKey = useMemo(
    () =>
      sections
        .map((section) => {
          const values = initialSelected?.[section.id] ?? []
          return `${section.id}:${values.join(',')}`
        })
        .join('|'),
    [initialSelected, sections]
  )
  const [selected, setSelected] = useState<Record<string, string[]>>(
    initialSelected ?? {}
  )
  const [syncedInitialSelectedKey, setSyncedInitialSelectedKey] =
    useState(initialSelectedKey)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  if (syncedInitialSelectedKey !== initialSelectedKey) {
    setSyncedInitialSelectedKey(initialSelectedKey)
    setSelected(initialSelected ?? {})
  }

  useEffect(() => {
    onChange?.(selected)
  }, [selected, onChange])

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

        // '전체' 태그: 클릭 시 나머지 해제, 나머지 태그 클릭 시 '전체' 해제
        if (tagId === 'all') {
          if (current.includes('all')) {
            const next = { ...prev }
            delete next[sectionId]
            return next
          }
          return { ...prev, [sectionId]: ['all'] }
        }
        const withoutAll = current.filter((id) => id !== 'all')
        if (withoutAll.includes(tagId)) {
          const filtered = withoutAll.filter((id) => id !== tagId)
          if (filtered.length === 0) {
            const next = { ...prev }
            delete next[sectionId]
            return next
          }
          return { ...prev, [sectionId]: filtered }
        }
        return { ...prev, [sectionId]: [...withoutAll, tagId] }
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
    setActiveSection(null)
    onApply?.(selected, searchValue ?? '')
  }, [onApply, selected, searchValue])

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

  const selectedKey = useMemo(
    () =>
      sections
        .map((section) => {
          const values = selected[section.id] ?? []
          return `${section.id}:${values.join(',')}`
        })
        .join('|'),
    [sections, selected]
  )
  const initialSearchValue = initialSelected?.keyword?.[0] ?? ''
  const hasChanges =
    selectedKey !== initialSelectedKey ||
    searchValue.trim() !== initialSearchValue.trim()

  const handleTabClick = useCallback((sectionId: string) => {
    setActiveSection((prev) => (prev === sectionId ? null : sectionId))
  }, [])

  const activeSectionData = useMemo(
    () => sections.find((s) => s.id === activeSection) ?? null,
    [sections, activeSection]
  )

  return (
    <div className={cardWrapperStyle}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const domInput = e.currentTarget.querySelector(
            'input'
          ) as HTMLInputElement | null
          const currentValue = domInput?.value ?? searchValue ?? ''
          setActiveSection(null)
          onApply?.(selected, currentValue)
        }}
        className={css({
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px',
          px: '4',
          py: '3',
          bg: 'primary.soft',
          borderTopLeftRadius: 'lg',
          borderTopRightRadius: 'lg',
          minH: '12',
        })}
      >
        <Search
          size={14}
          className={css({ color: 'primary', flexShrink: 0 })}
        />
        {selectedItems.map((item) => (
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
              display: { base: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: '1',
              flexShrink: 0,
            })}
          >
            {item.label}
            <button
              type="button"
              aria-label={`${item.label} 선택 해제`}
              onClick={() => handleRemoveChip(item.id)}
              className={css({
                cursor: 'pointer',
                color: 'text.secondary',
                fontSize: 'sm',
                lineHeight: 1,
                border: 'none',
                bg: 'transparent',
                p: '0',
                _hover: { color: 'text.primary' },
              })}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={
            selectedItems.length > 0
              ? '검색어를 추가해보세요'
              : '태그 선택 또는 검색어 입력 ✈️'
          }
          className={css({
            flex: 1,
            border: 'none',
            outline: 'none',
            bg: 'transparent',
            fontSize: 'sm',
            color: 'text.primary',
            minW: '80px',
            _placeholder: { color: 'primary/60' },
          })}
        />
        {searchValue.trim().length > 0 && (
          <button
            type="submit"
            aria-label="검색"
            className={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              bg: 'primary',
              color: 'text.inverse',
              cursor: 'pointer',
              p: '5px',
              borderRadius: '6px',
              flexShrink: 0,
              _hover: { opacity: 0.85 },
            })}
          >
            <Search size={13} />
          </button>
        )}
      </form>

      <div className={css({ position: 'relative' })}>
        <div className={tabBarStyle({ isExpanded: !!activeSection })}>
          {sections.map((section) => {
            const isActive = activeSection === section.id
            const sectionCount = (selected[section.id] || []).length
            const shortLabel = section.label.split(' ').at(-1) ?? section.label

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleTabClick(section.id)}
                className={tabButtonStyle({ isActive })}
              >
                <span>{section.icon}</span>
                <span
                  className={css({ display: { base: 'none', sm: 'inline' } })}
                >
                  {section.label}
                </span>
                <span
                  className={css({ display: { base: 'inline', sm: 'none' } })}
                >
                  {shortLabel}
                </span>
                {sectionCount > 0 && (
                  <span className={badgeCountStyle({ isActive })}>
                    {sectionCount}
                  </span>
                )}
                {isActive && <ChevronDown size={12} />}
              </button>
            )
          })}
          <div className={actionGroupStyle}>
            <Button variant="neutral" size="sm" onClick={handleReset}>
              초기화
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!hasChanges}
              onClick={handleApply}
            >
              여행지 보기 →
            </Button>
          </div>
        </div>

        {activeSectionData && (
          <div className={dropdownPanelStyle}>
            {activeSectionData.badgeVariant !== 'bool' && (
              <div
                className={css({
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mb: '3',
                })}
              >
                <span className={badgeHintStyle}>
                  {badgeTextMap[activeSectionData.badgeVariant] ?? ''}
                </span>
              </div>
            )}
            <div className={tagGridStyle}>
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

      <div className={footerBarStyle}>
        <span className={resultTextStyle}>
          선택된 조건으로{' '}
          <strong className={resultCountStyle}>
            {resultCount != null ? resultCount : '-'}
          </strong>
          개 여행지 검색 가능
        </span>
      </div>
    </div>
  )
}

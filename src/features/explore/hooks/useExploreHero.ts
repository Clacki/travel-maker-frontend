'use client'

import { useMemo } from 'react'
import { travelCategories } from '@/mocks/data/travel-data'
import { DEFAULT_BG, STYLE_TO_CATEGORY } from '../constants'

export function useExploreHero(
  previewStyle: string[] | null,
  selected: Record<string, string[]>,
  categoryId: string | null
) {
  const activeCategoryId = useMemo(() => {
    const effectiveStyle = previewStyle ?? selected.style ?? []
    const nonAllStyles = effectiveStyle.filter((s) => s !== 'all')
    if (nonAllStyles.length > 0) {
      const lastStyle = nonAllStyles[nonAllStyles.length - 1]
      return STYLE_TO_CATEGORY[lastStyle] ?? categoryId ?? null
    }
    if (categoryId) return categoryId
    return null
  }, [categoryId, previewStyle, selected.style])

  const activeCategory = useMemo(
    () => travelCategories.find((c) => c.id === activeCategoryId) ?? null,
    [activeCategoryId]
  )

  return {
    bgImage: activeCategory?.image ?? DEFAULT_BG,
    heroTitle: activeCategory?.name ?? '여행지 탐색',
    heroDesc:
      activeCategory?.description ?? '세계 각지의 여행지를 탐색해 보세요',
  }
}

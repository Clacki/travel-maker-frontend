import type { useSearchParams } from 'next/navigation'
import { travelFilterSections } from '@/lib/filter-data'

export function parseParams(
  searchParams: ReturnType<typeof useSearchParams>
): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  searchParams.forEach((value, key) => {
    if (key !== 'sort' && key !== 'category' && value) {
      result[key] = value.split(',')
    }
  })
  return result
}

export function getFilterChips(selected: Record<string, string[]>) {
  const chips: { sectionId: string; tagId: string; label: string }[] = []
  for (const section of travelFilterSections) {
    const ids = selected[section.id] || []
    for (const tagId of ids) {
      const tag = section.tags.find((t) => t.id === tagId)
      if (tag) {
        const label = tag.emoji ? `${tag.emoji} ${tag.label}` : tag.label
        chips.push({ sectionId: section.id, tagId, label })
      }
    }
  }
  return chips
}

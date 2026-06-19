'use client'

import { useMemo } from 'react'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import {
  useProfileStore,
  getDefaultEditableProfile,
} from '@/store/profileStore'
import {
  STYLE_TO_CATEGORY,
  CATEGORY_TO_TAG_NAME,
  FILTER_TAG_TO_TAG_NAME,
  type SortKey,
} from '../constants'

interface UseExploreTagNamesParams {
  selected: Record<string, string[]>
  categoryId: string | null
  sort: SortKey
}

export function useExploreTagNames({
  selected,
  categoryId,
  sort,
}: UseExploreTagNamesParams) {
  const selectedTagNames = useMemo(() => {
    const names: string[] = []
    const styleValues = (selected.style ?? []).filter((s) => s !== 'all')
    for (const s of styleValues) {
      const cat = STYLE_TO_CATEGORY[s] ?? s
      const name = CATEGORY_TO_TAG_NAME[cat]
      if (name) names.push(name)
    }
    for (const section of ['theme', 'companion', 'region', 'facility']) {
      for (const v of selected[section] ?? []) {
        const name = FILTER_TAG_TO_TAG_NAME[v]
        if (name) names.push(name)
      }
    }
    if (names.length === 0 && categoryId) {
      const name = CATEGORY_TO_TAG_NAME[categoryId]
      if (name) names.push(name)
    }
    return names
  }, [selected, categoryId])

  const userId = useUserProfileStore((state) => state.userProfile?.id)
  const profileTagNames = useMemo(() => {
    const profiles = useProfileStore.getState().profiles
    const profile = userId
      ? (profiles[userId] ?? getDefaultEditableProfile())
      : getDefaultEditableProfile()
    return profile.tagIds
      .map((tagId) => FILTER_TAG_TO_TAG_NAME[tagId])
      .filter((name): name is string => Boolean(name))
  }, [userId])

  const effectiveTagNames =
    sort === 'recommended' ? profileTagNames : selectedTagNames

  return { effectiveTagNames }
}

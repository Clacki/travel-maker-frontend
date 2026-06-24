'use client'

import { useState, useEffect } from 'react'
import {
  getPlaces,
  getPlacesFilter,
  getPlacesRecommend,
  getPlacesSearch,
} from '../api/placesApi'
import {
  useProfileStore,
  getDefaultEditableProfile,
} from '@/store/profileStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import type { Place } from '../types/places.types'
import { useBookmarkToggle } from './useBookmarkToggle'
import type { Tag } from '../types/tags.types'
import {
  ITEMS_PER_PAGE,
  SORT_API_MAP,
  FILTER_TAG_TO_TAG_NAME,
  type SortKey,
} from '../constants'

interface UseExplorePlacesParams {
  currentPage: number
  selectedTagIdsKey: string
  sort: SortKey
  keyword: string
  tags: Tag[] | null
  pendingTag: string
  isAuthInitialized: boolean
  onLoginRequired: () => void
}

export function useExplorePlaces({
  currentPage,
  selectedTagIdsKey,
  sort,
  keyword,
  tags,
  pendingTag,
  isAuthInitialized,
  onLoginRequired,
}: UseExplorePlacesParams) {
  const [places, setPlaces] = useState<Place[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [fetchedKey, setFetchedKey] = useState<string | null>(null)

  const currentKey = `${currentPage}-${selectedTagIdsKey}-${sort}-${keyword}-${pendingTag}`
  const isLoading = fetchedKey !== currentKey

  useEffect(() => {
    let cancelled = false
    if (pendingTag) return

    if (sort === 'recommended') {
      if (!isAuthInitialized) return
      if (tags === null) return

      const userId = useUserProfileStore.getState().userProfile?.id
      const profile = userId
        ? useProfileStore
            .getState()
            .getProfile(userId, getDefaultEditableProfile())
        : getDefaultEditableProfile()

      const tagNameToId = new Map(tags.map((t) => [t.tag_name, t.id]))
      const recommendTagIds = profile.tagIds
        .map((tagId) => {
          const tagName = FILTER_TAG_TO_TAG_NAME[tagId]
          return tagName ? tagNameToId.get(tagName) : undefined
        })
        .filter((id): id is number => id !== undefined)

      getPlacesRecommend({
        ...(recommendTagIds.length > 0 ? { tags: recommendTagIds } : {}),
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
      })
        .then((data) => {
          if (cancelled) return
          setPlaces(data.results)
          setTotalCount(data.count)
          setFetchedKey(currentKey)
        })
        .catch(() => {
          if (cancelled) return
          setPlaces([])
          setTotalCount(0)
          setFetchedKey(currentKey)
        })

      return () => {
        cancelled = true
      }
    }

    const tagIds = selectedTagIdsKey
      ? selectedTagIdsKey.split(',').map(Number)
      : []
    const sortParams = SORT_API_MAP[sort as Exclude<SortKey, 'recommended'>]
    const hasTags = tagIds.length > 0
    const hasKeyword = keyword.trim().length > 0
    const hasSortOption = !!sortParams.sort

    let request: ReturnType<typeof getPlaces>

    if (hasTags || hasSortOption) {
      request = getPlacesFilter({
        ...(hasTags ? { tags: tagIds } : {}),
        ...(hasKeyword ? { keyword: keyword.trim() } : {}),
        ...sortParams,
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
      })
    } else if (hasKeyword) {
      request = getPlacesSearch({
        keyword: keyword.trim(),
        page: currentPage,
        page_size: ITEMS_PER_PAGE,
      })
    } else {
      request = getPlaces({ page: currentPage, page_size: ITEMS_PER_PAGE })
    }

    request
      .then((data) => {
        if (cancelled) return
        setPlaces(data.results)
        setTotalCount(data.count)
        setFetchedKey(currentKey)
      })
      .catch(() => {
        if (cancelled) return
        setPlaces([])
        setTotalCount(0)
        setFetchedKey(currentKey)
      })

    return () => {
      cancelled = true
    }
  }, [
    currentKey,
    currentPage,
    selectedTagIdsKey,
    sort,
    keyword,
    pendingTag,
    isAuthInitialized,
    tags,
  ])

  const { handleLikeToggle } = useBookmarkToggle({
    places,
    setPlaces,
    onLoginRequired,
  })

  return { places, totalCount, isLoading, handleLikeToggle }
}

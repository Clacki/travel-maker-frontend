'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  getPlaces,
  getPlacesFilter,
  getPlacesRecommend,
  getPlacesSearch,
} from '../api/placesApi'
import { postBookmark, deleteBookmark } from '@/features/mypage/api/bookmarkApi'
import {
  useProfileStore,
  getDefaultEditableProfile,
} from '@/store/profileStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import type { Place } from '../types/places.types'
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
  categoryId: string | null
  selected: Record<string, string[]>
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
  categoryId,
  selected,
  tags,
  pendingTag,
  isAuthInitialized,
  onLoginRequired,
}: UseExplorePlacesParams) {
  const { isLoggedIn } = useAuthStore()
  const [places, setPlaces] = useState<Place[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [fetchedKey, setFetchedKey] = useState<string | null>(null)

  const currentKey = `${currentPage}-${selectedTagIdsKey}-${sort}-${keyword}-${pendingTag}`
  const isLoading = fetchedKey !== currentKey

  useEffect(() => {
    if (!isAuthInitialized) return

    let cancelled = false
    if (pendingTag) return

    if (sort === 'recommended') {
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
        limit: ITEMS_PER_PAGE,
      })
        .then((data) => {
          if (cancelled) return
          setPlaces(data)
          setTotalCount(data.length)
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
    currentPage,
    selectedTagIdsKey,
    sort,
    keyword,
    pendingTag,
    isAuthInitialized,
    tags,
  ])

  async function handleLikeToggle(placeId: number) {
    if (!isAuthInitialized || !isLoggedIn) {
      onLoginRequired()
      return
    }

    const targetPlace = places.find((p) => p.id === placeId)
    if (!targetPlace) return

    const isAdding = !targetPlace.is_bookmarked
    const originalPlaces = [...places]
    setPlaces((prev) =>
      prev.map((p) =>
        p.id === placeId ? { ...p, is_bookmarked: isAdding } : p
      )
    )

    try {
      if (isAdding) {
        await postBookmark(placeId)
      } else {
        await deleteBookmark(placeId)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) return
      setPlaces(originalPlaces)
      alert('처리에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return { places, totalCount, isLoading, handleLikeToggle }
}

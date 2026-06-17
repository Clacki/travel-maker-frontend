import { useCallback, useEffect, useMemo, useState } from 'react'

import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'

import { deleteBookmark, getBookmarks } from '../api/bookmarkApi'
import type { BookmarkResponseItem } from '../types/mypage'

const BOOKMARK_PAGE_SIZE = 8

export function useMyBookmarks() {
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const accessToken = useAuthStore((state) => state.accessToken)
  const currentUserId = useUserProfileStore((state) => state.userProfile?.id)

  const [bookmarkResult, setBookmarkResult] = useState<{
    key: string
    items: BookmarkResponseItem[]
  } | null>(null)
  const [bookmarkPage, setBookmarkPage] = useState(1)

  const fetchKey = `${currentUserId ?? 'unknown'}:${accessToken ?? 'none'}`
  const canFetchBookmarks = isAuthInitialized && isLoggedIn && !!accessToken
  const bookmarks = useMemo(
    () =>
      canFetchBookmarks && bookmarkResult?.key === fetchKey
        ? bookmarkResult.items
        : [],
    [bookmarkResult, canFetchBookmarks, fetchKey]
  )
  const isBookmarkLoading =
    canFetchBookmarks && bookmarkResult?.key !== fetchKey

  useEffect(() => {
    if (!canFetchBookmarks) {
      return
    }

    let cancelled = false

    getBookmarks()
      .then((data) => {
        if (!cancelled) {
          setBookmarkResult({
            key: fetchKey,
            items: data as unknown as BookmarkResponseItem[],
          })
        }
      })
      .catch((error) => {
        console.error('Failed to load bookmarks', error)
        if (!cancelled) {
          setBookmarkResult({ key: fetchKey, items: [] })
        }
      })

    return () => {
      cancelled = true
    }
  }, [canFetchBookmarks, fetchKey])

  const handleLikeToggle = useCallback(async (placeId: number) => {
    try {
      await deleteBookmark(placeId)
      setBookmarkResult((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((item) => item.place.id !== placeId),
            }
          : prev
      )
    } catch (error) {
      console.error('Failed to delete bookmark', error)
    }
  }, [])

  const paginatedBookmarks = useMemo(
    () =>
      bookmarks.slice(
        (bookmarkPage - 1) * BOOKMARK_PAGE_SIZE,
        bookmarkPage * BOOKMARK_PAGE_SIZE
      ),
    [bookmarkPage, bookmarks]
  )

  return {
    bookmarks,
    bookmarkCount: bookmarks.length,
    bookmarkPage,
    bookmarkTotalPages: Math.ceil(bookmarks.length / BOOKMARK_PAGE_SIZE),
    isBookmarkLoading,
    paginatedBookmarks,
    setBookmarkPage,
    handleLikeToggle,
  }
}

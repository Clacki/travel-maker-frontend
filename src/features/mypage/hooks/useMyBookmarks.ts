import { useCallback, useEffect, useMemo, useState } from 'react'

import { useAuthStore } from '@/features/auth/store/useAuthStore'

import { deleteBookmark, getBookmarks } from '../api/bookmarkApi'
import type { BookmarkResponseItem } from '../types/mypage'

const BOOKMARK_PAGE_SIZE = 8

export function useMyBookmarks() {
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

  const [bookmarks, setBookmarks] = useState<BookmarkResponseItem[]>([])
  const [bookmarkPage, setBookmarkPage] = useState(1)
  const [bookmarksFetched, setBookmarksFetched] = useState(false)

  const isBookmarkLoading = isAuthInitialized && isLoggedIn && !bookmarksFetched

  useEffect(() => {
    if (!isAuthInitialized || !isLoggedIn) return

    let cancelled = false

    getBookmarks()
      .then((data) => {
        if (!cancelled) {
          setBookmarks(data as unknown as BookmarkResponseItem[])
          setBookmarksFetched(true)
        }
      })
      .catch((error) => {
        console.error('Failed to load bookmarks', error)
        if (!cancelled) {
          setBookmarksFetched(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [isAuthInitialized, isLoggedIn])

  const handleLikeToggle = useCallback(async (placeId: number) => {
    try {
      await deleteBookmark(placeId)
      setBookmarks((prev) => prev.filter((item) => item.place.id !== placeId))
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

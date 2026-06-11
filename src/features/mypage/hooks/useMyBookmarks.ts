import { useCallback, useEffect, useMemo, useState } from 'react'

import { deleteBookmark, getBookmarks } from '../api/bookmarkApi'
import type { BookmarkResponseItem } from '../types/mypage'

const BOOKMARK_PAGE_SIZE = 8

export function useMyBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkResponseItem[]>([])
  const [bookmarkPage, setBookmarkPage] = useState(1)
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    getBookmarks()
      .then((data) => {
        if (!cancelled) {
          setBookmarks(data as unknown as BookmarkResponseItem[])
          setIsBookmarkLoading(false)
        }
      })
      .catch((error) => {
        console.error('Failed to load bookmarks', error)
        if (!cancelled) {
          setIsBookmarkLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

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

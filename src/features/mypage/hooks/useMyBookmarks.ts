import { useCallback, useEffect, useState } from 'react'

import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import type {
  UserBookmarkPlace,
  UserBookmarksResponse,
} from '@/types/mypage.types'

import { deleteBookmark, getUserBookmarks } from '../api/bookmarkApi'

const BOOKMARK_PAGE_SIZE = 8

type BookmarksApiResponse = UserBookmarksResponse | UserBookmarkPlace[]

const normalizeBookmarksResponse = (
  data: BookmarksApiResponse
): UserBookmarksResponse => {
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data,
    }
  }

  return data
}

export function useMyBookmarks() {
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const accessToken = useAuthStore((state) => state.accessToken)
  const currentUserId = useUserProfileStore((state) => state.userProfile?.id)

  const [bookmarkResult, setBookmarkResult] = useState<{
    key: string
    data: UserBookmarksResponse
  } | null>(null)
  const [bookmarkPage, setBookmarkPage] = useState(1)

  const fetchKey = `${currentUserId ?? 'unknown'}:${accessToken ?? 'none'}`
  const requestKey = `${fetchKey}:${bookmarkPage}`
  const canFetchBookmarks = isAuthInitialized && isLoggedIn && !!accessToken
  const bookmarkData =
    canFetchBookmarks && bookmarkResult?.key === requestKey
      ? bookmarkResult.data
      : null
  const bookmarks = bookmarkData?.results ?? []
  const bookmarkCount = bookmarkData?.count ?? 0
  const isBookmarkLoading =
    canFetchBookmarks && bookmarkResult?.key !== requestKey

  useEffect(() => {
    if (!canFetchBookmarks) {
      return
    }

    let cancelled = false

    getUserBookmarks({ page: bookmarkPage, page_size: BOOKMARK_PAGE_SIZE })
      .then((data) => {
        if (!cancelled) {
          setBookmarkResult({
            key: requestKey,
            data: normalizeBookmarksResponse(data),
          })
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to load bookmarks', error)
        if (!cancelled) {
          setBookmarkResult({
            key: requestKey,
            data: { count: 0, next: null, previous: null, results: [] },
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [bookmarkPage, canFetchBookmarks, requestKey])

  const handleLikeToggle = useCallback(
    async (placeId: number) => {
      try {
        await deleteBookmark(placeId)

        const nextData = normalizeBookmarksResponse(
          await getUserBookmarks({
            page: bookmarkPage,
            page_size: BOOKMARK_PAGE_SIZE,
          })
        )

        if (
          nextData.results.length === 0 &&
          nextData.count > 0 &&
          bookmarkPage > 1
        ) {
          setBookmarkPage((page) => page - 1)
          return
        }

        setBookmarkResult({
          key: requestKey,
          data: nextData,
        })
      } catch (error) {
        console.error('Failed to delete bookmark', error)
      }
    },
    [bookmarkPage, requestKey]
  )

  return {
    bookmarks,
    bookmarkCount,
    bookmarkPage,
    bookmarkTotalPages: Math.ceil(bookmarkCount / BOOKMARK_PAGE_SIZE),
    isBookmarkLoading,
    setBookmarkPage,
    handleLikeToggle,
  }
}

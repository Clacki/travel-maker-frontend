'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { postBookmark, deleteBookmark } from '@/features/mypage/api/bookmarkApi'
import { getTravelDetail } from '../api/travelDetailApi'

interface UseTravelDetailBookmarkParams {
  placeId: number
  initialIsBookmarked?: boolean
  onLoginRequired: () => void
}

export function useTravelDetailBookmark({
  placeId,
  initialIsBookmarked,
  onLoginRequired,
}: UseTravelDetailBookmarkParams) {
  const { isLoggedIn, isAuthInitialized } = useAuthStore()
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked ?? false)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    if (!isAuthInitialized || !isLoggedIn) return

    getTravelDetail(String(placeId))
      .then((data) => setIsBookmarked(data.is_bookmarked ?? false))
      .catch((error) => console.error('찜 상태 동기화 실패', error))
  }, [isAuthInitialized, isLoggedIn, placeId])

  const toggleBookmark = async () => {
    if (!isAuthInitialized || isPending) {
      return
    }

    if (!isLoggedIn) {
      onLoginRequired()
      return
    }

    const isAdding = !isBookmarked
    setIsBookmarked(isAdding)
    setIsPending(true)

    try {
      if (isAdding) {
        await postBookmark(placeId)
      } else {
        await deleteBookmark(placeId)
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setIsPending(false)
        return
      }

      setIsBookmarked(!isAdding)
      alert('처리에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsPending(false)
    }
  }

  return {
    isAuthInitialized,
    isBookmarked,
    isPending,
    toggleBookmark,
  }
}

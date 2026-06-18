'use client'

import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { postBookmark, deleteBookmark } from '@/features/mypage/api/bookmarkApi'
import type { Place } from '../types/places.types'

interface UseBookmarkToggleParams {
  places: Place[]
  setPlaces: React.Dispatch<React.SetStateAction<Place[]>>
  onLoginRequired: () => void
}

export function useBookmarkToggle({
  places,
  setPlaces,
  onLoginRequired,
}: UseBookmarkToggleParams) {
  const { isLoggedIn, isAuthInitialized } = useAuthStore()

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

  return { handleLikeToggle }
}

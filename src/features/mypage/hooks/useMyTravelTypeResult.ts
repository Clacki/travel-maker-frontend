'use client'

import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import {
  getTravelTypeResult,
  normalizeTravelTypeResult,
} from '../api/travelTypeResultApi'
import type { TravelTypeResultState } from '../components/MyTravelTypeResult'

interface UseMyTravelTypeResultParams {
  isAuthInitialized: boolean
  isLoggedIn: boolean
  isTabActive: boolean
}

export function useMyTravelTypeResult({
  isAuthInitialized,
  isLoggedIn,
  isTabActive,
}: UseMyTravelTypeResultParams): TravelTypeResultState {
  const [state, setState] = useState<TravelTypeResultState>({
    status: 'loading',
  })

  useEffect(() => {
    if (!isAuthInitialized || !isLoggedIn || !isTabActive) return
    // 이미 로드된 경우 재요청하지 않음
    if (state.status !== 'loading') return

    getTravelTypeResult()
      .then((response) => {
        const normalized = normalizeTravelTypeResult(response)
        if (!normalized) {
          setState({ status: 'empty' })
        } else {
          setState({ status: 'success', data: normalized })
        }
      })
      .catch((error: unknown) => {
        const status = isAxiosError(error) ? error.response?.status : undefined
        if (status === 404) {
          setState({ status: 'empty' })
        } else {
          setState({
            status: 'error',
            message: '성향 테스트 결과를 불러오지 못했어요.',
          })
        }
      })
  }, [isAuthInitialized, isLoggedIn, isTabActive, state.status])

  return state
}

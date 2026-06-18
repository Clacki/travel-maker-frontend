import { useCallback, useEffect, useMemo, useState } from 'react'
import { isAxiosError } from 'axios'

import { deleteRoute } from '@/features/trips/api/routesApi'

import {
  getMyTrips,
  type MyRouteItem,
  type MyRoutesResponse,
} from '../api/myTripsApi'
import type { MyTripCourse } from '../types/mypage'

const TRIP_PAGE_SIZE = 8

function normalizeMyRoutesResponse(response: MyRoutesResponse) {
  if (Array.isArray(response)) {
    return {
      count: response.length,
      next: null,
      previous: null,
      results: response,
    }
  }

  const results = response.results ?? []

  return {
    count: response.count ?? results.length,
    next: response.next ?? null,
    previous: response.previous ?? null,
    results,
  }
}

function mapRouteToTripCourse(item: MyRouteItem): MyTripCourse {
  return {
    routeId: item.route_id,
    title: item.title,
    description: item.description ?? '',
    imageUrl: item.image_url,
    placeCount: item.place_count,
    tags: [],
    isPublic: true,
  }
}

interface UseMyTripsOptions {
  enabled: boolean
  isAuthInitialized: boolean
  isLoggedIn: boolean
  nickname: string
}

function getDeleteTripErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    const status = error.response?.status

    if (status === 401) {
      return '로그인이 만료되었습니다. 다시 로그인해주세요.'
    }

    if (status === 403) {
      return '코스를 삭제할 권한이 없습니다.'
    }

    if (status === 404) {
      return '이미 삭제되었거나 찾을 수 없는 코스입니다.'
    }

    if (status && status >= 500) {
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    }
  }

  return '코스 삭제에 실패했습니다. 다시 시도해주세요.'
}

export function useMyTrips({
  enabled,
  isAuthInitialized,
  isLoggedIn,
  nickname,
}: UseMyTripsOptions) {
  const [tripPage, setTripPage] = useState(1)
  const [trips, setTrips] = useState<MyTripCourse[]>([])
  const [tripCount, setTripCount] = useState(0)
  const [tripNext, setTripNext] = useState<string | null>(null)
  const [tripPrevious, setTripPrevious] = useState<string | null>(null)
  const [isTripLoading, setIsTripLoading] = useState(false)
  const [tripError, setTripError] = useState<string | null>(null)
  const [deletingTripId, setDeletingTripId] = useState<number | null>(null)
  const [isTripDeleting, setIsTripDeleting] = useState(false)
  const [tripDeleteError, setTripDeleteError] = useState<string | null>(null)

  const fetchMyTrips = useCallback(
    async (page: number) => {
      if (!isAuthInitialized || !isLoggedIn || !nickname) {
        return
      }

      setIsTripLoading(true)
      setTripError(null)

      try {
        const response = await getMyTrips(nickname, { page })
        const normalized = normalizeMyRoutesResponse(response)

        setTrips(normalized.results.map(mapRouteToTripCourse))
        setTripCount(normalized.count)
        setTripNext(normalized.next)
        setTripPrevious(normalized.previous)
      } catch {
        setTrips([])
        setTripCount(0)
        setTripNext(null)
        setTripPrevious(null)
        setTripError('여행 코스 목록을 불러오지 못했습니다.')
      } finally {
        setIsTripLoading(false)
      }
    },
    [isAuthInitialized, isLoggedIn, nickname]
  )

  useEffect(() => {
    if (!enabled) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      void fetchMyTrips(tripPage)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [enabled, fetchMyTrips, tripPage])

  const tripTotalPages = useMemo(
    () =>
      tripCount > 0
        ? Math.ceil(tripCount / TRIP_PAGE_SIZE)
        : tripNext || tripPrevious
          ? tripPage + (tripNext ? 1 : 0)
          : 1,
    [tripCount, tripNext, tripPage, tripPrevious]
  )

  const handleTripDeleteRequest = useCallback((routeId: number) => {
    setTripDeleteError(null)
    setDeletingTripId(routeId)
  }, [])

  const handleTripDeleteCancel = useCallback(() => {
    if (isTripDeleting) {
      return
    }

    setTripDeleteError(null)
    setDeletingTripId(null)
  }, [isTripDeleting])

  const handleTripDeleteConfirm = useCallback(async () => {
    if (isTripDeleting || deletingTripId === null) {
      return
    }

    setIsTripDeleting(true)
    setTripDeleteError(null)

    try {
      await deleteRoute(deletingTripId)
      setDeletingTripId(null)

      const nextPage =
        trips.length === 1 && tripPage > 1 ? tripPage - 1 : tripPage

      if (nextPage !== tripPage) {
        setTripPage(nextPage)
      } else {
        await fetchMyTrips(nextPage)
      }
    } catch (error) {
      setTripDeleteError(getDeleteTripErrorMessage(error))
    } finally {
      setIsTripDeleting(false)
    }
  }, [deletingTripId, fetchMyTrips, isTripDeleting, tripPage, trips.length])

  return {
    trips,
    tripCount,
    tripPage,
    tripTotalPages,
    isTripLoading,
    tripError,
    deletingTripId,
    isTripDeleting,
    tripDeleteError,
    setTripPage,
    fetchMyTrips,
    handleTripDeleteRequest,
    handleTripDeleteCancel,
    handleTripDeleteConfirm,
  }
}

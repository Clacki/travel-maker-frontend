import { useCallback, useEffect, useMemo, useState } from 'react'

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

  return {
    trips,
    tripCount,
    tripPage,
    tripTotalPages,
    isTripLoading,
    tripError,
    setTripPage,
    fetchMyTrips,
  }
}

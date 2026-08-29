import {
  AxiosError,
  type AxiosAdapter,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import { DEMO_ACCESS_TOKEN, demoDb, setBookmark } from '../../mocks/db'
import { demoTags } from '../../mocks/data/demoData'
import { reviewsByUserId, demoMyRoutes } from '../../mocks/data/profileData'
import { demoQuizResult } from '../../mocks/data/quizData'
import { demoRouteDetails, demoRouteList } from '../../mocks/data/routeData'
import { placeMockRepository } from '../../mocks/repositories/placeMockRepository'

type MockResult = { status?: number; data?: unknown }

function params(config: AxiosRequestConfig) {
  return (config.params ?? {}) as Record<string, unknown>
}

function header(config: AxiosRequestConfig, name: string) {
  const headers = config.headers as
    | { get?: (key: string) => unknown; [key: string]: unknown }
    | undefined
  return String(headers?.get?.(name) ?? headers?.[name] ?? '')
}

function isAuthorized(config: AxiosRequestConfig) {
  return header(config, 'Authorization') === `Bearer ${DEMO_ACCESS_TOKEN}`
}

function pageItems<T>(items: T[], config: AxiosRequestConfig, fallback = 8) {
  const query = params(config)
  const page = Math.max(1, Number(query.page) || 1)
  const pageSize = Math.max(1, Number(query.page_size) || fallback)
  const start = (page - 1) * pageSize
  return {
    count: items.length,
    next: start + pageSize < items.length ? String(page + 1) : null,
    previous: page > 1 ? String(page - 1) : null,
    results: items.slice(start, start + pageSize),
  }
}

function unauthorized(): MockResult {
  return { status: 401, data: { detail: 'Authentication required.' } }
}

function dispatch(config: AxiosRequestConfig): MockResult {
  const method = (config.method ?? 'get').toLowerCase()
  const pathname = new URL(config.url ?? '/', 'http://mock.local').pathname
  const query = params(config)
  const scenario = header(config, 'X-Demo-Scenario')

  if (method === 'post' && pathname === '/auth/demo-login') {
    return { data: { access_token: DEMO_ACCESS_TOKEN } }
  }
  if (method === 'post' && pathname === '/auth/token/refresh') {
    return { data: { access_token: DEMO_ACCESS_TOKEN } }
  }
  if (method === 'post' && pathname === '/auth/logout') return { status: 204 }
  if (method === 'delete' && pathname === '/auth/withdraw')
    return { status: 204 }

  if (method === 'get' && pathname === '/users') {
    return isAuthorized(config) ? { data: { ...demoDb.user } } : unauthorized()
  }
  if (method === 'get' && pathname === '/users/bookmarks') {
    if (!isAuthorized(config)) return unauthorized()
    const items = demoDb.places
      .filter((place) => demoDb.bookmarkedPlaceIds.has(place.id))
      .map((place) => ({
        place_id: place.id,
        place_name: place.place_name,
        description: place.description ?? '',
        image_url: place.image_url ?? '',
        rating: place.rating_avg,
        created_at: '2026-08-01T09:00:00Z',
      }))
    return { data: pageItems(items, config) }
  }
  if (method === 'get' && pathname === '/users/reviews') {
    if (!isAuthorized(config)) return unauthorized()
    const reviews =
      scenario === 'empty' ? [] : (reviewsByUserId[demoDb.user.id] ?? [])
    return scenario === 'error'
      ? { status: 503, data: { detail: 'Demo review error.' } }
      : { data: pageItems(reviews, config) }
  }
  if (method === 'get' && pathname === '/users/quiz/result') {
    return isAuthorized(config)
      ? {
          data: {
            ...demoQuizResult,
            updated_at: '2026-08-01T09:00:00Z',
          },
        }
      : unauthorized()
  }

  const publicReviewsMatch = pathname.match(/^\/users\/(\d+)\/reviews$/)
  if (method === 'get' && publicReviewsMatch) {
    const userId = Number(publicReviewsMatch[1])
    return demoDb.users[userId]
      ? { data: pageItems(reviewsByUserId[userId] ?? [], config) }
      : { status: 404, data: { detail: 'User not found.' } }
  }
  const userRoutesMatch = pathname.match(/^\/users\/([^/]+)\/routes$/)
  if (method === 'get' && userRoutesMatch) {
    return isAuthorized(config) &&
      decodeURIComponent(userRoutesMatch[1]) === demoDb.user.nickname
      ? { data: pageItems(demoMyRoutes, config) }
      : { status: 403, data: { detail: 'Not allowed.' } }
  }
  const publicUserMatch = pathname.match(/^\/users\/(\d+)$/)
  if (method === 'get' && publicUserMatch) {
    const user = demoDb.users[Number(publicUserMatch[1])]
    if (!user) return { status: 404, data: { detail: 'User not found.' } }
    // Public profiles intentionally omit private/account-only fields.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email: _email, bookmark_count: _bookmarkCount, ...profile } = user
    return {
      data: {
        ...profile,
        travel_type_name:
          Number(publicUserMatch[1]) % 2 === 0 ? '감성 탐험가' : '도시 산책가',
        is_following: Number(publicUserMatch[1]) === 2,
      },
    }
  }

  if (method === 'get' && pathname === '/places') {
    return scenario === 'error'
      ? { status: 503, data: { detail: 'Demo places error.' } }
      : {
          data:
            scenario === 'empty'
              ? { count: 0, next: null, previous: null, results: [] }
              : placeMockRepository.getPlaces(query),
        }
  }
  if (method === 'get' && pathname === '/places/search') {
    return { data: placeMockRepository.searchPlaces(query) }
  }
  if (method === 'get' && pathname === '/places/filter') {
    return scenario === 'error'
      ? { status: 503, data: { detail: 'Demo places error.' } }
      : {
          data:
            scenario === 'empty'
              ? { count: 0, next: null, previous: null, results: [] }
              : placeMockRepository.filterPlaces(query),
        }
  }
  if (method === 'get' && pathname === '/places/recommend') {
    return { data: placeMockRepository.recommendPlaces(query) }
  }
  if (method === 'get' && pathname === '/tags/') return { data: demoTags }

  const reviewsMatch = pathname.match(/^\/places\/(\d+)\/reviews$/)
  if (method === 'get' && reviewsMatch) {
    if (scenario === 'error') {
      return { status: 503, data: { detail: 'Demo review error.' } }
    }
    const reviews =
      scenario === 'empty'
        ? []
        : (demoDb.reviewsByPlaceId[Number(reviewsMatch[1])] ?? [])
    const data = pageItems(reviews, config, 4)
    const average = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0
    return { data: { ...data, avg_rating: Number(average.toFixed(1)) } }
  }

  const bookmarkMatch = pathname.match(/^\/places\/(\d+)\/bookmarks\/$/)
  if (bookmarkMatch && (method === 'post' || method === 'delete')) {
    if (scenario === 'bookmark-error') {
      return { status: 503, data: { detail: 'Demo bookmark error.' } }
    }
    if (!isAuthorized(config)) return unauthorized()
    const placeId = Number(bookmarkMatch[1])
    if (method === 'post' && demoDb.bookmarkedPlaceIds.has(placeId)) {
      return { status: 409, data: { detail: 'Already bookmarked.' } }
    }
    return setBookmark(placeId, method === 'post')
      ? { status: 204 }
      : { status: 404, data: { detail: 'Place not found.' } }
  }

  const placeMatch = pathname.match(/^\/places\/(\d+)$/)
  if (method === 'get' && placeMatch) {
    const detail = placeMockRepository.getPlace(placeMatch[1])
    return detail
      ? { data: { ...detail } }
      : { status: 404, data: { detail: 'Place not found.' } }
  }

  if (method === 'post' && pathname === '/quiz/submit') {
    return { data: demoQuizResult }
  }
  if (method === 'get' && pathname === '/quiz/result/shared') {
    return { data: demoQuizResult }
  }

  if (method === 'get' && pathname === '/routes') {
    const regionTagId = Number(query.region_tag_id) || null
    const themeTagIds = (
      Array.isArray(query.theme_tag_ids)
        ? query.theme_tag_ids
        : query.theme_tag_ids === undefined
          ? []
          : [query.theme_tag_ids]
    )
      .map(Number)
      .filter(Number.isFinite)
    const taxonomy: Record<number, { region: number; themes: number[] }> = {
      501: { region: 48, themes: [1, 2, 15] },
      502: { region: 32, themes: [3, 4, 17] },
      503: { region: 47, themes: [1, 5] },
    }
    const routes = demoRouteList.filter((route) => {
      const tags = taxonomy[route.route_id]
      return (
        (!regionTagId || tags.region === regionTagId) &&
        (themeTagIds.length === 0 ||
          themeTagIds.every((tagId) => tags.themes.includes(tagId)))
      )
    })
    return { data: pageItems(routes, config, 9) }
  }
  const routeMatch = pathname.match(/^\/routes\/(\d+)$/)
  if (method === 'get' && routeMatch) {
    const route = demoRouteDetails[Number(routeMatch[1])]
    return route
      ? { data: route }
      : { status: 404, data: { detail: 'Route not found.' } }
  }

  return {
    status: 501,
    data: {
      detail: `No mock repository implementation for ${method.toUpperCase()} ${pathname}`,
    },
  }
}

export const mockApiAdapter: AxiosAdapter = async (config) => {
  const result = dispatch(config)
  const status = result.status ?? 200
  const response: AxiosResponse = {
    data: result.data ?? null,
    status,
    statusText: String(status),
    headers: {},
    config,
  }

  if (status >= 400) {
    throw new AxiosError(
      `Mock request failed with status ${status}`,
      AxiosError.ERR_BAD_RESPONSE,
      config,
      undefined,
      response
    )
  }

  return response
}

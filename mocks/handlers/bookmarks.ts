import { delay, http, HttpResponse } from 'msw'
import { DEMO_ACCESS_TOKEN, demoDb, setBookmark } from '../db'

const isAuthorized = (request: Request) =>
  request.headers.get('authorization') === `Bearer ${DEMO_ACCESS_TOKEN}`

const requireAuth = (request: Request) =>
  isAuthorized(request)
    ? null
    : HttpResponse.json({ detail: 'Authentication required.' }, { status: 401 })

export const bookmarkHandlers = [
  http.get('*/users/bookmarks', async ({ request }) => {
    await delay(220)
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
    const pageSize = Math.max(1, Number(url.searchParams.get('page_size')) || 8)
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
    const start = (page - 1) * pageSize
    return HttpResponse.json({
      count: items.length,
      next:
        start + pageSize < items.length
          ? `${url.origin}${url.pathname}?page=${page + 1}&page_size=${pageSize}`
          : null,
      previous:
        page > 1
          ? `${url.origin}${url.pathname}?page=${page - 1}&page_size=${pageSize}`
          : null,
      results: items.slice(start, start + pageSize),
    })
  }),
  http.post('*/places/:placeId/bookmarks/', async ({ params, request }) => {
    await delay(180)
    if (request.headers.get('x-demo-scenario') === 'bookmark-error') {
      return HttpResponse.json(
        { detail: 'Demo bookmark error.' },
        { status: 503 }
      )
    }
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    const placeId = Number(params.placeId)
    if (demoDb.bookmarkedPlaceIds.has(placeId)) {
      return HttpResponse.json(
        { detail: 'Already bookmarked.' },
        { status: 409 }
      )
    }
    return setBookmark(placeId, true)
      ? new HttpResponse(null, { status: 204 })
      : HttpResponse.json({ detail: 'Place not found.' }, { status: 404 })
  }),
  http.delete('*/places/:placeId/bookmarks/', async ({ params, request }) => {
    await delay(180)
    if (request.headers.get('x-demo-scenario') === 'bookmark-error') {
      return HttpResponse.json(
        { detail: 'Demo bookmark error.' },
        { status: 503 }
      )
    }
    const unauthorized = requireAuth(request)
    if (unauthorized) return unauthorized
    const placeId = Number(params.placeId)
    return setBookmark(placeId, false)
      ? new HttpResponse(null, { status: 204 })
      : HttpResponse.json({ detail: 'Place not found.' }, { status: 404 })
  }),
]

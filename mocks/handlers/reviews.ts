import { delay, http, HttpResponse } from 'msw'
import { demoDb } from '../db'

export const reviewHandlers = [
  http.get('*/places/:placeId/reviews', async ({ params, request }) => {
    await delay(320)
    const url = new URL(request.url)
    if (
      url.searchParams.get('scenario') === 'error' ||
      request.headers.get('x-demo-scenario') === 'error'
    ) {
      return HttpResponse.json(
        { detail: 'Demo review error.' },
        { status: 503 }
      )
    }
    const reviews =
      request.headers.get('x-demo-scenario') === 'empty'
        ? []
        : (demoDb.reviewsByPlaceId[Number(params.placeId)] ?? [])
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
    const pageSize = Math.max(1, Number(url.searchParams.get('page_size')) || 4)
    const start = (page - 1) * pageSize
    const average = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0
    const pageUrl = (target: number) => {
      const search = new URLSearchParams(url.searchParams)
      search.set('page', String(target))
      search.set('page_size', String(pageSize))
      return `${url.origin}${url.pathname}?${search.toString()}`
    }
    return HttpResponse.json({
      count: reviews.length,
      avg_rating: Number(average.toFixed(1)),
      next: start + pageSize < reviews.length ? pageUrl(page + 1) : null,
      previous: page > 1 ? pageUrl(page - 1) : null,
      results: reviews.slice(start, start + pageSize),
    })
  }),
]

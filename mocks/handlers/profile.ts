import { delay, http, HttpResponse } from 'msw'
import { DEMO_ACCESS_TOKEN, demoDb } from '../db'
import { demoMyRoutes, reviewsByUserId } from '../data/profileData'
import { demoQuizResult } from '../data/quizData'

const authorized = (request: Request) =>
  request.headers.get('authorization') === `Bearer ${DEMO_ACCESS_TOKEN}`

function pageItems<T>(items: T[], request: Request, fallbackSize = 8) {
  const url = new URL(request.url)
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
  const size = Math.max(
    1,
    Number(url.searchParams.get('page_size')) || fallbackSize
  )
  const start = (page - 1) * size
  return {
    count: items.length,
    next:
      start + size < items.length
        ? `${url.origin}${url.pathname}?page=${page + 1}&page_size=${size}`
        : null,
    previous:
      page > 1
        ? `${url.origin}${url.pathname}?page=${page - 1}&page_size=${size}`
        : null,
    results: items.slice(start, start + size),
  }
}

export const profileHandlers = [
  http.get('*/users/reviews', async ({ request }) => {
    await delay(200)
    if (!authorized(request))
      return HttpResponse.json(
        { detail: 'Authentication required.' },
        { status: 401 }
      )
    const scenario = request.headers.get('x-demo-scenario')
    if (scenario === 'error') {
      return HttpResponse.json(
        { detail: 'Demo review error.' },
        { status: 503 }
      )
    }
    const reviews =
      scenario === 'empty' ? [] : (reviewsByUserId[demoDb.user.id] ?? [])
    return HttpResponse.json(pageItems(reviews, request))
  }),
  http.get('*/users/:userId/reviews', async ({ params, request }) => {
    await delay(200)
    const userId = Number(params.userId)
    if (!demoDb.users[userId])
      return HttpResponse.json({ detail: 'User not found.' }, { status: 404 })
    return HttpResponse.json(pageItems(reviewsByUserId[userId] ?? [], request))
  }),
  http.get('*/users/:nickname/routes', async ({ params, request }) => {
    await delay(200)
    if (!authorized(request) || params.nickname !== demoDb.user.nickname) {
      return HttpResponse.json({ detail: 'Not allowed.' }, { status: 403 })
    }
    return HttpResponse.json(pageItems(demoMyRoutes, request))
  }),
  http.get('*/users/quiz/result', async ({ request }) => {
    await delay(180)
    if (!authorized(request))
      return HttpResponse.json(
        { detail: 'Authentication required.' },
        { status: 401 }
      )
    return HttpResponse.json({
      type_key: demoQuizResult.type_key,
      name: demoQuizResult.name,
      description: demoQuizResult.description,
      image_url: demoQuizResult.image_url,
      type_tags: demoQuizResult.type_tags,
      result_vector: demoQuizResult.result_vector,
      accuracy: demoQuizResult.accuracy,
      destinations: demoQuizResult.destinations,
      updated_at: '2026-08-01T09:00:00Z',
    })
  }),
]

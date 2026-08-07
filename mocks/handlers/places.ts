import { delay, http, HttpResponse } from 'msw'
import type { Place } from '@/types/place.types'
import { demoDb } from '../db'
import { demoTags } from '../data/demoData'

function paginate<T>(items: T[], request: Request, defaultPageSize = 12) {
  const url = new URL(request.url)
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
  const pageSize = Math.max(
    1,
    Number(url.searchParams.get('page_size')) || defaultPageSize
  )
  const start = (page - 1) * pageSize
  const originPath = `${url.origin}${url.pathname}`
  const pageUrl = (target: number) => {
    const params = new URLSearchParams(url.searchParams)
    params.set('page', String(target))
    params.set('page_size', String(pageSize))
    return `${originPath}?${params.toString()}`
  }
  return {
    count: items.length,
    next: start + pageSize < items.length ? pageUrl(page + 1) : null,
    previous: page > 1 ? pageUrl(page - 1) : null,
    results: items.slice(start, start + pageSize),
  }
}

const searchableText = (place: Place) =>
  [
    place.place_name,
    place.description,
    ...place.tags.map((tag) => tag.tag_name),
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase('ko')

function filterAndSort(request: Request, forceSearch = false) {
  const url = new URL(request.url)
  const keyword = (url.searchParams.get('keyword') ?? '')
    .trim()
    .toLocaleLowerCase('ko')
  const tagIds = url.searchParams
    .getAll('tags')
    .flatMap((value) => value.split(',').map(Number).filter(Number.isFinite))
  let items = demoDb.places.filter((place) => {
    const keywordMatches = !keyword || searchableText(place).includes(keyword)
    const tagsMatch =
      tagIds.length === 0 ||
      tagIds.every((id) => place.tags.some((tag) => tag.id === id))
    return keywordMatches && (forceSearch ? true : tagsMatch)
  })

  const sort = url.searchParams.get('sort')
  const direction = url.searchParams.get('order') === 'asc' ? 1 : -1
  items = [...items].sort((a, b) => {
    const aValue =
      sort === 'bookmark'
        ? a.bookmark_count
        : sort === 'review'
          ? (a.review_count ?? 0)
          : a.rating_avg
    const bValue =
      sort === 'bookmark'
        ? b.bookmark_count
        : sort === 'review'
          ? (b.review_count ?? 0)
          : b.rating_avg
    return (aValue - bValue) * direction
  })
  return items
}

export const placeHandlers = [
  http.get('*/places', async ({ request }) => {
    await delay(300)
    if (request.headers.get('x-demo-scenario') === 'error') {
      return HttpResponse.json(
        { detail: 'Demo places error.' },
        { status: 503 }
      )
    }
    if (request.headers.get('x-demo-scenario') === 'empty') {
      return HttpResponse.json({
        count: 0,
        next: null,
        previous: null,
        results: [],
      })
    }
    return HttpResponse.json(paginate(demoDb.places, request))
  }),
  http.get('*/places/search', async ({ request }) => {
    await delay(300)
    return HttpResponse.json(paginate(filterAndSort(request, true), request))
  }),
  http.get('*/places/filter', async ({ request }) => {
    await delay(300)
    if (request.headers.get('x-demo-scenario') === 'error') {
      return HttpResponse.json(
        { detail: 'Demo places error.' },
        { status: 503 }
      )
    }
    if (request.headers.get('x-demo-scenario') === 'empty') {
      return HttpResponse.json({
        count: 0,
        next: null,
        previous: null,
        results: [],
      })
    }
    return HttpResponse.json(paginate(filterAndSort(request), request))
  }),
  http.get('*/places/recommend', async ({ request }) => {
    await delay(300)
    return HttpResponse.json(paginate(filterAndSort(request), request))
  }),
  http.get('*/places/:placeId', async ({ params }) => {
    await delay(220)
    const detail = demoDb.placeDetails[Number(params.placeId)]
    return detail
      ? HttpResponse.json({ ...detail })
      : HttpResponse.json({ detail: 'Place not found.' }, { status: 404 })
  }),
  http.get('*/tags/', async () => {
    return HttpResponse.json(demoTags)
  }),
]

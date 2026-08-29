import { delay, http, HttpResponse } from 'msw'
import type {
  GetPlacesFilterParams,
  GetPlacesRecommendParams,
} from '@/types/place.types'
import { demoTags } from '../data/demoData'
import { placeMockRepository } from '../repositories/placeMockRepository'

function requestParams(request: Request): GetPlacesFilterParams {
  const url = new URL(request.url)
  return {
    keyword: url.searchParams.get('keyword') ?? undefined,
    tags: url.searchParams
      .getAll('tags')
      .flatMap((value) => value.split(',').map(Number).filter(Number.isFinite)),
    sort: (url.searchParams.get('sort') ??
      undefined) as GetPlacesFilterParams['sort'],
    order: (url.searchParams.get('order') ??
      undefined) as GetPlacesFilterParams['order'],
    page: Number(url.searchParams.get('page')) || undefined,
    page_size: Number(url.searchParams.get('page_size')) || undefined,
  }
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
    return HttpResponse.json(
      placeMockRepository.getPlaces(requestParams(request))
    )
  }),
  http.get('*/places/search', async ({ request }) => {
    await delay(300)
    return HttpResponse.json(
      placeMockRepository.searchPlaces(requestParams(request))
    )
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
    return HttpResponse.json(
      placeMockRepository.filterPlaces(requestParams(request))
    )
  }),
  http.get('*/places/recommend', async ({ request }) => {
    await delay(300)
    return HttpResponse.json(
      placeMockRepository.recommendPlaces(
        requestParams(request) as GetPlacesRecommendParams
      )
    )
  }),
  http.get('*/places/:placeId', async ({ params }) => {
    await delay(220)
    const detail = placeMockRepository.getPlace(String(params.placeId))
    return detail
      ? HttpResponse.json({ ...detail })
      : HttpResponse.json({ detail: 'Place not found.' }, { status: 404 })
  }),
  http.get('*/tags/', async () => {
    return HttpResponse.json(demoTags)
  }),
]

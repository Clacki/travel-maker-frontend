import type { Place } from '@/types/place.types'
import type {
  GetPlacesFilterParams,
  GetPlacesParams,
  GetPlacesRecommendParams,
  GetPlacesSearchParams,
  PlacesResponse,
} from '@/types/place.types'
import type { TravelDetail } from '@/features/travel/detail/types/travelDetail.types'
import { demoDb } from '../db'

type PlaceQuery =
  | GetPlacesParams
  | GetPlacesFilterParams
  | GetPlacesSearchParams
  | GetPlacesRecommendParams

const searchableText = (place: Place) =>
  [
    place.place_name,
    place.description,
    ...place.tags.map((tag) => tag.tag_name),
  ]
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase('ko')

function getTagIds(params: PlaceQuery) {
  const tags = 'tags' in params ? params.tags : undefined
  if (Array.isArray(tags)) return tags.map(Number).filter(Number.isFinite)
  return tags === undefined ? [] : [Number(tags)].filter(Number.isFinite)
}

function filterAndSort(params: PlaceQuery, ignoreTags = false) {
  const keyword = String('keyword' in params ? (params.keyword ?? '') : '')
    .trim()
    .toLocaleLowerCase('ko')
  const tagIds = getTagIds(params)
  let items = demoDb.places.filter((place) => {
    const keywordMatches = !keyword || searchableText(place).includes(keyword)
    const tagsMatch =
      ignoreTags ||
      tagIds.length === 0 ||
      tagIds.every((id) => place.tags.some((tag) => tag.id === id))
    return keywordMatches && tagsMatch
  })

  const sort = 'sort' in params ? params.sort : undefined
  const direction = 'order' in params && params.order === 'asc' ? 1 : -1
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

function paginate(items: Place[], params: PlaceQuery): PlacesResponse {
  const page = Math.max(1, Number(params.page) || 1)
  const pageSize = Math.max(1, Number(params.page_size) || 12)
  const start = (page - 1) * pageSize
  return {
    count: items.length,
    next: start + pageSize < items.length ? String(page + 1) : null,
    previous: page > 1 ? String(page - 1) : null,
    results: items.slice(start, start + pageSize),
  }
}

export const placeMockRepository = {
  getPlaces(params: GetPlacesParams = {}) {
    return paginate([...demoDb.places], params)
  },
  searchPlaces(params: GetPlacesSearchParams = {}) {
    return paginate(filterAndSort(params, true), params)
  },
  filterPlaces(params: GetPlacesFilterParams = {}) {
    return paginate(filterAndSort(params), params)
  },
  recommendPlaces(params: GetPlacesRecommendParams = {}) {
    return paginate(filterAndSort(params), params)
  },
  getPlace(id: string | number): TravelDetail | null {
    return demoDb.placeDetails[Number(id)] ?? null
  },
}

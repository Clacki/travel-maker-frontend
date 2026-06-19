import api from '@/lib/api'
import type { RouteListItem } from '../types/trip'
import type {
  CreateRouteRequest,
  CreateRouteResponse,
  PatchRouteRequest,
  PatchRouteResponse,
  RouteListParams,
  RouteListResult,
  RouteDetail,
} from '../types/route.types'

export type {
  CreateRouteRequest,
  CreateRouteResponse,
  PatchRouteRequest,
  PatchRouteResponse,
  RouteListParams,
  RouteListResult,
  RouteDetail,
}

const serializeParams = (p: Record<string, unknown>): string => {
  const parts: string[] = []
  for (const [key, value] of Object.entries(p)) {
    if (value === undefined || value === null) {
      continue
    }
    if (Array.isArray(value)) {
      value.forEach((v) => parts.push(`${key}=${encodeURIComponent(v)}`))
    } else {
      parts.push(`${key}=${encodeURIComponent(String(value))}`)
    }
  }
  return parts.join('&')
}

type PaginatedRouteList = {
  count: number
  next: string | null
  previous: string | null
  results: RouteListItem[]
}

export const postRoute = async (
  payload: CreateRouteRequest
): Promise<CreateRouteResponse> => {
  const response = await api.post<CreateRouteResponse>('/routes', payload)
  return response.data
}

export const getRoutes = async (
  params?: RouteListParams
): Promise<RouteListResult> => {
  const response = await api.get<PaginatedRouteList | RouteListItem[]>(
    '/routes',
    { params, paramsSerializer: serializeParams }
  )
  const data = response.data

  // API는 배열로 반환되는 경우도 방어적으로 처리한다.
  if (Array.isArray(data)) {
    return { items: data, totalCount: data.length }
  }

  return { items: data.results, totalCount: data.count }
}

export const getRouteDetail = async (routeId: number): Promise<RouteDetail> => {
  const response = await api.get<RouteDetail>(`/routes/${routeId}`)
  return response.data
}

export const patchRoute = async (
  routeId: number,
  payload: PatchRouteRequest
): Promise<PatchRouteResponse> => {
  const response = await api.patch<PatchRouteResponse>(
    `/routes/${routeId}`,
    payload
  )
  return response.data
}

export const deleteRoute = async (routeId: number): Promise<void> => {
  await api.delete(`/routes/${routeId}`)
}

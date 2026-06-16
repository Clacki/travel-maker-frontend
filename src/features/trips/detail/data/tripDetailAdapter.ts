import type { RouteDetail } from '@/features/trips/types/route.types'
import type { TripCourseDetail, TripDurationType } from '../types/tripDetail'

const FALLBACK_IMAGE = '/images/bg_Theme/travel-bg.webp'

function getDurationType(
  startDate: string,
  endDate: string
): { durationType: TripDurationType; durationLabel: string } {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const nights = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  )

  const map: Record<
    number,
    { durationType: TripDurationType; durationLabel: string }
  > = {
    0: { durationType: 'same-day', durationLabel: '당일치기' },
    1: { durationType: '1-night-2-days', durationLabel: '1박 2일' },
    2: { durationType: '2-nights-3-days', durationLabel: '2박 3일' },
    3: { durationType: '3-nights-4-days', durationLabel: '3박 4일' },
    4: { durationType: '4-nights-5-days', durationLabel: '4박 5일' },
  }

  return map[nights] ?? { durationType: 'same-day', durationLabel: '당일치기' }
}

export function toTripCourseDetail(
  route: RouteDetail,
  currentUserId?: number
): TripCourseDetail {
  const { durationType, durationLabel } = getDurationType(
    route.start_date,
    route.end_date
  )

  const thumbnailUrl = route.days[0]?.places[0]?.image_url ?? FALLBACK_IMAGE

  const days = route.days.map((d) => ({
    day: d.day_index,
    places: d.places.map((p) => ({
      id: p.place_id,
      order: p.order,
      name: p.place_name,
      category: p.description,
      address: [p.address_primary, p.address_detail].filter(Boolean).join(' '),
      latitude: p.latitude,
      longitude: p.longitude,
      imageUrl: p.image_url ?? undefined,
    })),
  }))

  return {
    id: route.route_id,
    title: route.title,
    description: route.description ?? '',
    region: route.region_tag ?? '',
    durationType,
    durationLabel,
    tags: route.theme_tags,
    thumbnailUrl,
    author: { id: route.user_id, nickname: route.user_nickname },
    createdAt: route.created_at.slice(0, 10),
    isOwner: currentUserId !== undefined && currentUserId === route.user_id,
    isPublic: true,
    days,
    similarCourses: [],
  }
}

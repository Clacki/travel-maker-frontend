import type { MyReviewItem } from '@/features/mypage/api/myReviewsApi'
import type { MyRouteItem } from '@/features/mypage/api/myTripsApi'
import { DEMO_PLACE_IMAGES } from './imageData'
import { demoRouteList } from './routeData'

export const reviewsByUserId: Record<number, MyReviewItem[]> = {
  1: [
    {
      review_id: 9001,
      place_id: 1,
      place_name: '성산일출봉',
      rating: 5,
      content: '새벽 풍경이 오래 기억에 남아요.',
      image_url: DEMO_PLACE_IMAGES[1],
      created_at: '2026-07-20T09:00:00Z',
      updated_at: '2026-07-20T09:00:00Z',
    },
    {
      review_id: 9002,
      place_id: 4,
      place_name: '전주 한옥마을',
      rating: 4,
      content: '골목마다 볼거리가 많았습니다.',
      image_url: DEMO_PLACE_IMAGES[4],
      created_at: '2026-07-18T09:00:00Z',
      updated_at: '2026-07-18T09:00:00Z',
    },
    {
      review_id: 9003,
      place_id: 12,
      place_name: '순천만 국가정원',
      rating: 5,
      content: '천천히 걷기 좋은 정원이었어요.',
      image_url: DEMO_PLACE_IMAGES[12],
      created_at: '2026-07-12T09:00:00Z',
      updated_at: '2026-07-12T09:00:00Z',
    },
  ],
  2: [
    {
      review_id: 9201,
      place_id: 3,
      place_name: '해운대',
      rating: 5,
      content: '아침 바다가 특히 좋았습니다.',
      image_url: null,
      created_at: '2026-07-22T09:00:00Z',
      updated_at: '2026-07-22T09:00:00Z',
    },
    {
      review_id: 9202,
      place_id: 8,
      place_name: '광안리',
      rating: 4,
      content: '야경 산책 코스로 추천해요.',
      image_url: null,
      created_at: '2026-07-16T09:00:00Z',
      updated_at: '2026-07-16T09:00:00Z',
    },
  ],
  3: [
    {
      review_id: 9301,
      place_id: 9,
      place_name: '북촌 한옥마을',
      rating: 4,
      content: '조용한 골목을 찾아 걷는 재미가 있어요.',
      image_url: null,
      created_at: '2026-07-14T09:00:00Z',
      updated_at: '2026-07-14T09:00:00Z',
    },
  ],
  4: [
    {
      review_id: 9401,
      place_id: 7,
      place_name: '담양 죽녹원',
      rating: 5,
      content: '대숲 바람 소리가 편안했습니다.',
      image_url: null,
      created_at: '2026-07-10T09:00:00Z',
      updated_at: '2026-07-10T09:00:00Z',
    },
  ],
}

export const demoMyRoutes: MyRouteItem[] = [
  ...demoRouteList.slice(0, 2).map((route, index) => ({
    route_id: route.route_id,
    title: route.title,
    description: route.description,
    image_url: route.image_url,
    place_count: route.place_count,
    like_count: index === 0 ? 18 : 12,
    created_at: route.created_at,
    updated_at: route.created_at,
  })),
]

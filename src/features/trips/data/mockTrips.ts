import type { Trip } from '../types/trips.types'

export const mockTrips: Trip[] = [
  {
    id: 'jeju-weekend',
    title: '제주 주말 코스',
    description: '제주 동쪽을 가볍게 둘러보는 2박 3일 여행 코스',
    ownerId: 'me',
    region: '제주',
    startDate: '2026-07-10',
    endDate: '2026-07-12',
    visibility: 'public',
    places: [
      {
        id: 'seongsan-ilchulbong',
        name: '성산일출봉',
        address: '제주특별자치도 서귀포시 성산읍',
        order: 1,
        lat: 33.4589,
        lng: 126.9426,
      },
      {
        id: 'woljeongri',
        name: '월정리해변',
        address: '제주특별자치도 제주시 구좌읍',
        order: 2,
        lat: 33.5584,
        lng: 126.7956,
      },
    ],
    createdAt: '2026-06-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
  },
]

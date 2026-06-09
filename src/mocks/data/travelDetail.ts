import type { TravelDetail } from '@/features/travel/detail/types/travelDetail.types'

export const travelDetailMock: TravelDetail = {
  id: 1,
  place_name: '양양 서피비치',
  description:
    '동해안 대표 서핑 명소. 깨끗한 모래사장과 파도가 어우러진 양양 서피비치는 서퍼들의 성지로 불리며, 초보부터 전문가까지 즐길 수 있는 다양한 서핑 프로그램을 운영합니다.',
  latitude: 38.2074,
  longitude: 128.618,
  rating_avg: 4.8,
  review_count: 1201,
  bookmark_count: 342,
  images: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1455729552865-3658a5d39692?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=300&h=200&fit=crop',
  ],
  tags: [
    { id: 1, tag_name: '서핑' },
    { id: 2, tag_name: '해변' },
    { id: 3, tag_name: '힐링' },
    { id: 4, tag_name: '자연' },
    { id: 5, tag_name: '액티비티' },
  ],
}

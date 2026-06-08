import type { TravelDetail } from '@/features/travel/detail/types/travelDetail.types'

export const travelDetailMock: TravelDetail = {
  id: 'yangyang-surfbeach',
  title: '양양 서피비치',
  region: '강원도',
  subRegion: '양양군',
  images: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1455729552865-3658a5d39692?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=300&h=200&fit=crop',
  ],
  rating: 4.8,
  reviewCount: 1201,
  tags: ['서핑', '해변', '힐링', '자연', '액티비티'],
  description:
    '동해안 대표 서핑 명소. 깨끗한 모래사장과 파도가 어우러진 양양 서피비치는 서퍼들의 성지로 불리며, 초보부터 전문가까지 즐길 수 있는 다양한 서핑 프로그램을 운영합니다.',
  infoItems: [
    { label: '위치', value: '강원도 양양군 현북면' },
    { label: '운영', value: '연중무휴 (기상 상황에 따라 변동)' },
    { label: '입장료', value: '무료 (서핑 강습 별도)' },
    { label: '주차', value: '유료 주차장 운영' },
  ],
  latitude: 38.2074,
  longitude: 128.618,
  reviews: [
    {
      id: 1,
      author: { name: '파도타는 호랑이' },
      rating: 5,
      createdAt: '2026-05-20',
      content:
        '파도가 정말 좋았어요! 서핑 초보인데 강사님이 친절하게 가르쳐 주셔서 금방 탈 수 있었습니다. 꼭 다시 오고 싶네요.',
    },
    {
      id: 2,
      author: { name: '여름바다' },
      rating: 4,
      createdAt: '2026-05-15',
      content:
        '주말이라 사람이 많았지만 그래도 충분히 즐길 수 있었어요. 해변도 깨끗하고 주변 식당도 맛있었습니다.',
    },
    {
      id: 3,
      author: { name: '서울에서온여행객' },
      rating: 5,
      createdAt: '2026-05-10',
      content:
        '서울에서 2시간 거리인데 이런 멋진 곳이 있다니! 물이 맑고 파도도 적당해서 가족끼리 오기도 좋아요.',
    },
  ],
}

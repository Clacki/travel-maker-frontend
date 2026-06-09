import type { TripCourseDetail } from '../types/tripDetail'

export const tripDetailMock: TripCourseDetail = {
  id: 1,
  title: '강릉 감성 카페 코스',
  description:
    '바다와 카페를 함께 둘러보는 자유로운 강릉 당일치기 여행 코스입니다. 걷기 좋은 해변과 사진 찍기 좋은 카페를 중심으로 구성했어요.',
  region: '강릉',
  durationType: 'same-day',
  durationLabel: '당일치기',
  tags: ['카페투어', '바다산책', '사진맛집'],
  thumbnailUrl: '/images/bg_Theme/bg-beach.svg',
  author: {
    id: 11,
    nickname: '강릉여행자',
  },
  createdAt: '2026.06.08',
  viewCount: 1240,
  likeCount: 86,
  bookmarkCount: 128,
  isOwner: true,
  isPublic: true,
  days: [
    {
      day: 1,
      title: '강릉역과 바다 산책',
      places: [
        {
          id: 101,
          order: 1,
          name: '강릉역',
          category: '교통',
          address: '강원 강릉시 용지로 176',
          latitude: 37.7646,
          longitude: 128.8994,
          stayTime: '20분',
          memo: '여행의 시작점으로 잡기 좋은 위치입니다.',
          imageUrl: '/images/bg_Theme/bg-city.svg',
        },
        {
          id: 102,
          order: 2,
          name: '안목해변',
          category: '바다',
          address: '강원 강릉시 창해로14번길 20-1',
          latitude: 37.7714,
          longitude: 128.9482,
          stayTime: '1시간',
          memo: '바다를 보며 가볍게 산책하기 좋은 장소입니다.',
          imageUrl: '/images/bg_Theme/travel-bg.webp',
        },
        {
          id: 103,
          order: 3,
          name: '바다뷰 감성 카페',
          category: '카페',
          address: '강원 강릉시 창해로 14',
          latitude: 37.7722,
          longitude: 128.9491,
          stayTime: '1시간 20분',
          memo: '코스 중간에 쉬어가기 좋은 카페입니다.',
          imageUrl: '/images/bg_Theme/bg-beach.svg',
        },
        {
          id: 104,
          order: 4,
          name: '중앙시장',
          category: '맛집',
          address: '강원 강릉시 금성로 21',
          latitude: 37.7541,
          longitude: 128.8976,
          stayTime: '1시간',
          memo: '간단한 먹거리와 로컬 분위기를 즐길 수 있습니다.',
          imageUrl: '/images/bg_Theme/bg-food.svg',
        },
        {
          id: 105,
          order: 5,
          name: '경포호 산책길',
          category: '산책',
          address: '강원 강릉시 저동',
          latitude: 37.7977,
          longitude: 128.9058,
          stayTime: '50분',
          memo: '코스의 마무리로 여유롭게 걷기 좋은 장소입니다.',
          imageUrl: '/images/bg_Theme/bg-mountain.svg',
        },
      ],
    },
  ],
  similarCourses: [
    {
      id: 4,
      title: '속초 바다 카페 투어',
      region: '속초',
      thumbnailUrl: '/images/bg_Theme/bg-food.svg',
    },
    {
      id: 8,
      title: '양양 서핑 & 카페',
      region: '양양',
      thumbnailUrl: '/images/bg_Theme/travel-bg.webp',
    },
    {
      id: 6,
      title: '강릉 풍경산책 코스',
      region: '강릉',
      thumbnailUrl: '/images/bg_Theme/bg-culture.png',
    },
  ],
}

export const findTripDetailById = (tripId: string) => {
  const numericTripId = Number(tripId)

  if (!Number.isInteger(numericTripId) || numericTripId <= 0) {
    return null
  }

  if (tripId === String(tripDetailMock.id)) {
    return tripDetailMock
  }

  return {
    ...tripDetailMock,
    id: numericTripId,
  }
}

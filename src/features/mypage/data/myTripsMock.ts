import type { MyTripCourse } from '../types/mypage'

export const mockMyTripCourses: MyTripCourse[] = [
  {
    routeId: 1,
    title: '제주 2박 3일 힐링 코스',
    description:
      '바다와 자연을 중심으로 여유롭게 둘러보는 제주 여행 코스입니다.',
    imageUrl: '/images/bg_Theme/bg-beach.webp',
    regionName: '제주',
    startDate: '2026-06-20',
    endDate: '2026-06-22',
    dayCount: 3,
    placeCount: 8,
    tags: ['바다', '자연여행', '힐링', '혼자여행'],
    isPublic: true,
  },
  {
    routeId: 2,
    title: '부산 야경 1박 2일 코스',
    description: '광안리와 해운대를 중심으로 밤바다를 즐기는 여행 코스입니다.',
    imageUrl: '/images/bg_Theme/bg-city.webp',
    regionName: '부산',
    startDate: '2026-07-05',
    endDate: '2026-07-06',
    dayCount: 2,
    placeCount: 6,
    tags: ['바다', '야경', '도시여행'],
    isPublic: true,
  },
  {
    routeId: 3,
    title: '서울 북촌 한옥 산책 코스',
    description:
      '북촌과 삼청동의 골목을 따라 가을 풍경을 즐기는 도심 산책 코스입니다.',
    imageUrl: '/images/bg_Theme/bg-culture.webp',
    regionName: '서울',
    startDate: '2026-10-12',
    endDate: '2026-10-13',
    dayCount: 2,
    placeCount: 7,
    tags: ['도시여행', '가을', '사진찍기'],
    isPublic: false,
  },
]

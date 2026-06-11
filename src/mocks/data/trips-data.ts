import type { CoursePlace } from '@/features/trips/types/course.types'

export const mockCoursePlaces: CoursePlace[] = [
  {
    id: '1',
    backendId: 101,
    name: '안목해변 카페거리',
    address: '강원 강릉시 창해로 14번길 20',
    lat: 37.7782,
    lng: 128.9408,
    dayIndex: 1,
  },
  {
    id: '2',
    backendId: 102,
    name: '경포해변',
    address: '강원 강릉시 강문동 산 1',
    lat: 37.8006,
    lng: 128.9064,
    dayIndex: 1,
  },
  {
    id: '3',
    backendId: 103,
    name: '송정 솔숲길',
    address: '강원 강릉시 송정동 일원',
    lat: 37.8142,
    lng: 128.8997,
    dayIndex: 2,
  },
  {
    id: '4',
    backendId: 104,
    name: '주문진 수산물 식당',
    address: '강원 강릉시 주문진읍 해안로 1762',
    lat: 37.9003,
    lng: 128.8195,
    dayIndex: 2,
  },
]

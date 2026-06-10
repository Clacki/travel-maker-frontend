export type CoursePlace = {
  id: string
  name: string
  address: string
  lat?: number
  lng?: number
  dayIndex: number
  stayMinutes?: number
  memo?: string
  transportMode?: 'walk' | 'transit' | 'car'
}

export const REGION_OPTIONS = [
  '제주',
  '부산',
  '강릉',
  '경주',
  '전주',
  '여수',
  '속초',
] as const

export const THEME_OPTIONS = [
  '산악탐험',
  '문화체험',
  '액티비티',
  '해변휴양',
  '도시탐방',
  '미식여행',
  '로맨틱여행',
] as const

export type CourseDateRange = {
  from: Date | undefined
  to: Date | undefined
}

export type DepartureTime = {
  period: 'am' | 'pm'
  hour: number
  minute: number
}

export const MIN_PLACES = 2
export const MAX_PLACES_PER_DAY = 5
export const MAX_TRIP_DAYS = 5

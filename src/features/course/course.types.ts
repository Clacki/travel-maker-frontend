export type CoursePlace = {
  id: string
  name: string
  address: string
}

export const REGION_OPTIONS = ['서울', '부산', '제주', '강릉', '경주'] as const

export const THEME_OPTIONS = [
  '자연',
  '감성',
  '맛집',
  '힐링',
  '가족여행',
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
export const MAX_PLACES = 7

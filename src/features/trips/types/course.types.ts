export type CoursePlace = {
  id: string
  backendId?: number
  name: string
  address: string
  lat?: number
  lng?: number
  dayIndex: number
  category?: string
  stayMinutes?: number
  travelMinutes?: number
  memo?: string
  transportMode?: 'walk' | 'transit' | 'car'
}

// explore 필터 region 섹션 tag_name 기준 (API tag_name과 일치)
export const REGION_OPTIONS = [
  '서울',
  '경기',
  '인천',
  '강원',
  '충북',
  '충남',
  '대전',
  '세종',
  '전북',
  '전남',
  '광주',
  '경북',
  '경남',
  '대구',
  '울산',
  '부산',
  '제주',
] as const

// explore 필터 style(1차) 섹션 CATEGORY_TO_TAG_NAME 기준 (API tag_name과 일치)
export const THEME_OPTIONS = [
  '해변',
  '산악',
  '도시',
  '문화',
  '미식',
  '액티비티',
  '로맨틱',
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
export const MAX_TRIP_DAYS = 3
export const DEFAULT_STAY_MINUTES = 60

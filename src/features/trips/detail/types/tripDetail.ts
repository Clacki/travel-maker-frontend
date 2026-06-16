export type TripDurationType =
  | 'same-day'
  | '1-night-2-days'
  | '2-nights-3-days'
  | '3-nights-4-days'
  | '4-nights-5-days'

export type TripAuthor = {
  id: number
  nickname: string
  profileImageUrl?: string
}

export type TripPlace = {
  id: number
  order: number
  name: string
  category: string
  address: string
  latitude?: number
  longitude?: number
  stayTime?: string
  memo?: string
  imageUrl?: string
}

export type TripDay = {
  day: number
  title?: string
  places: TripPlace[]
}

export type SimilarTripCourse = {
  id: number
  title: string
  region: string
  thumbnailUrl: string
}

export type TripCourseDetail = {
  id: number
  title: string
  description: string
  region: string
  durationType: TripDurationType
  durationLabel: string
  tags: string[]
  thumbnailUrl: string
  author: TripAuthor
  createdAt: string
  isOwner: boolean
  isPublic: boolean
  days: TripDay[]
  similarCourses: SimilarTripCourse[]
}

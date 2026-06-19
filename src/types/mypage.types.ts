export type UserProfile = {
  id: number
  nickname: string
  bio: string
  email: string
  profile_img_url: string
  tags: { id: number; name: string }[]
  follower_count: number
  following_count: number
  bookmark_count: number
  review_count: number
  travel_type_name: string | null
  created_at: string
  updated_at: string
}

export type PublicUserProfile = Omit<
  UserProfile,
  'email' | 'bookmark_count'
> & {
  is_following: boolean
}

export interface UserBookmarkPlace {
  place_id: number
  place_name: string
  description: string
  image_url: string
  rating: number
  created_at: string
}

export interface UserBookmarksResponse {
  count: number
  next: string | null
  previous: string | null
  results: UserBookmarkPlace[]
}

export type ReviewItem = {
  review_id: number
  user_id: number
  user_nickname: string
  rating: number
  content: string
  image_url: string | null
  created_at: string
  updated_at: string
}

export type ReviewListResponse = {
  count: number
  avg_rating: number
  results: ReviewItem[]
}

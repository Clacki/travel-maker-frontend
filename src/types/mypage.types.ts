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

export type PublicUserProfile = Omit<UserProfile, 'email' | 'bookmark_count'>

export type BookmarkItem = {
  place_id: number
  place_name: string
  image_url: string
  rating: number
  created_at: string
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

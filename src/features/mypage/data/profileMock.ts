import type {
  BookmarkItem,
  ReviewItem,
  UserProfile,
} from '@/types/mypage.types'

export const mockMyProfile: UserProfile = {
  id: 1,
  nickname: '김 여행',
  bio: '일 년에 한 번은 꼭 해외 나가야 직성이 풀리는 사람',
  email: 'travel@example.com',
  profile_img_url: '',
  tags: [
    { id: 1, name: '해양다이빙' },
    { id: 2, name: '운전시험' },
    { id: 3, name: '자연여행' },
  ],
  follower_count: 0,
  following_count: 0,
  bookmark_count: 72,
  review_count: 99,
  travel_type_name: null,
  created_at: '2026-01-01T00:00:00',
  updated_at: '2026-01-01T00:00:00',
}

export const mockOtherProfile: UserProfile = {
  id: 2,
  nickname: '김 여행',
  bio: '일 년에 한 번은 꼭 해외 나가야 직성이 풀리는 사람',
  email: 'other@example.com',
  profile_img_url: '',
  tags: [
    { id: 1, name: '해양다이빙' },
    { id: 2, name: '운전시험' },
    { id: 3, name: '자연여행' },
  ],
  follower_count: 0,
  following_count: 0,
  bookmark_count: 72,
  review_count: 99,
  travel_type_name: null,
  created_at: '2026-01-01T00:00:00',
  updated_at: '2026-01-01T00:00:00',
}

export const mockBookmarks: BookmarkItem[] = Array.from(
  { length: 100 },
  (_, i) => ({
    place_id: i + 1,
    place_name: '부산 광안리 야경',
    image_url: '',
    rating: 4.5,
    created_at: '2026-05-22T12:00:00',
  })
)

export const mockReviews: ReviewItem[] = Array.from({ length: 20 }, (_, i) => ({
  review_id: i + 1,
  user_id: 1,
  user_nickname: '김 여행',
  rating: 5,
  content: '유저가 직접 작성한 리뷰입니다. 유저가 직접 작성한 리뷰입니다.',
  image_url: null,
  created_at: '2026-05-22T12:00:00',
  updated_at: '2026-05-22T12:00:00',
}))

export const mockEmptyBookmarks: BookmarkItem[] = []

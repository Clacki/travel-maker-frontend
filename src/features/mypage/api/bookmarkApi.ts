import api from '@/lib/api'
import type { BookmarkItem } from '@/types/mypage.types'

// 북마크 목록 조회
export async function getBookmarks(): Promise<BookmarkItem[]> {
  const response = await api.get<BookmarkItem[]>('/bookmarks/')
  return response.data
}

// 북마크 등록
export async function postBookmark(placeId: number): Promise<void> {
  await api.post(`/places/${placeId}/bookmarks/`)
}

// 북마크 해제
export async function deleteBookmark(placeId: number): Promise<void> {
  await api.delete(`/places/${placeId}/bookmarks/`)
}

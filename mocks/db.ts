import {
  demoPlaceDetails,
  demoPlaces,
  demoReviewsByPlaceId,
  demoUser,
  demoUsers,
} from './data/demoData'

export const DEMO_ACCESS_TOKEN = 'demo-access-token'
export const DEMO_SESSION_STORAGE_KEY = 'travelmaker-demo-session'
export const DEMO_BOOKMARKS_STORAGE_KEY = 'travelmaker-demo-bookmarks'

const initialBookmarks = demoPlaces
  .filter((place) => place.is_bookmarked)
  .map((place) => place.id)

export const demoDb = {
  user: { ...demoUser },
  users: demoUsers,
  places: demoPlaces,
  placeDetails: demoPlaceDetails,
  reviewsByPlaceId: demoReviewsByPlaceId,
  bookmarkedPlaceIds: new Set<number>(initialBookmarks),
  session: {
    isAuthenticated: false,
    accessToken: null as string | null,
  },
}

export function setDemoSession(authenticated: boolean) {
  demoDb.session.isAuthenticated = authenticated
  demoDb.session.accessToken = authenticated ? DEMO_ACCESS_TOKEN : null
}

export function hydrateDemoBookmarks(ids: number[]) {
  demoDb.bookmarkedPlaceIds = new Set(
    ids.filter((id) => demoDb.places.some((place) => place.id === id))
  )
  syncBookmarkState()
}

export function syncBookmarkState() {
  for (const place of demoDb.places) {
    const isBookmarked = demoDb.bookmarkedPlaceIds.has(place.id)
    place.is_bookmarked = isBookmarked
    const detail = demoDb.placeDetails[place.id]
    if (detail) detail.is_bookmarked = isBookmarked
  }
  demoDb.user.bookmark_count = demoDb.bookmarkedPlaceIds.size
}

export function setBookmark(placeId: number, bookmarked: boolean) {
  const place = demoDb.places.find((item) => item.id === placeId)
  const detail = demoDb.placeDetails[placeId]
  if (!place || !detail) return false

  const wasBookmarked = demoDb.bookmarkedPlaceIds.has(placeId)
  if (bookmarked) demoDb.bookmarkedPlaceIds.add(placeId)
  else demoDb.bookmarkedPlaceIds.delete(placeId)

  if (wasBookmarked !== bookmarked) {
    const delta = bookmarked ? 1 : -1
    place.bookmark_count = Math.max(0, place.bookmark_count + delta)
    detail.bookmark_count = place.bookmark_count
  }
  syncBookmarkState()
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      DEMO_BOOKMARKS_STORAGE_KEY,
      JSON.stringify([...demoDb.bookmarkedPlaceIds])
    )
  }
  return true
}

import { useCallback, useEffect, useRef, useState } from 'react'

import { getFollowers, getFollowing, type FollowUser } from '../api/followApi'

type FollowListType = 'followers' | 'following'

interface UseFollowListOptions {
  userId: number
  type: FollowListType
  enabled: boolean
}

function extractCursor(nextUrl: string | null): string | null {
  if (!nextUrl) return null
  try {
    return new URL(nextUrl).searchParams.get('cursor')
  } catch {
    return null
  }
}

export function useFollowList({ userId, type, enabled }: UseFollowListOptions) {
  const [users, setUsers] = useState<FollowUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const isFetchingRef = useRef(false)

  const fetchPage = useCallback(
    async (cursor?: string) => {
      if (isFetchingRef.current) return
      isFetchingRef.current = true
      setIsLoading(true)

      try {
        const response =
          type === 'followers'
            ? await getFollowers(userId, cursor)
            : await getFollowing(userId, cursor)

        setUsers((prev) =>
          cursor ? [...prev, ...response.results] : response.results
        )
        setNextCursor(extractCursor(response.next))
      } catch (error) {
        console.error('Failed to load follow list', error)
      } finally {
        isFetchingRef.current = false
        setIsLoading(false)
      }
    },
    [userId, type]
  )

  const loadMore = useCallback(() => {
    if (!nextCursor || isLoading) return
    void fetchPage(nextCursor)
  }, [nextCursor, isLoading, fetchPage])

  useEffect(() => {
    if (!enabled) return
    isFetchingRef.current = false
    const id = setTimeout(() => {
      void fetchPage()
    }, 0)
    return () => clearTimeout(id)
  }, [enabled, fetchPage])

  return {
    users,
    isLoading,
    hasNextPage: nextCursor !== null,
    loadMore,
  }
}

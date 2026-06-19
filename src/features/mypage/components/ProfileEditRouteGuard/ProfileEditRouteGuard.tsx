'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import type { ReactNode } from 'react'

import { ErrorState, LoadingState } from '@/components/common/status'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { loadCurrentUserProfile } from '@/features/auth/utils/currentUserProfile'

interface ProfileEditRouteGuardProps {
  children: ReactNode
  routeUserId: string
}

export function ProfileEditRouteGuard({
  children,
  routeUserId,
}: ProfileEditRouteGuardProps) {
  const router = useRouter()
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const currentUserProfile = useUserProfileStore((state) => state.userProfile)
  const [profileLoadError, setProfileLoadError] = useState(false)
  const [profileLoadAttempt, setProfileLoadAttempt] = useState(0)

  const currentUserId = currentUserProfile
    ? String(currentUserProfile.id)
    : null
  const normalizedRouteUserId = String(routeUserId)
  const shouldCorrectRoute = Boolean(
    isAuthInitialized &&
    isLoggedIn &&
    currentUserId &&
    normalizedRouteUserId !== currentUserId
  )

  useEffect(() => {
    if (
      !isAuthInitialized ||
      !isLoggedIn ||
      currentUserProfile ||
      profileLoadError
    ) {
      return
    }

    let cancelled = false

    loadCurrentUserProfile().catch(() => {
      if (!cancelled) {
        setProfileLoadError(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [
    currentUserProfile,
    isAuthInitialized,
    isLoggedIn,
    profileLoadAttempt,
    profileLoadError,
  ])

  useEffect(() => {
    if (!shouldCorrectRoute || !currentUserId) {
      return
    }

    router.replace(ROUTES.PROFILE_EDIT(currentUserId))
  }, [currentUserId, router, shouldCorrectRoute])

  if (!isAuthInitialized || (isLoggedIn && !currentUserProfile)) {
    if (profileLoadError) {
      return (
        <ErrorState
          title="프로필 정보를 불러오지 못했어요"
          description="잠시 후 다시 시도해주세요."
          actionLabel="다시 시도"
          onAction={() => {
            setProfileLoadError(false)
            setProfileLoadAttempt((attempt) => attempt + 1)
          }}
        />
      )
    }

    return <LoadingState />
  }

  if (!isLoggedIn || shouldCorrectRoute) {
    return <LoadingState />
  }

  return children
}

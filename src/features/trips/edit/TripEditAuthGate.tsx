'use client'

import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { AuthGate } from '@/components/auth/AuthGate'
import { LoadingState } from '@/components/common/status'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'

interface TripEditAuthGateProps {
  children: ReactNode
  ownerId: number
  tripId: string
}

export function TripEditAuthGate({
  children,
  ownerId,
  tripId,
}: TripEditAuthGateProps) {
  const router = useRouter()
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  const userProfile = useUserProfileStore((state) => state.userProfile)

  const isOwnerResolved =
    isAuthInitialized && isLoggedIn && userProfile !== null
  const currentUserId = isOwnerResolved ? Number(userProfile.id) : NaN
  const isOwner =
    isOwnerResolved && !Number.isNaN(currentUserId) && currentUserId === ownerId

  useEffect(() => {
    if (!isOwnerResolved) {
      return
    }

    if (!isOwner) {
      router.replace(ROUTES.TRIP_DETAIL(tripId))
    }
  }, [isOwner, isOwnerResolved, router, tripId])

  return (
    <AuthGate onClose={() => router.replace(ROUTES.TRIPS)}>
      {!isOwnerResolved || !isOwner ? <LoadingState /> : children}
    </AuthGate>
  )
}

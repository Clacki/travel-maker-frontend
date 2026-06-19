'use client'

import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'

import { AuthGate } from '@/components/auth/AuthGate'
import { ROUTES } from '@/constants/routes'

interface TripCreateAuthGateProps {
  children: ReactNode
}

export function TripCreateAuthGate({ children }: TripCreateAuthGateProps) {
  const router = useRouter()

  return (
    <AuthGate onClose={() => router.replace(ROUTES.TRIPS)}>{children}</AuthGate>
  )
}

'use client'

import type { ReactNode } from 'react'
import { useInitializeAuth } from '@/features/auth/hooks/useInitializeAuth'

export function AuthInitializer({ children }: { children: ReactNode }) {
  useInitializeAuth()

  return children
}

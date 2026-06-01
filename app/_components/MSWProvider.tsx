'use client'

import { useEffect, useState } from 'react'

const mockPromise =
  typeof window !== 'undefined' && process.env.NODE_ENV === 'development'
    ? import('../../mocks').then(({ initMocks }) => initMocks())
    : Promise.resolve()

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(process.env.NODE_ENV !== 'development')

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      mockPromise.then(() => {
        setIsReady(true)
      })
    }
  }, [])

  if (!isReady) return null

  return <>{children}</>
}

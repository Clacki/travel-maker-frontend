'use client'

import { useEffect, useState, type ReactNode } from 'react'
import {
  DEMO_BOOKMARKS_STORAGE_KEY,
  hydrateDemoBookmarks,
} from '../../../mocks/db'
import { isMswEnabled } from '@/lib/dataSource'

export function MockProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(!isMswEnabled)

  useEffect(() => {
    let active = true
    const start = async () => {
      const stored = localStorage.getItem(DEMO_BOOKMARKS_STORAGE_KEY)
      if (stored) {
        try {
          const ids = JSON.parse(stored)
          if (Array.isArray(ids)) hydrateDemoBookmarks(ids.map(Number))
        } catch {
          localStorage.removeItem(DEMO_BOOKMARKS_STORAGE_KEY)
        }
      }
      if (!isMswEnabled) return
      const { worker } = await import('../../../mocks/browser')
      await worker.start({
        onUnhandledRequest(request, print) {
          const url = new URL(request.url)
          if (url.origin === window.location.origin) {
            print.warning()
          }
        },
      })
      if (active) setIsReady(true)
    }
    void start()
    return () => {
      active = false
    }
  }, [])

  return isReady ? children : null
}

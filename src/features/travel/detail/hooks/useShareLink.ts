'use client'

import { useEffect, useRef, useState } from 'react'

export function useShareLink() {
  const [toastVisible, setToastVisible] = useState(false)
  const isSharing = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    []
  )

  const shareLink = async () => {
    if (isSharing.current) return
    isSharing.current = true

    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {}

    setToastVisible(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToastVisible(false), 2000)

    isSharing.current = false
  }

  return { toastVisible, shareLink }
}

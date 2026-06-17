'use client'

import { useEffect, useRef, useState } from 'react'

interface UseShareLinkParams {
  title: string
}

export function useShareLink({ title }: UseShareLinkParams) {
  const [copied, setCopied] = useState(false)
  const isSharing = useRef(false)
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current)
      }
    },
    []
  )

  const shareLink = async () => {
    if (isSharing.current) return

    isSharing.current = true
    try {
      const url = window.location.href

      if (navigator.share) {
        await navigator.share({ title, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)

        if (copiedTimeoutRef.current) {
          clearTimeout(copiedTimeoutRef.current)
        }

        copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
      }
    } finally {
      isSharing.current = false
    }
  }

  return { copied, shareLink }
}

'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { isSameInternalHref } from './navigationUtils'

function TopLoaderBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [active, setActive] = useState(false)
  const [width, setWidth] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevPathRef = useRef(pathname + searchParams.toString())

  function clearTimers() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  function start() {
    clearTimers()
    setActive(true)
    setOpacity(1)
    setWidth(12)

    let w = 12
    intervalRef.current = setInterval(() => {
      w = Math.min(w + (82 - w) * 0.12, 82)
      setWidth(w)
    }, 250)
  }

  function complete() {
    clearTimers()
    setWidth(100)
    timeoutRef.current = setTimeout(() => {
      setOpacity(0)
      timeoutRef.current = setTimeout(() => {
        setActive(false)
        setWidth(0)
        setOpacity(1)
      }, 200)
    }, 120)
  }

  useEffect(() => {
    const newPath = pathname + searchParams.toString()
    if (prevPathRef.current !== newPath) {
      prevPathRef.current = newPath
      complete()
    }
  }, [pathname, searchParams])

  useEffect(() => {
    function onNavigateStart() {
      start()
    }

    function onAnchorClick(e: MouseEvent) {
      if (e.defaultPrevented) return
      if (e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const link = (e.target as HTMLElement).closest(
        'a[href]'
      ) as HTMLAnchorElement | null
      if (!link) return

      if (link.hasAttribute('download')) return
      const target = link.getAttribute('target')
      if (target && target !== '_self') return

      const href = link.getAttribute('href')
      if (!href) return

      const targetUrl = new URL(href, window.location.origin)
      if (targetUrl.origin !== window.location.origin) return

      if (
        isSameInternalHref({
          href: targetUrl.href,
          origin: window.location.origin,
          currentPathname: window.location.pathname,
          currentSearchParams: window.location.search,
        })
      ) {
        return
      }

      window.setTimeout(() => {
        if (!e.defaultPrevented) {
          start()
        }
      }, 0)
    }

    window.addEventListener('navigate-start', onNavigateStart)
    document.addEventListener('click', onAnchorClick, true)

    return () => {
      window.removeEventListener('navigate-start', onNavigateStart)
      document.removeEventListener('click', onAnchorClick, true)
    }
  }, [])

  useEffect(() => () => clearTimers(), [])

  if (!active) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${width}%`,
        background: 'var(--colors-primary)',
        zIndex: 9999,
        transition: 'width 0.3s ease, opacity 0.2s ease',
        opacity,
        pointerEvents: 'none',
      }}
    />
  )
}

export function TopLoader() {
  return (
    <Suspense fallback={null}>
      <TopLoaderBar />
    </Suspense>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { type SortKey } from '../constants'

export function useExploreSort(onLoginRequired: () => void) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isLoggedIn, isAuthInitialized } = useAuthStore()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const sort = (searchParams.get('sort') ?? 'popular') as SortKey

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isAuthInitialized && !isLoggedIn && sort === 'recommended') {
      const params = new URLSearchParams(searchParams.toString())
      params.set('sort', 'popular')
      params.set('page', '1')
      router.push(`/explore?${params.toString()}`, { scroll: false })
    }
  }, [isAuthInitialized, isLoggedIn, sort, searchParams, router])

  function setSort(key: SortKey) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', key)
    params.set('page', '1')
    router.push(`/explore?${params.toString()}`, { scroll: false })
  }

  function handleSortSelect(key: SortKey) {
    if (key === 'recommended' && (!isAuthInitialized || !isLoggedIn)) {
      onLoginRequired()
      setIsDropdownOpen(false)
      return
    }
    setSort(key)
    setIsDropdownOpen(false)
  }

  return {
    sort,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    handleSortSelect,
    isLoggedIn,
  }
}

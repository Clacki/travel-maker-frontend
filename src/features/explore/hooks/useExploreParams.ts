'use client'

import { useState, useMemo, type RefObject } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { STYLE_TO_CATEGORY } from '../constants'
import { parseParams, getFilterChips } from '../utils'

export function useExploreParams(gridRef: RefObject<HTMLElement | null>) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const keyword = searchParams.get('keyword') ?? ''
  const [prevKeyword, setPrevKeyword] = useState(keyword)
  const [searchInput, setSearchInput] = useState(keyword)
  const [filterResetKey, setFilterResetKey] = useState(0)
  const [filterInitialSelected, setFilterInitialSelected] = useState<
    Record<string, string[]>
  >(() => parseParams(searchParams))

  // URL keyword 변경 시(뒤로가기 포함) searchInput 동기화 — React 공식 getDerivedState 패턴
  if (prevKeyword !== keyword) {
    setPrevKeyword(keyword)
    setSearchInput(keyword)
  }

  const categoryId = searchParams.get('category')
  const currentPage = Math.max(
    1,
    parseInt(searchParams.get('page') ?? '1', 10) || 1
  )
  const selected = useMemo(() => parseParams(searchParams), [searchParams])
  const filterChips = useMemo(() => getFilterChips(selected), [selected])

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/explore?${params.toString()}`, { scroll: false })
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function applyFilters(
    newSelected: Record<string, string[]>,
    searchValue?: string
  ) {
    const params = new URLSearchParams()

    const styleValues = newSelected.style ?? []
    let newCategoryId: string | null = null
    if (styleValues.length === 1 && styleValues[0] !== 'all') {
      newCategoryId = STYLE_TO_CATEGORY[styleValues[0]] ?? null
    }

    if (newCategoryId) params.set('category', newCategoryId)
    if (searchParams.get('sort')) params.set('sort', searchParams.get('sort')!)
    for (const [key, values] of Object.entries(newSelected)) {
      if (values.length > 0 && key !== 'keyword' && key !== 'page') {
        params.set(key, values.join(','))
      }
    }
    const trimmedInput = (searchValue ?? searchInput).trim()
    if (trimmedInput) params.set('keyword', trimmedInput)
    params.set('page', '1')
    router.push(`/explore?${params.toString()}`, { scroll: false })
  }

  function clearAllFilters() {
    const params = new URLSearchParams()
    if (searchParams.get('sort')) params.set('sort', searchParams.get('sort')!)
    params.set('page', '1')
    setSearchInput('')
    setFilterInitialSelected({})
    setFilterResetKey((k) => k + 1)
    router.push(`/explore?${params.toString()}`, { scroll: false })
  }

  return {
    searchInput,
    setSearchInput,
    filterResetKey,
    filterInitialSelected,
    keyword,
    categoryId,
    currentPage,
    selected,
    filterChips,
    applyFilters,
    clearAllFilters,
    goToPage,
  }
}

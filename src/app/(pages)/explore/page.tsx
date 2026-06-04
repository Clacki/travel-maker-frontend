'use client'

import { Suspense, useMemo, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react'
import { travelCategories, getAllDestinations } from '@/mocks/data/travel-data'
import { travelFilterSections } from '@/lib/filter-data'
import { FilterCard } from '@/components/filters/filter-card'
import { DestinationCard } from '@/components/cards/destination-card'
import { css } from '@/styled-system/css'

type SortKey = 'popular' | 'bookmarks' | 'reviews'

const SORT_LABELS: Record<SortKey, string> = {
  popular: '인기순',
  bookmarks: '북마크순',
  reviews: '리뷰순',
}

const DEFAULT_BG =
  'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&h=900&fit=crop'

const STYLE_TO_CATEGORY: Record<string, string> = {
  beach: 'beach',
  mountain: 'mountain',
  city: 'city',
  culture: 'culture',
  food: 'food',
  activity: 'adventure',
  romantic: 'romantic',
}

function hash(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function parseParams(
  searchParams: ReturnType<typeof useSearchParams>
): Record<string, string[]> {
  const result: Record<string, string[]> = {}
  searchParams.forEach((value, key) => {
    if (key !== 'sort' && key !== 'category' && value) {
      result[key] = value.split(',')
    }
  })
  return result
}

function getFilterChips(selected: Record<string, string[]>) {
  const chips: { sectionId: string; tagId: string; label: string }[] = []
  for (const section of travelFilterSections) {
    const ids = selected[section.id] || []
    for (const tagId of ids) {
      const tag = section.tags.find((t) => t.id === tagId)
      if (tag) {
        const label = tag.emoji ? `${tag.emoji} ${tag.label}` : tag.label
        chips.push({ sectionId: section.id, tagId, label })
      }
    }
  }
  return chips
}

export default function ExplorePage() {
  return (
    <Suspense fallback={null}>
      <ExploreContent />
    </Suspense>
  )
}

function ExploreContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const categoryId = searchParams.get('category')
  const sort = (searchParams.get('sort') ?? 'popular') as SortKey
  const selected = useMemo(() => parseParams(searchParams), [searchParams])
  const filterChips = useMemo(() => getFilterChips(selected), [selected])

  const activeCategory = useMemo(
    () => travelCategories.find((c) => c.id === categoryId) ?? null,
    [categoryId]
  )

  const bgImage = activeCategory?.image ?? DEFAULT_BG
  const heroTitle = activeCategory?.name ?? '여행지 탐색'
  const heroDesc =
    activeCategory?.description ?? '세계 각지의 여행지를 탐색해 보세요'

  const all = useMemo(() => getAllDestinations(), [])

  const filtered = useMemo(() => {
    let result = all

    if (categoryId) {
      result = result.filter((d) => d.categoryId === categoryId)
    }

    if (selected.style?.length) {
      const cats = selected.style
        .map((s) => STYLE_TO_CATEGORY[s])
        .filter(Boolean)
      if (cats.length) {
        result = result.filter((d) => cats.includes(d.categoryId))
      }
    }

    if (selected.region?.length) {
      result = result.filter((d) => d.location.includes('대한민국'))
    }

    return result
  }, [all, categoryId, selected])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sort === 'popular') return arr.sort((a, b) => b.rating - a.rating)
    if (sort === 'bookmarks') {
      return arr.sort(
        (a, b) => (hash(b.id + 'bm') % 1000) - (hash(a.id + 'bm') % 1000)
      )
    }
    if (sort === 'reviews') {
      return arr.sort(
        (a, b) => (hash(b.id + 'rv') % 5000) - (hash(a.id + 'rv') % 5000)
      )
    }
    return arr
  }, [filtered, sort])

  function setCategory(id: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set('category', id)
    } else {
      params.delete('category')
    }
    router.push(`/explore?${params.toString()}`)
  }

  function setSort(key: SortKey) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', key)
    router.push(`/explore?${params.toString()}`)
  }

  function applyFilters(newSelected: Record<string, string[]>) {
    const params = new URLSearchParams()
    if (categoryId) params.set('category', categoryId)
    if (searchParams.get('sort')) params.set('sort', searchParams.get('sort')!)
    for (const [key, values] of Object.entries(newSelected)) {
      if (values.length > 0) params.set(key, values.join(','))
    }
    router.push(`/explore?${params.toString()}`)
    setIsFilterOpen(false)
  }

  function removeFilter(sectionId: string, tagId: string) {
    const params = new URLSearchParams(searchParams.toString())
    const current = (params.get(sectionId) ?? '')
      .split(',')
      .filter((v) => v && v !== tagId)
    if (current.length) {
      params.set(sectionId, current.join(','))
    } else {
      params.delete(sectionId)
    }
    router.push(`/explore?${params.toString()}`)
  }

  function clearAllFilters() {
    const params = new URLSearchParams()
    if (categoryId) params.set('category', categoryId)
    if (searchParams.get('sort')) params.set('sort', searchParams.get('sort')!)
    router.push(`/explore${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const hasFilter = filterChips.length > 0
  const totalFilterCount = Object.values(selected).reduce(
    (sum, arr) => sum + arr.length,
    0
  )

  return (
    <main className={css({ minH: '100vh', bg: 'bg.canvas' })}>
      {/* Hero Section */}
      <section
        className={css({
          position: 'relative',
          h: { base: '260px', md: '340px' },
          overflow: 'hidden',
        })}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={bgImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={css({ position: 'absolute', inset: 0 })}
          >
            <Image
              src={bgImage}
              alt={heroTitle}
              fill
              className={css({ objectFit: 'cover' })}
              priority
            />
          </motion.div>
        </AnimatePresence>

        <div
          className={css({ position: 'absolute', inset: 0 })}
          style={{
            background:
              'linear-gradient(to top, var(--colors-bg-canvas) 0%, color-mix(in srgb, var(--colors-bg-canvas) 50%, transparent) 55%, transparent 100%)',
          }}
        />

        <div
          className={css({
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: { base: 6, md: 12 },
          })}
        >
          <div className={css({ maxW: '7xl', mx: 'auto' })}>
            <Link
              href="/"
              className={css({
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                color: 'text.secondary',
                textDecoration: 'none',
                mb: 4,
                fontSize: 'sm',
                _hover: { color: 'text.primary' },
                transitionProperty: 'color',
                transitionDuration: '200ms',
                transitionTimingFunction: 'ease-in-out',
              })}
            >
              <ArrowLeft className={css({ w: 4, h: 4 })} />
              홈으로
            </Link>
            <AnimatePresence mode="wait">
              <motion.div
                key={heroTitle}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <h1
                  className={css({
                    fontSize: { base: '2xl', md: '4xl' },
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 1,
                  })}
                >
                  {heroTitle}
                </h1>
                <p className={css({ fontSize: 'sm', color: 'text.secondary' })}>
                  {heroDesc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Category Tabs + 필터 토글 */}
      <section
        className={css({
          py: 5,
          px: 6,
          borderBottom: '1px solid',
          borderColor: 'border',
        })}
      >
        <div
          className={css({
            maxW: '7xl',
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          })}
        >
          {/* 카테고리 탭 (스크롤 가능) */}
          <div
            className={css({
              flex: 1,
              overflowX: 'auto',
              display: 'flex',
              gap: '8px',
              minW: 0,
            })}
          >
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={css({
                px: '16px',
                py: '8px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1.5px solid',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transitionProperty: 'background-color, color, border-color',
                transitionDuration: '150ms',
                transitionTimingFunction: 'ease-in-out',
                borderColor: !categoryId ? 'primary' : 'border',
                bg: !categoryId ? 'primary' : 'bg.surface',
                color: !categoryId ? 'text.inverse' : 'text.secondary',
                _hover: !categoryId
                  ? {}
                  : { borderColor: 'primary', color: 'text.primary' },
              })}
            >
              전체
            </button>
            {travelCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={css({
                  px: '16px',
                  py: '8px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1.5px solid',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transitionProperty: 'background-color, color, border-color',
                  transitionDuration: '150ms',
                  transitionTimingFunction: 'ease-in-out',
                  borderColor: categoryId === cat.id ? 'primary' : 'border',
                  bg: categoryId === cat.id ? 'primary' : 'bg.surface',
                  color:
                    categoryId === cat.id ? 'text.inverse' : 'text.secondary',
                  _hover:
                    categoryId === cat.id
                      ? {}
                      : { borderColor: 'primary', color: 'text.primary' },
                })}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* 필터 토글 버튼 */}
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={css({
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              px: '14px',
              py: '8px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1.5px solid',
              flexShrink: 0,
              transitionProperty: 'background-color, color, border-color',
              transitionDuration: '150ms',
              transitionTimingFunction: 'ease-in-out',
              borderColor:
                isFilterOpen || totalFilterCount > 0 ? 'primary' : 'border',
              bg: isFilterOpen
                ? 'primary'
                : totalFilterCount > 0
                  ? 'primary/10'
                  : 'bg.surface',
              color: isFilterOpen
                ? 'text.inverse'
                : totalFilterCount > 0
                  ? 'primary'
                  : 'text.secondary',
              _hover: isFilterOpen
                ? {}
                : { borderColor: 'primary', color: 'primary' },
            })}
          >
            <SlidersHorizontal className={css({ w: '14px', h: '14px' })} />
            필터
            {totalFilterCount > 0 && (
              <span
                className={css({
                  w: '16px',
                  h: '16px',
                  borderRadius: '50%',
                  bg: isFilterOpen ? 'text.inverse' : 'primary',
                  color: isFilterOpen ? 'primary' : 'text.inverse',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                })}
              >
                {totalFilterCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* FilterCard (접힘/펼침) */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              className={css({
                px: 6,
                py: 4,
                borderBottom: '1px solid',
                borderColor: 'border',
                bg: 'bg.canvas',
              })}
            >
              <div className={css({ maxW: '7xl', mx: 'auto' })}>
                <FilterCard
                  sections={travelFilterSections}
                  initialSelected={selected}
                  resultCount={sorted.length}
                  onApply={applyFilters}
                  onReset={clearAllFilters}
                />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Sort + Count + Filter Chips */}
      <section
        className={css({
          py: 5,
          px: 6,
          borderBottom: hasFilter ? '1px solid' : 'none',
          borderColor: 'border',
        })}
      >
        <div className={css({ maxW: '7xl', mx: 'auto' })}>
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 4,
            })}
          >
            <p className={css({ fontSize: 'sm', color: 'text.secondary' })}>
              {hasFilter ? '필터 적용됨 · ' : ''}
              {sorted.length}개의 여행지
            </p>
            <div className={css({ display: 'flex', gap: '6px' })}>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSort(key)}
                  className={css({
                    px: '14px',
                    py: '7px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1.5px solid',
                    transitionProperty: 'background-color, color, border-color',
                    transitionDuration: '150ms',
                    transitionTimingFunction: 'ease-in-out',
                    borderColor: sort === key ? 'primary' : 'border',
                    bg: sort === key ? 'primary' : 'bg.surface',
                    color: sort === key ? 'text.inverse' : 'text.secondary',
                    _hover:
                      sort === key
                        ? {}
                        : { borderColor: 'primary', color: 'text.primary' },
                  })}
                >
                  {SORT_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

          {hasFilter && (
            <div
              className={css({
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                mt: 4,
                alignItems: 'center',
              })}
            >
              <span
                className={css({
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'primary',
                  mr: 1,
                })}
              >
                필터
              </span>
              {filterChips.map((chip) => (
                <span
                  key={`${chip.sectionId}-${chip.tagId}`}
                  className={css({
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    bg: 'primary/10',
                    color: 'primary',
                    fontSize: '11px',
                    fontWeight: 600,
                    px: '10px',
                    py: '3px',
                    borderRadius: '50px',
                    border: '1.5px solid',
                    borderColor: 'primary/20',
                  })}
                >
                  {chip.label}
                  <span
                    onClick={() => removeFilter(chip.sectionId, chip.tagId)}
                    className={css({
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      _hover: { color: 'text.primary' },
                    })}
                  >
                    <X className={css({ w: '10px', h: '10px' })} />
                  </span>
                </span>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className={css({
                  fontSize: '11px',
                  color: 'text.secondary',
                  cursor: 'pointer',
                  border: 'none',
                  bg: 'transparent',
                  _hover: { color: 'text.primary' },
                  ml: 1,
                })}
              >
                전체 초기화
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Destinations Grid */}
      <section className={css({ py: 10, px: 6 })}>
        <div className={css({ maxW: '7xl', mx: 'auto' })}>
          {sorted.length > 0 ? (
            <div
              className={css({
                display: 'grid',
                gridTemplateColumns: {
                  base: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)',
                  xl: 'repeat(4, 1fr)',
                },
                gap: 6,
              })}
            >
              {sorted.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className={css({ textAlign: 'center', py: 20 })}>
              <p
                className={css({
                  fontSize: 'lg',
                  color: 'text.secondary',
                  mb: 4,
                })}
              >
                조건에 맞는 여행지가 없습니다
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className={css({
                  px: 6,
                  py: 3,
                  bg: 'primary',
                  color: 'text.inverse',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  _hover: { opacity: 0.88 },
                })}
              >
                필터 초기화하기
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

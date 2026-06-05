'use client'

import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin } from 'lucide-react'
import { Header } from '@/components/common/header'
import { FilterCard } from '@/components/filters/filter-card'
import { DestinationCard } from '@/components/cards/destination-card'
import { getCategoryById } from '@/lib/travel-data'
import { travelFilterSections } from '@/lib/filter-data'
import { css } from '@/styled-system/css'

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.id as string
  const category = getCategoryById(categoryId)

  const handleApply = (selected: Record<string, string[]>) => {
    const urlParams = new URLSearchParams()
    for (const [key, values] of Object.entries(selected)) {
      if (values.length > 0) urlParams.set(key, values.join(','))
    }
    router.push(
      `/travel/explore${urlParams.toString() ? `?${urlParams.toString()}` : ''}`
    )
  }

  if (!category) {
    return (
      <main className={css({ minH: '100vh', bg: 'background' })}>
        <Header />
        <div className={css({ h: '66px' })} />
        <div className={css({ px: 6, textAlign: 'center' })}>
          <h1
            className={css({
              fontSize: '2xl',
              fontWeight: 'bold',
              color: 'foreground',
            })}
          >
            카테고리를 찾을 수 없습니다
          </h1>
          <Link
            href="/"
            className={css({
              color: 'primary',
              mt: 4,
              display: 'inline-block',
              textDecoration: 'none',
            })}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </main>
    )
  }

  const destinations = category.destinations

  return (
    <main className={css({ minH: '100vh', bg: 'background' })}>
      <Header />

      {/* 고정 헤더 높이만큼 공간 확보 */}
      <div className={css({ h: '66px' })} />

      {/* 히어로 배너 */}
      <section
        className={css({ position: 'relative', h: '40vh', minH: '320px' })}
      >
        <Image
          src={category.image}
          alt={category.name}
          fill
          className={css({ objectFit: 'cover' })}
          priority
        />
        <div
          className={css({
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, var(--colors-background) 0%, color-mix(in srgb, var(--colors-background) 50%, transparent) 50%, transparent 100%)',
          })}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/"
                className={css({
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 2,
                  color: 'muted.foreground',
                  textDecoration: 'none',
                  mb: 4,
                  fontSize: 'sm',
                  _hover: { color: 'foreground' },
                  transition: 'colors',
                })}
              >
                <ArrowLeft className={css({ w: 4, h: 4 })} />
                다른 테마 보기
              </Link>
              <h1
                className={css({
                  fontSize: { base: '3xl', md: '5xl' },
                  fontWeight: 'bold',
                  color: 'foreground',
                  mb: 3,
                })}
              >
                {category.name}
              </h1>
              <p
                className={css({
                  fontSize: 'lg',
                  color: 'muted.foreground',
                  maxW: 'xl',
                })}
              >
                {category.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 필터 카드 */}
      <section className={css({ py: 8, px: 6 })}>
        <div className={css({ maxW: '7xl', mx: 'auto' })}>
          <FilterCard
            sections={travelFilterSections}
            resultCount={destinations.length}
            onApply={handleApply}
          />
        </div>
      </section>

      {/* 여행지 그리드 */}
      <section className={css({ py: 12, px: 6 })}>
        <div className={css({ maxW: '7xl', mx: 'auto' })}>
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 8,
            })}
          >
            <div
              className={css({ display: 'flex', alignItems: 'center', gap: 2 })}
            >
              <MapPin className={css({ w: 5, h: 5, color: 'primary' })} />
              <h2
                className={css({
                  fontSize: 'xl',
                  fontWeight: 'semibold',
                  color: 'foreground',
                })}
              >
                추천 여행지
              </h2>
            </div>
            <span
              className={css({ fontSize: 'sm', color: 'muted.foreground' })}
            >
              {destinations.length}개의 여행지
            </span>
          </div>

          {destinations.length > 0 ? (
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
              {destinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className={css({ textAlign: 'center', py: 16 })}>
              <p className={css({ color: 'muted.foreground' })}>
                여행지가 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        className={css({
          borderTop: '1px solid',
          borderColor: 'border',
          py: 4,
          px: 6,
          bg: 'background',
        })}
      >
        <div className={css({ maxW: '7xl', mx: 'auto', textAlign: 'center' })}>
          <p className={css({ fontSize: 'xs', color: 'muted.foreground' })}>
            &copy; 2026 TravelMaker. 당신의 완벽한 여행을 응원합니다.
          </p>
        </div>
      </footer>
    </main>
  )
}

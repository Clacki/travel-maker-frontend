'use client'

import { Header } from '@/components/common/header'
import { CategoryCard } from '@/components/cards/category-card'
import { travelCategories } from '@/lib/travel-data'
import { Sparkles } from 'lucide-react'
import { css } from '@/styled-system/css'

// 전체적으로 우측으로 이동해 히어로 텍스트 가림 방지
const cardPositions = [
  { left: '0%', top: '58%', rotate: -22, zIndex: 1 }, // 가장 왼쪽, 아래
  { left: '12%', top: '22%', rotate: -13, zIndex: 2 }, // 왼쪽, 위
  { left: '26%', top: '56%', rotate: -5, zIndex: 7 }, // 중앙-좌 (가장 앞), 아래
  { left: '40%', top: '18%', rotate: 3, zIndex: 6 }, // 중앙, 위
  { left: '54%', top: '54%', rotate: 10, zIndex: 5 }, // 중앙-우, 아래
  { left: '67%', top: '20%', rotate: 17, zIndex: 4 }, // 오른쪽, 위
  { left: '78%', top: '58%', rotate: 23, zIndex: 3 }, // 가장 오른쪽 (잘림), 아래
]

export default function Home() {
  return (
    <main
      className={css({
        h: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDir: 'column',
        position: 'relative',
      })}
    >
      {/* Background image */}
      <div
        className={css({
          position: 'absolute',
          inset: 0,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        })}
        style={{ backgroundImage: "url('/images/travel-bg.jpg')" }}
      />
      {/* Gradient overlay */}
      <div
        className={css({
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, var(--colors-background) 0%, color-mix(in srgb, var(--colors-background) 95%, transparent) 40%, color-mix(in srgb, var(--colors-background) 30%, transparent) 100%)',
        })}
      />

      <Header />

      <div
        className={css({
          flex: 1,
          display: 'flex',
          flexDir: { base: 'column', lg: 'row' },
          alignItems: 'center',
          px: 6,
          pt: { base: 20, lg: 0 },
          position: 'relative',
          zIndex: 10,
        })}
      >
        {/* Hero Section */}
        <section
          className={css({
            w: { lg: '2/5' },
            minW: { lg: '320px' },
            flexShrink: 0,
            textAlign: { base: 'center', lg: 'left' },
            pl: { lg: 12, xl: 20 },
            py: { base: 8, lg: 0 },
            wordBreak: 'keep-all', // 한국어 어절 단위 줄바꿈
            overflowWrap: 'break-word',
          })}
        >
          <div
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              px: 4,
              py: 2,
              bg: 'primary/10',
              rounded: 'full',
              mb: 6,
            })}
          >
            <Sparkles className={css({ w: 4, h: 4, color: 'primary' })} />
            <span
              className={css({
                fontSize: 'sm',
                color: 'primary',
                fontWeight: 'medium',
              })}
            >
              나만의 여행을 찾아보세요
            </span>
          </div>
          <h1
            className={css({
              fontSize: { base: '3xl', md: '4xl', lg: '5xl', xl: '6xl' },
              fontWeight: 'bold',
              color: 'foreground',
              mb: 6,
            })}
          >
            당신의 여행 스타일은
            <br />
            <span className={css({ color: 'primary' })}>무엇인가요?</span>
          </h1>
          <p
            className={css({
              fontSize: { base: 'base', lg: 'lg' },
              color: 'muted.foreground',
              maxW: 'md',
            })}
          >
            7가지 테마 중 하나를 선택하고, 세부 취향에 맞는 완벽한 여행지를
            추천받으세요
          </p>
        </section>

        {/* Category cards section */}
        <section
          className={css({
            w: { lg: '3/5' },
            position: 'relative',
            h: { base: '400px', md: '500px', lg: 'full' },
            width: 'full',
          })}
        >
          <div className={css({ position: 'relative', h: 'full', w: 'full' })}>
            {travelCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                style={cardPositions[index]}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer
        className={css({
          display: { base: 'none', lg: 'block' },
          borderTop: '1px solid',
          borderColor: 'border',
          py: 4,
          px: 6,
          position: 'relative',
          zIndex: 10,
          bg: 'white',
        })}
      >
        <div className={css({ maxW: '7xl', mx: 'auto', textAlign: 'center' })}>
          <p className={css({ fontSize: 'xs', color: 'muted.foreground' })}>
            &copy; 2024 트래블픽. 당신의 완벽한 여행을 응원합니다.
          </p>
        </div>
      </footer>
    </main>
  )
}

import { LayoutContainer } from '@/components/layout'
import { Sparkles } from 'lucide-react'
import { CategoryCard } from '@/features/explore/components/CategoryCard'
import { travelCategories } from '@/mocks/data/travel-data'
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

// md(768px~1023px): column 레이아웃에서 카드 섹션 500px 안에 수용되도록 top 값 조정
const mdCardPositions = [
  { left: '0%', top: '24%', rotate: -22, zIndex: 1 },
  { left: '12%', top: '2%', rotate: -13, zIndex: 2 },
  { left: '26%', top: '22%', rotate: -5, zIndex: 7 },
  { left: '40%', top: '0%', rotate: 3, zIndex: 6 },
  { left: '54%', top: '20%', rotate: 10, zIndex: 5 },
  { left: '67%', top: '1%', rotate: 17, zIndex: 4 },
  { left: '78%', top: '24%', rotate: 23, zIndex: 3 },
]

// sm(<768px): column 레이아웃에서 카드 섹션 400px 안에 수용되도록 top 값 조정
const smCardPositions = [
  { left: '0%', top: '36%', rotate: -22, zIndex: 1 },
  { left: '12%', top: '8%', rotate: -13, zIndex: 2 },
  { left: '26%', top: '34%', rotate: -5, zIndex: 7 },
  { left: '40%', top: '6%', rotate: 3, zIndex: 6 },
  { left: '54%', top: '32%', rotate: 10, zIndex: 5 },
  { left: '67%', top: '7%', rotate: 17, zIndex: 4 },
  { left: '78%', top: '36%', rotate: 23, zIndex: 3 },
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
        style={{ backgroundImage: "url('/images/bg_Theme/travel-bg.webp')" }}
      />
      {/* Gradient overlay */}
      <div
        className={css({ position: 'absolute', inset: 0 })}
        style={{
          background:
            'linear-gradient(to right, var(--colors-bg-canvas) 0%, color-mix(in srgb, var(--colors-bg-canvas) 85%, transparent) 30%, color-mix(in srgb, var(--colors-bg-canvas) 10%, transparent) 100%)',
        }}
      />

      <LayoutContainer
        className={css({
          flex: 1,
          display: 'flex',
          flexDir: { base: 'column', lg: 'row' },
          alignItems: 'center',
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
            py: { base: 8, lg: 0 },
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
            userSelect: 'none',
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
              color: 'text.primary',
              mb: 6,
            })}
          >
            <span className={css({ whiteSpace: 'nowrap' })}>
              당신의 여행 스타일은
            </span>
            <br />
            <span className={css({ color: 'primary' })}>무엇인가요?</span>
          </h1>
          <p
            className={css({
              fontSize: { base: 'md', lg: 'lg' },
              color: 'text.secondary',
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
            w: { base: 'full', lg: '3/5' },
            position: 'relative',
            h: { base: '400px', md: '500px', lg: 'full' },
          })}
        >
          {travelCategories
            .slice(0, cardPositions.length)
            .map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                style={cardPositions[index]}
                mdStyle={mdCardPositions[index]}
                smStyle={smCardPositions[index]}
              />
            ))}
        </section>
      </LayoutContainer>
    </main>
  )
}

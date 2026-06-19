import { LayoutContainer } from '@/components/layout'
import { Sparkles } from 'lucide-react'
import { CategoryCard } from '@/features/explore/components/CategoryCard'
import { CategoryCardSwiper } from '@/features/explore/components/CategoryCardSwiper'
import { travelCategories } from '@/mocks/data/travel-data'
import { css } from '@/styled-system/css'

const cardPositions = [
  { left: '0%', top: '58%', rotate: -22, zIndex: 1 },
  { left: '12%', top: '22%', rotate: -13, zIndex: 2 },
  { left: '26%', top: '56%', rotate: -5, zIndex: 7 },
  { left: '40%', top: '18%', rotate: 3, zIndex: 6 },
  { left: '54%', top: '54%', rotate: 10, zIndex: 5 },
  { left: '67%', top: '20%', rotate: 17, zIndex: 4 },
  { left: '78%', top: '58%', rotate: 23, zIndex: 3 },
]

// md(768px~1023px): 스와이퍼로 처리되므로 사실상 미사용 — lg+ 분기용 백업
const mdCardPositions = [
  { left: '0%', top: '24%', rotate: -22, zIndex: 1 },
  { left: '12%', top: '2%', rotate: -13, zIndex: 2 },
  { left: '26%', top: '22%', rotate: -5, zIndex: 7 },
  { left: '40%', top: '0%', rotate: 3, zIndex: 6 },
  { left: '54%', top: '20%', rotate: 10, zIndex: 5 },
  { left: '67%', top: '1%', rotate: 17, zIndex: 4 },
  { left: '78%', top: '24%', rotate: 23, zIndex: 3 },
]

export default function Home() {
  return (
    <main
      className={css({
        h: '100dvh',
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
      {/* 모바일(< lg): column 레이아웃 - 텍스트가 위에 오므로 to bottom으로 상단 가독성 확보 */}
      <div
        className={css({
          position: 'absolute',
          inset: 0,
          display: { base: 'block', lg: 'none' },
        })}
        style={{
          background:
            'linear-gradient(to bottom, var(--colors-bg-canvas) 0%, color-mix(in srgb, var(--colors-bg-canvas) 80%, transparent) 35%, color-mix(in srgb, var(--colors-bg-canvas) 10%, transparent) 100%)',
        }}
        aria-hidden
      />
      {/* 데스크탑(lg+): row 레이아웃 - 텍스트가 왼쪽에 오므로 to right으로 좌측 가독성 확보 */}
      <div
        className={css({
          position: 'absolute',
          inset: 0,
          display: { base: 'none', lg: 'block' },
        })}
        style={{
          background:
            'linear-gradient(to right, var(--colors-bg-canvas) 0%, color-mix(in srgb, var(--colors-bg-canvas) 85%, transparent) 30%, color-mix(in srgb, var(--colors-bg-canvas) 10%, transparent) 100%)',
        }}
        aria-hidden
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
            pt: { base: 6, lg: 0 },
            pb: { base: 2, lg: 0 },
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

        {/* 모바일·태블릿(< lg): 스와이퍼 캐러셀 */}
        <section
          className={css({
            display: { base: 'flex', lg: 'none' },
            alignItems: 'center',
            w: 'full',
          })}
        >
          <CategoryCardSwiper categories={travelCategories} />
        </section>

        {/* 데스크탑(lg+): 팬 카드 배치 */}
        <section
          className={css({
            display: { base: 'none', lg: 'block' },
            w: '3/5',
            position: 'relative',
            h: 'full',
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
              />
            ))}
        </section>
      </LayoutContainer>
    </main>
  )
}

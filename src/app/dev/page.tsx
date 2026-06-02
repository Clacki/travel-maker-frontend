import type { ReactNode } from 'react'
import { Button, IconButton } from '@/components/common/button'
import { TypeCard } from '@/components/common/TypeCard'
import { Footer, Header } from '@/components/layout'
import { css } from '@/styled-system/css'
import { TagPlayground } from './TagPlayground'

const buttonVariants = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'neutral',
] as const
const buttonSizes = ['sm', 'md', 'lg'] as const
const buttonShapes = ['rounded', 'pill'] as const
const iconButtons = [
  { label: '검색하기', icon: <SearchIcon /> },
  { label: '좋아요', icon: <HeartIcon /> },
  { label: '닫기', icon: <CloseIcon /> },
] as const

export default function DevPage() {
  return (
    <div
      className={css({
        maxW: '1120px',
        mx: 'auto',
        px: { base: '4', md: '6' },
        py: { base: '8', md: '12' },
      })}
    >
      <header
        className={css({
          mb: '8',
        })}
      >
        <p
          className={css({
            color: 'primary',
            fontSize: 'sm',
            fontWeight: 'semibold',
            mb: '2',
          })}
        >
          Development Only
        </p>
        <h1
          className={css({
            color: 'text.primary',
            fontSize: { base: '2xl', md: '3xl' },
            fontWeight: 'bold',
            lineHeight: 'tight',
          })}
        >
          Common UI Playground
        </h1>
        <p
          className={css({
            color: 'text.secondary',
            fontSize: 'md',
            mt: '3',
            maxW: '720px',
          })}
        >
          공통 컴포넌트의 variant, size, state를 확인하는 개발용 페이지입니다.
          실제 사용자 플로우에 포함되지 않으며 API 연동이나 비즈니스 로직을 두지
          않습니다.
        </p>
      </header>

      <div
        className={css({
          display: 'grid',
          gap: '6',
        })}
      >
        <PlaygroundSection
          title="Button"
          description="텍스트 기반 액션 버튼의 variant, size, shape, disabled, fullWidth 상태를 확인합니다."
        >
          <ExampleGroup title="Variants">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ))}
          </ExampleGroup>

          <ExampleGroup title="Sizes">
            {buttonSizes.map((size) => (
              <Button key={size} size={size}>
                size {size}
              </Button>
            ))}
          </ExampleGroup>

          <ExampleGroup title="Shapes">
            {buttonShapes.map((shape) => (
              <Button key={shape} shape={shape}>
                {shape}
              </Button>
            ))}
          </ExampleGroup>

          <ExampleGroup title="Disabled">
            <Button disabled>primary disabled</Button>
            <Button variant="outline" disabled>
              outline disabled
            </Button>
            <Button variant="ghost" disabled>
              ghost disabled
            </Button>
          </ExampleGroup>

          <ExampleGroup title="Full Width">
            <div
              className={css({
                width: '100%',
                maxW: '480px',
              })}
            >
              <Button fullWidth size="lg" shape="pill">
                fullWidth CTA
              </Button>
            </div>
          </ExampleGroup>
        </PlaygroundSection>

        <PlaygroundSection
          title="IconButton"
          description="아이콘만 있는 버튼의 기본 형태와 접근성 라벨을 확인합니다."
        >
          <ExampleGroup title="Examples">
            {iconButtons.map((item) => (
              <IconButton key={item.label} aria-label={item.label}>
                {item.icon}
              </IconButton>
            ))}
          </ExampleGroup>
        </PlaygroundSection>

        <PlaygroundSection
          title="TypeCard"
          description="여행 성향 타입 카드의 기본 상태와 MY TYPE 배지 상태를 확인합니다."
        >
          <ExampleGroup title="Default">
            <TypeCard
              icon={<TypeCardIcon />}
              title="INFP"
              subtitle="여행 감성파"
              description="느낌 따라 떠나는 자유로운 여행자"
            />
          </ExampleGroup>

          <ExampleGroup title="MY TYPE 배지 (isMyType)">
            <TypeCard
              icon={<TypeCardIcon />}
              title="INFP"
              subtitle="여행 감성파"
              description="느낌 따라 떠나는 자유로운 여행자"
              isMyType
            />
          </ExampleGroup>
        </PlaygroundSection>

        <PlaygroundSection
          title="Tag"
          description="FilterTag(다중), KeywordTag(해시태그형), MypageTag(단일 탭형)의 선택/해제 동작과 disabled 상태를 확인합니다."
        >
          <TagPlayground />
        </PlaygroundSection>

        <PlaygroundSection
          title="Header"
          description="전역 Header의 로고, 메뉴 링크, Login 버튼, 프로필 아바타 교체 구조를 확인합니다."
        >
          <PreviewFrame>
            <Header />
          </PreviewFrame>
          <PreviewFrame>
            <Header isAuthenticated />
          </PreviewFrame>
        </PlaygroundSection>

        <PlaygroundSection
          title="Footer"
          description="전역 Footer의 4컬럼 정보 구조와 하단 정책/사업자 정보 영역을 확인합니다."
        >
          <PreviewFrame>
            <Footer />
          </PreviewFrame>
        </PlaygroundSection>
      </div>
    </div>
  )
}

function PlaygroundSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section
      className={css({
        bg: 'bg.surface',
        borderWidth: '1px',
        borderColor: 'border.subtle',
        borderRadius: 'lg',
        p: { base: '4', md: '6' },
        boxShadow: 'sm',
      })}
    >
      <div
        className={css({
          mb: '5',
        })}
      >
        <h2
          className={css({
            color: 'text.primary',
            fontSize: 'xl',
            fontWeight: 'bold',
            lineHeight: 'tight',
          })}
        >
          {title}
        </h2>
        <p
          className={css({
            color: 'text.secondary',
            fontSize: 'sm',
            mt: '1',
          })}
        >
          {description}
        </p>
      </div>
      <div
        className={css({
          display: 'grid',
          gap: '5',
        })}
      >
        {children}
      </div>
    </section>
  )
}

function ExampleGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <h3
        className={css({
          color: 'text.secondary',
          fontSize: 'sm',
          fontWeight: 'semibold',
          mb: '3',
        })}
      >
        {title}
      </h3>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '3',
        })}
      >
        {children}
      </div>
    </div>
  )
}

function PreviewFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className={css({
        overflow: 'hidden',
        borderWidth: '1px',
        borderColor: 'border.subtle',
        borderRadius: 'lg',
        bg: 'bg.canvas',
      })}
    >
      {children}
    </div>
  )
}

function TypeCardIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        d="M12 2a7 7 0 1 1 0 14A7 7 0 0 1 12 2Zm0 2a5 5 0 1 0 0 10A5 5 0 0 0 12 4Zm0 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm0-6a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Z"
        fill="currentColor"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="m20 20-4.2-4.2m1.2-5.3a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M20.4 5.6a5.1 5.1 0 0 0-7.2 0L12 6.8l-1.2-1.2a5.1 5.1 0 1 0-7.2 7.2l1.2 1.2L12 21.2l7.2-7.2 1.2-1.2a5.1 5.1 0 0 0 0-7.2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="m18 6-12 12M6 6l12 12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  )
}

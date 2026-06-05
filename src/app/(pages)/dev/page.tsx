import type { ReactNode } from 'react'
import { Button, IconButton } from '@/components/common/button'
import { TypeCard } from '@/components/common/TypeCard'
import { Footer, Header } from '@/components/layout'
import { css } from '@/styled-system/css'
import { ResultCard } from '../test/_components/ResultCard'
import { ModalPlayground } from './ModalPlayground'
import { TravelCard } from '../test/_components/TravelCard'
import { StatusPlayground } from './StatusPlayground'
import { TagPlayground } from './TagPlayground'
import { PlaceCardPlayground } from './PlaceCardPlayground'
import { ReviewModalPlayground } from './ReviewModalPlayground'

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
          title="Status"
          description="EmptyState, ErrorState, LoadingState의 공통 레이아웃과 액션 영역을 확인합니다."
        >
          <StatusPlayground />
        </PlaygroundSection>

        <PlaygroundSection
          title="Modal"
          description="공통 Modal의 기본 구조, footer 영역, size 옵션과 닫기 동작을 확인합니다."
        >
          <ModalPlayground />
        </PlaygroundSection>

        <PlaygroundSection
          title="ResultCard"
          description="모임 결과 카드의 타입명, 키워드 태그, 매칭도·테스트(12문항 고정)·타입(8종 중 n) 통계 영역을 확인합니다."
        >
          <ExampleGroup title="Default (기본 이미지)">
            <div className={css({ w: 'full', maxW: '400px' })}>
              <ResultCard
                typeLabel="TYPE 0_9.0~8"
                typeName="MOONLIGHT CAST"
                title="모임 결과 보기"
                description="당신과 가장 잘 맞는 모임 유형입니다"
                keywords={['감성적', '야외활동', '소규모']}
                matchScore={64}
                typeRank={1}
              />
            </div>
          </ExampleGroup>

          <ExampleGroup title="이미지 에러 (잘못된 src → 기본 이미지 폴백)">
            <div className={css({ w: 'full', maxW: '400px' })}>
              <ResultCard
                typeLabel="TYPE 0_9.0~8"
                typeName="MOONLIGHT CAST"
                title="모임 결과 보기"
                description="당신과 가장 잘 맞는 모임 유형입니다"
                keywords={['감성적', '야외활동', '소규모']}
                thumbnailSrc="/invalid-image.png"
                thumbnailAlt="썸네일"
                matchScore={64}
                typeRank={1}
              />
            </div>
          </ExampleGroup>
        </PlaygroundSection>

        <PlaygroundSection
          title="PlaceCard"
          description="북마크/리뷰 variant의 카드 컴포넌트를 확인합니다."
        >
          <PlaceCardPlayground />
        </PlaygroundSection>

        <PlaygroundSection
          title="TravelCard"
          description="여행카드의 기본 상태, 이미지 에러 폴백, 해시태그 표시를 확인합니다."
        >
          <ExampleGroup title="Default (기본 이미지)">
            <div className={css({ w: 'full', maxW: '400px' })}>
              <TravelCard
                title="제주 서귀포"
                description="올레길·바다 힐링"
                region="제주특별자치도"
                hashtags={['올레길', '자연', '산책']}
              />
            </div>
          </ExampleGroup>

          <ExampleGroup title="이미지 에러 (잘못된 src → 기본 이미지 폴백)">
            <div className={css({ w: 'full', maxW: '400px' })}>
              <TravelCard
                title="제주 서귀포"
                description="올레길·바다 힐링"
                region="제주특별자치도"
                hashtags={['올레길', '자연', '산책']}
                imageSrc="/invalid-image.png"
                imageAlt="여행 사진"
              />
            </div>
          </ExampleGroup>
        </PlaygroundSection>

        <PlaygroundSection
          title="ReviewModal"
          description="리뷰 작성/수정/삭제 모달을 확인합니다."
        >
          <ReviewModalPlayground />
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

interface PlaygroundSectionProps {
  title: string
  description: string
  children: ReactNode
}

function PlaygroundSection({
  title,
  description,
  children,
}: PlaygroundSectionProps) {
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

interface ExampleGroupProps {
  title: string
  children: ReactNode
}

function ExampleGroup({ title, children }: ExampleGroupProps) {
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

interface PreviewFrameProps {
  children: ReactNode
}

function PreviewFrame({ children }: PreviewFrameProps) {
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

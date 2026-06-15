'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  CalendarDays,
  HelpCircle,
  RotateCcw,
  Share2,
  Sparkles,
  Waves,
} from 'lucide-react'

import { Button } from '@/components/common/button'
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/common/status'
import type { RecommendedDestination } from '@/features/result/result.types'
import { css } from '@/styled-system/css'
import type {
  TravelTypeResult,
  VectorItem,
} from '../../api/travelTypeResultApi'

export type TravelTypeResultState =
  | { status: 'loading' }
  | { status: 'error'; message?: string }
  | { status: 'empty' }
  | { status: 'success'; data: TravelTypeResult }

interface MyTravelTypeResultProps {
  state: TravelTypeResultState
  onRetryTest: () => void
}

const shellStyle = css({
  pt: '6',
})

const contentGridStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 2fr) minmax(280px, 1fr)' },
  gap: '5',
})

const lowerGridStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: 'minmax(0, 2fr) minmax(280px, 1fr)' },
  alignItems: 'stretch',
  gap: '5',
  mt: '5',
})

const heroCardStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: 'minmax(0, 1fr) auto' },
  gap: '5',
  minH: { base: 'auto', md: '260px' },
  p: { base: '5', md: '7' },
  borderRadius: 'lg',
  bg: 'primary',
  color: 'text.inverse',
})

const heroContentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4',
  minW: 0,
})

const heroBadgeStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1.5',
  alignSelf: 'flex-start',
  px: '3',
  py: '1',
  borderRadius: 'pill',
  bg: 'white/20',
  color: 'text.inverse',
  fontSize: 'xs',
  fontWeight: 'bold',
})

const heroTitleStyle = css({
  color: 'text.inverse',
  fontSize: { base: '2xl', md: '4xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const heroDescriptionStyle = css({
  maxW: '560px',
  color: 'text.inverse',
  fontSize: 'sm',
  lineHeight: 'normal',
  opacity: 0.92,
})

const tagListStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

const heroTagStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  minH: '7',
  px: '3',
  borderRadius: 'pill',
  bg: 'white/18',
  color: 'text.inverse',
  fontSize: 'xs',
  fontWeight: 'semibold',
})

const heroActionsStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
  mt: 'auto',
  pt: '3',
})

const retryButtonStyle = css({
  bg: 'bg.surface',
  borderColor: 'bg.surface',
  color: 'primary',
  _hover: { bg: 'primary.soft' },
})

const shareButtonStyle = css({
  bg: 'white/20',
  borderColor: 'white/20',
  color: 'text.inverse',
  _hover: { bg: 'white/28' },
})

const imageBoxStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: { base: 'stretch', md: 'start' },
  justifySelf: { base: 'stretch', md: 'end' },
  position: 'relative',
  width: { base: 'full', md: '24' },
  height: { base: '32', md: '24' },
  overflow: 'hidden',
  borderRadius: 'lg',
  bg: 'white/20',
  color: 'text.inverse',
})

const resultImageStyle = css({
  width: 'full',
  height: 'full',
  objectFit: 'cover',
})

const cardStyle = css({
  p: { base: '5', md: '6' },
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  bg: 'bg.surface',
})

const infoCardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '5',
  p: { base: '5', md: '6' },
  borderRadius: 'lg',
  bg: 'primary.soft',
})

const cardHeaderStyle = css({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '4',
  mb: '5',
})

const cardTitleStyle = css({
  color: 'text.primary',
  fontSize: 'md',
  fontWeight: 'bold',
})

const cardSubtitleStyle = css({
  mt: '1',
  color: 'text.secondary',
  fontSize: 'sm',
  lineHeight: 'normal',
})

const infoListStyle = css({
  display: 'grid',
  gap: '4',
})

const infoRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '4',
  fontSize: 'sm',
})

const infoLabelStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  color: 'text.secondary',
})

const infoValueStyle = css({
  color: 'text.primary',
  fontWeight: 'semibold',
  textAlign: 'right',
})

const primaryValueStyle = css({
  color: 'primary',
})

const vectorListStyle = css({
  display: 'grid',
  gap: '5',
})

const vectorHeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '3',
  mb: '2',
})

const vectorLabelStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  minW: 0,
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'semibold',
})

const vectorIconStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '7',
  height: '7',
  borderRadius: 'md',
  bg: 'primary.soft',
  color: 'primary',
})

const vectorValueStyle = css({
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'bold',
})

const progressTrackStyle = css({
  height: '2',
  overflow: 'hidden',
  borderRadius: 'pill',
  bg: 'bg.muted',
})

const progressBarStyle = css({
  height: 'full',
  borderRadius: 'pill',
  bg: 'primary',
  width: 'var(--progress-value)',
})

const destinationCardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  h: 'full',
  p: { base: '5', md: '6' },
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  bg: 'bg.surface',
})

const destinationListStyle = css({
  display: 'grid',
  gap: '4',
  flex: 1,
})

const destinationItemStyle = css({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  alignItems: 'center',
  gap: '4',
  p: '4',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'md',
  bg: 'bg.canvas',
})

const rankStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '9',
  height: '9',
  borderRadius: 'md',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'md',
  fontWeight: 'bold',
})

const destinationContentStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2',
  minW: 0,
})

const destinationNameStyle = css({
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const matchRateStyle = css({
  flexShrink: 0,
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'bold',
})

const compactEmptyStyle = css({
  py: '8',
  color: 'text.secondary',
  fontSize: 'sm',
  textAlign: 'center',
})

function formatDate(value?: string) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replace(/\. /g, '.')
    .replace(/\.$/, '')
}

function ResultImage({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <span aria-hidden="true">
        <Waves size={42} />
      </span>
    )
  }

  return (
    <Image
      alt={alt}
      className={resultImageStyle}
      fill
      onError={() => setHasError(true)}
      src={src}
    />
  )
}

function TravelTypeHeroCard({
  result,
  onRetryTest,
}: {
  result: TravelTypeResult
  onRetryTest: () => void
}) {
  return (
    <article className={heroCardStyle}>
      <div className={heroContentStyle}>
        <span className={heroBadgeStyle}>
          <Sparkles aria-hidden="true" size={14} />
          나의 여행 성향
        </span>
        <div>
          <h3 className={heroTitleStyle}>{result.name}</h3>
          <p className={heroDescriptionStyle}>{result.description}</p>
        </div>
        {result.type_tags.length > 0 && (
          <div className={tagListStyle}>
            {result.type_tags.slice(0, 6).map((tag) => (
              <span key={tag} className={heroTagStyle}>
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className={heroActionsStyle}>
          <Button
            className={retryButtonStyle}
            onClick={onRetryTest}
            shape="pill"
            variant="outline"
          >
            <RotateCcw aria-hidden="true" size={16} />
            다시 테스트
          </Button>
          <Button className={shareButtonStyle} shape="pill" variant="outline">
            <Share2 aria-hidden="true" size={16} />
            결과 공유
          </Button>
        </div>
      </div>
      <div className={imageBoxStyle}>
        <ResultImage
          alt={`${result.name} 대표 이미지`}
          src={result.image_url}
        />
      </div>
    </article>
  )
}

function TravelTypeInfoCard({ result }: { result: TravelTypeResult }) {
  const updatedAt = formatDate(result.updated_at)

  return (
    <aside className={infoCardStyle}>
      <div className={cardHeaderStyle}>
        <div>
          <h3 className={cardTitleStyle}>테스트 정보</h3>
          <p className={cardSubtitleStyle}>최근 저장된 성향 결과예요</p>
        </div>
      </div>
      <div className={infoListStyle}>
        {updatedAt && (
          <div className={infoRowStyle}>
            <span className={infoLabelStyle}>
              <CalendarDays aria-hidden="true" size={15} />
              테스트 일자
            </span>
            <span className={infoValueStyle}>{updatedAt}</span>
          </div>
        )}
        <div className={infoRowStyle}>
          <span className={infoLabelStyle}>성향 유형</span>
          <span className={`${infoValueStyle} ${primaryValueStyle}`}>
            {result.name}
          </span>
        </div>
        <div className={infoRowStyle}>
          <span className={infoLabelStyle}>유형 코드</span>
          <span className={infoValueStyle}>{result.type_key}</span>
        </div>
        <div className={infoRowStyle}>
          <span className={infoLabelStyle}>
            <HelpCircle aria-hidden="true" size={15} />
            정확도
          </span>
          <span className={`${infoValueStyle} ${primaryValueStyle}`}>
            {result.accuracy}%
          </span>
        </div>
      </div>
    </aside>
  )
}

function TravelTypeVectorCard({ vectors }: { vectors: VectorItem[] }) {
  return (
    <article className={cardStyle}>
      <div className={cardHeaderStyle}>
        <div>
          <h3 className={cardTitleStyle}>성향 상세 분석</h3>
          <p className={cardSubtitleStyle}>6축 여행 성향 지표예요</p>
        </div>
        <span className={cardSubtitleStyle}>총 {vectors.length}개 지표</span>
      </div>

      {vectors.length > 0 ? (
        <div className={vectorListStyle}>
          {vectors.map((item) => (
            <div key={item.label}>
              <div className={vectorHeaderStyle}>
                <span className={vectorLabelStyle}>
                  <span className={vectorIconStyle}>
                    <Waves aria-hidden="true" size={16} />
                  </span>
                  {item.label}
                </span>
                <span className={vectorValueStyle}>{item.value}%</span>
              </div>
              <div className={progressTrackStyle}>
                <div
                  className={progressBarStyle}
                  style={
                    {
                      '--progress-value': `${item.value}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={compactEmptyStyle}>표시할 성향 지표가 없어요.</p>
      )}
    </article>
  )
}

function RecommendedDestinationCard({
  destinations,
}: {
  destinations: RecommendedDestination[]
}) {
  return (
    <aside className={destinationCardStyle}>
      <div className={cardHeaderStyle}>
        <div>
          <h3 className={cardTitleStyle}>추천 여행지</h3>
          <p className={cardSubtitleStyle}>성향과 잘 맞는 장소예요</p>
        </div>
      </div>

      {destinations.length > 0 ? (
        <div className={destinationListStyle}>
          {destinations.slice(0, 6).map((destination, index) => (
            <article key={destination.id} className={destinationItemStyle}>
              <span className={rankStyle}>{index + 1}</span>
              <div className={destinationContentStyle}>
                <h4 className={destinationNameStyle}>{destination.title}</h4>
                {destination.matchRate !== undefined && (
                  <span className={matchRateStyle}>
                    {destination.matchRate}%
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className={compactEmptyStyle}>추천 여행지가 아직 없어요.</p>
      )}
    </aside>
  )
}

export function MyTravelTypeResult({
  state,
  onRetryTest,
}: MyTravelTypeResultProps) {
  if (state.status === 'loading') {
    return (
      <div className={shellStyle}>
        <LoadingState
          title="성향 테스트 결과를 불러오는 중이에요"
          description="나에게 맞는 여행 성향 정보를 확인하고 있어요."
        />
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className={shellStyle}>
        <ErrorState
          title="성향 테스트 결과를 불러오지 못했어요"
          description={state.message ?? '잠시 후 다시 시도해주세요.'}
        />
      </div>
    )
  }

  if (state.status === 'empty') {
    return (
      <div className={shellStyle}>
        <EmptyState
          title="아직 성향 테스트 결과가 없어요"
          description="나의 여행 성향을 찾아보고 맞춤 여행지를 확인해보세요."
          actionLabel="테스트 하러 가기"
          onAction={onRetryTest}
        />
      </div>
    )
  }

  const { data } = state

  return (
    <section className={shellStyle} aria-label="성향 테스트 결과">
      <div className={contentGridStyle}>
        <TravelTypeHeroCard onRetryTest={onRetryTest} result={data} />
        <TravelTypeInfoCard result={data} />
      </div>
      <div className={lowerGridStyle}>
        <TravelTypeVectorCard vectors={data.result_vector} />
        <RecommendedDestinationCard destinations={data.destinations} />
      </div>
    </section>
  )
}

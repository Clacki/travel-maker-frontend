import Image from 'next/image'
import { CalendarDays, Lock, UserRound } from 'lucide-react'
import { KeywordTag } from '@/components/common/tag'
import { OwnerBadge } from './OwnerBadge'
import type { TripCourseDetail } from '../types/tripDetail'
import { css } from '@/styled-system/css'

const cardStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: '1.1fr 0.9fr' },
  gap: { base: '6', lg: '8' },
  p: { base: '5', md: '6' },
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'xl',
  boxShadow: 'sm',
})

const contentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minW: 0,
})

const labelRowStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

const eyebrowStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  minH: '8',
  px: '3',
  borderRadius: 'pill',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'xs',
  fontWeight: 'bold',
})

const titleStyle = css({
  mt: '4',
  color: 'text.primary',
  fontSize: { base: '2xl', md: '3xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const descriptionStyle = css({
  mt: '3',
  color: 'text.secondary',
  fontSize: { base: 'sm', md: 'md' },
  lineHeight: 'relaxed',
})

const tagListStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
  mt: '4',
})

const dividerStyle = css({
  my: '5',
  borderTopWidth: '1px',
  borderTopColor: 'border.subtle',
})

const metaGridStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
  gap: '3',
})

const metaItemStyle = css({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '2',
  color: 'text.secondary',
  fontSize: 'sm',
})

const metaStrongStyle = css({
  color: 'text.primary',
  fontWeight: 'semibold',
})

const imageWrapStyle = css({
  position: 'relative',
  minH: { base: '220px', md: '300px' },
  overflow: 'hidden',
  borderRadius: 'lg',
  bg: 'bg.muted',
})

const imageStyle = css({
  objectFit: 'cover',
})

const imageCaptionStyle = css({
  position: 'absolute',
  left: '4',
  bottom: '4',
  maxW: 'calc(100% - 32px)',
  px: '3',
  py: '2',
  borderRadius: 'pill',
  bg: 'bg.surface',
  color: 'text.primary',
  fontSize: 'xs',
  fontWeight: 'semibold',
  boxShadow: 'sm',
})

const privateBadgeStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  minH: '8',
  px: '3',
  borderRadius: 'pill',
  bg: 'bg.muted',
  color: 'text.primary',
  fontSize: 'xs',
  fontWeight: 'bold',
})

interface TripDetailHeroProps {
  trip: TripCourseDetail
}

export function TripDetailHero({ trip }: TripDetailHeroProps) {
  return (
    <section className={cardStyle} aria-labelledby="trip-detail-title">
      <div className={contentStyle}>
        <div className={labelRowStyle}>
          <span className={eyebrowStyle}>TRAVEL COURSE</span>
          <OwnerBadge authorId={trip.author.id} />
          {!trip.isPublic ? (
            <span className={privateBadgeStyle}>
              <Lock size={13} aria-hidden="true" />
              비공개
            </span>
          ) : null}
        </div>

        <h1 id="trip-detail-title" className={titleStyle}>
          {trip.title}
        </h1>
        <p className={descriptionStyle}>{trip.description}</p>

        <div className={tagListStyle} aria-label="코스 태그">
          <KeywordTag label={trip.region} variant="result" />
          {trip.tags.map((tag) => (
            <KeywordTag key={tag} label={tag} variant="result" />
          ))}
        </div>

        <div className={dividerStyle} />

        <div className={metaGridStyle}>
          <span className={metaItemStyle}>
            <UserRound size={16} aria-hidden="true" />
            <span className={metaStrongStyle}>{trip.author.nickname}</span>
          </span>
          <span className={metaItemStyle}>
            <CalendarDays size={16} aria-hidden="true" />
            {trip.durationLabel} · Day {trip.days.length}
          </span>
          <span className={metaItemStyle}>
            장소 {trip.placeCount}개 · {trip.createdAt} 생성
          </span>
        </div>
      </div>

      <div className={imageWrapStyle}>
        <Image
          src={trip.thumbnailUrl}
          alt={`${trip.title} 대표 이미지`}
          fill
          sizes="(max-width: 1024px) 100vw, 460px"
          className={imageStyle}
          priority
        />
        <span className={imageCaptionStyle}>
          {trip.region} · 선택한 장소 순서 기준 코스
        </span>
      </div>
    </section>
  )
}

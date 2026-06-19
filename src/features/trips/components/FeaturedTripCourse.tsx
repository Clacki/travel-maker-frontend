import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Clock } from 'lucide-react'
import { KeywordTag } from '@/components/common/tag'
import { ROUTES } from '@/constants/routes'
import type { TripCourse } from '../types/trip'
import { css } from '@/styled-system/css'

const sectionStyle = css({
  display: 'grid',
  gap: '4',
})

const sectionLabelStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'bold',
})

const cardStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: '1fr 1.1fr' },
  overflow: 'hidden',
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'xl',
  boxShadow: 'sm',
})

const contentStyle = css({
  p: { base: '6', md: '8' },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minH: { base: 'auto', lg: '320px' },
})

const badgeRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '3',
})

const badgeStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  px: '3',
  minH: '8',
  borderRadius: 'pill',
  bg: 'primary',
  color: 'text.inverse',
  fontSize: 'xs',
  fontWeight: 'bold',
})

const titleStyle = css({
  mt: '5',
  color: 'text.primary',
  fontSize: { base: 'xl', md: '2xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const descriptionStyle = css({
  mt: '3',
  color: 'text.secondary',
  fontSize: 'sm',
  lineHeight: 'relaxed',
})

const tagListStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3',
  mt: '5',
})

const metaListStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4',
  mt: '6',
  color: 'text.secondary',
  fontSize: 'sm',
})

const metaItemStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
})

const linkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2',
  alignSelf: 'flex-start',
  mt: '6',
  minH: '10',
  px: '5',
  borderRadius: 'sm',
  bg: 'primary',
  color: 'text.inverse',
  fontSize: 'sm',
  fontWeight: 'semibold',
  transitionProperty: 'background-color, box-shadow',
  transitionDuration: '150ms',
  _hover: { bg: 'primary.hover' },
  _focusVisible: { outline: 'none', boxShadow: 'focus' },
})

const imageWrapStyle = css({
  position: 'relative',
  minH: { base: '240px', md: '320px' },
  overflow: 'hidden',
})

const imageStyle = css({
  objectFit: 'cover',
})

const locationPillStyle = css({
  position: 'absolute',
  right: '4',
  bottom: '4',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '2',
  maxW: 'calc(100% - 32px)',
  px: '3',
  minH: '9',
  borderRadius: 'pill',
  bg: 'bg.surface',
  color: 'text.secondary',
  fontSize: 'xs',
  fontWeight: 'semibold',
  boxShadow: 'sm',
})

interface FeaturedTripCourseProps {
  course: TripCourse
}

export function FeaturedTripCourse({ course }: FeaturedTripCourseProps) {
  return (
    <section className={sectionStyle} aria-labelledby="featured-trip-title">
      <h2 id="featured-trip-title" className={sectionLabelStyle}>
        <Clock size={16} aria-hidden="true" />
        이번 주 최신 코스
      </h2>

      <article className={cardStyle}>
        <div className={contentStyle}>
          <div className={badgeRowStyle}>
            <span className={badgeStyle}>최신 코스</span>
          </div>

          <h3 className={titleStyle}>{course.title}</h3>
          <p className={descriptionStyle}>{course.description}</p>

          <div className={tagListStyle} aria-label="테마">
            {course.themes.map((theme) => (
              <KeywordTag key={theme} label={theme} variant="result" />
            ))}
          </div>

          <div className={metaListStyle}>
            <span className={metaItemStyle}>
              <MapPin size={15} aria-hidden="true" />
              장소 {course.placeCount}개
            </span>
          </div>

          <Link
            href={ROUTES.TRIP_DETAIL(String(course.id))}
            className={linkStyle}
          >
            코스 보러가기
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className={imageWrapStyle}>
          <Image
            src={course.imageUrl}
            alt={`${course.title} 대표 이미지`}
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className={imageStyle}
            priority
          />
          <span className={locationPillStyle}>
            <MapPin size={14} aria-hidden="true" />
            {course.region} 대표 코스 외 {Math.max(course.placeCount - 1, 0)}곳
          </span>
        </div>
      </article>
    </section>
  )
}

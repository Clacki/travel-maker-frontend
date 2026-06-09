import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { KeywordTag } from '@/components/common/tag'
import { ROUTES } from '@/constants/routes'
import type { TripCourseDetail } from '../types/tripDetail'
import { css } from '@/styled-system/css'

const sectionStyle = css({
  display: 'grid',
  gap: '5',
})

const headerStyle = css({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '4',
})

const titleGroupStyle = css({
  display: 'grid',
  gap: '2',
})

const eyebrowStyle = css({
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'bold',
})

const titleStyle = css({
  color: 'text.primary',
  fontSize: { base: 'xl', md: '2xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const gridStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
  gap: '4',
})

const cardStyle = css({
  overflow: 'hidden',
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  boxShadow: 'sm',
  cursor: 'pointer',
  transitionProperty: 'border-color, box-shadow, transform',
  transitionDuration: '150ms',
  _hover: {
    borderColor: 'border',
    boxShadow: 'md',
    transform: 'translateY(-2px)',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const imageWrapStyle = css({
  position: 'relative',
  aspectRatio: '16 / 10',
  bg: 'bg.muted',
})

const imageStyle = css({
  objectFit: 'cover',
})

const contentStyle = css({
  display: 'grid',
  gap: '3',
  p: '4',
})

const cardTitleStyle = css({
  color: 'text.primary',
  fontSize: 'md',
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const linkHintStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  color: 'text.secondary',
  fontSize: 'sm',
  fontWeight: 'semibold',
})

interface SimilarTripCoursesProps {
  trip: TripCourseDetail
}

export function SimilarTripCourses({ trip }: SimilarTripCoursesProps) {
  return (
    <section className={sectionStyle} aria-labelledby="similar-trips-title">
      <div className={headerStyle}>
        <div className={titleGroupStyle}>
          <span className={eyebrowStyle}>SIMILAR COURSES</span>
          <h2 id="similar-trips-title" className={titleStyle}>
            비슷한 여행 코스
          </h2>
        </div>
      </div>

      <div className={gridStyle}>
        {trip.similarCourses.map((course) => (
          <Link
            key={course.id}
            href={ROUTES.TRIP_DETAIL(String(course.id))}
            className={cardStyle}
          >
            <div className={imageWrapStyle}>
              <Image
                src={course.thumbnailUrl}
                alt={`${course.title} 대표 이미지`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={imageStyle}
              />
            </div>
            <div className={contentStyle}>
              <KeywordTag label={course.region} variant="result" />
              <h3 className={cardTitleStyle}>{course.title}</h3>
              <span className={linkHintStyle}>
                자세히 보기
                <ArrowRight size={14} aria-hidden="true" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

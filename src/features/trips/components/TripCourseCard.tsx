import Image from 'next/image'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { KeywordTag } from '@/components/common/tag'
import { ROUTES } from '@/constants/routes'
import type { TripCourse } from '../types/trip'
import { css } from '@/styled-system/css'

const cardStyle = css({
  display: 'block',
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
  aspectRatio: '4 / 3',
  overflow: 'hidden',
  bg: 'bg.muted',
})

const imageStyle = css({
  objectFit: 'cover',
})

const regionPillStyle = css({
  position: 'absolute',
  top: '3',
  left: '3',
  boxShadow: 'sm',
  borderRadius: 'pill',
})

const contentStyle = css({
  p: '5',
})

const themeRowStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '3',
  minH: '5',
})

const titleStyle = css({
  mt: '4',
  color: 'text.primary',
  fontSize: 'lg',
  fontWeight: 'bold',
  lineHeight: 'tight',
  lineClamp: 1,
})

const descriptionStyle = css({
  mt: '3',
  minH: '42px',
  color: 'text.secondary',
  fontSize: 'sm',
  lineHeight: 'normal',
  lineClamp: 2,
})

const metaRowStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  mt: '6',
  color: 'text.secondary',
  fontSize: 'xs',
})

const footerStyle = css({
  display: 'flex',
  alignItems: 'center',
  mt: '5',
  pt: '4',
  borderTopWidth: '1px',
  borderTopColor: 'border.subtle',
})

const dateStyle = css({
  color: 'text.secondary',
  fontSize: 'xs',
  fontWeight: 'semibold',
})

interface TripCourseCardProps {
  course: TripCourse
}

export function TripCourseCard({ course }: TripCourseCardProps) {
  return (
    <Link
      href={ROUTES.TRIP_DETAIL(String(course.id))}
      className={cardStyle}
      aria-label={`${course.title} 상세 보기`}
    >
      <div className={imageWrapStyle}>
        <Image
          src={course.imageUrl}
          alt={`${course.title} 대표 이미지`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={imageStyle}
        />
        <span className={regionPillStyle}>
          <KeywordTag label={course.region} variant="result" />
        </span>
      </div>

      <div className={contentStyle}>
        <div className={themeRowStyle}>
          {course.themes.slice(0, 2).map((theme) => (
            <KeywordTag key={theme} label={theme} variant="result" />
          ))}
        </div>

        <h3 className={titleStyle}>{course.title}</h3>
        <p className={descriptionStyle}>{course.description}</p>

        <div className={metaRowStyle}>
          <MapPin size={13} aria-hidden="true" />
          장소 {course.placeCount}개
        </div>

        <div className={footerStyle}>
          <time className={dateStyle}>{course.createdAt}</time>
        </div>
      </div>
    </Link>
  )
}

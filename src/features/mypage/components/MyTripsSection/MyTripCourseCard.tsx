'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { KeyboardEvent, MouseEvent } from 'react'
import {
  CalendarDays,
  ImageIcon,
  MapPin,
  Pencil,
  PlusCircle,
  Trash2,
} from 'lucide-react'

import { IconButton } from '@/components/common/button'
import { KeywordTag } from '@/components/common/tag'
import { ROUTES } from '@/constants/routes'
import { css } from '@/styled-system/css'

import type { MyTripCourse } from '../../types/mypage'

interface MyTripCourseCardProps {
  course: MyTripCourse
  canManage: boolean
  onDeleteTrip?: (routeId: number) => void
}

const cardStyle = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: '220px minmax(0, 1fr) auto' },
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
    borderColor: 'primary',
    boxShadow: 'md',
    transform: 'translateY(-1px)',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const imageWrapStyle = css({
  position: 'relative',
  minH: { base: '180px', md: 'full' },
  aspectRatio: { base: '16 / 9', md: 'auto' },
  overflow: 'hidden',
  bg: 'bg.muted',
})

const imageStyle = css({
  objectFit: 'cover',
})

const fallbackStyle = css({
  display: 'flex',
  height: 'full',
  minH: { base: '180px', md: '196px' },
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2',
  color: 'text.secondary',
  bg: 'primary.soft',
  fontSize: 'sm',
})

const contentStyle = css({
  minW: 0,
  p: { base: '4', md: '5' },
})

const titleStyle = css({
  color: 'text.primary',
  fontSize: { base: 'lg', md: 'xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
  lineClamp: 1,
})

const metaRowStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: { base: '2', md: '4' },
  mt: '3',
  color: 'text.secondary',
  fontSize: 'sm',
})

const metaItemStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  minW: 0,
})

const dayChipStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  minH: '7',
  px: '3',
  borderRadius: 'sm',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'xs',
  fontWeight: 'medium',
})

const descriptionStyle = css({
  mt: '4',
  color: 'text.primary',
  fontSize: 'sm',
  lineHeight: 'relaxed',
  lineClamp: 2,
})

const tagsStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
  mt: '4',
})

const actionsStyle = css({
  display: 'flex',
  alignItems: { base: 'flex-start', md: 'center' },
  justifyContent: { base: 'flex-end', md: 'center' },
  p: { base: '0 4 4', md: '5' },
})

const actionsInnerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
})

const editButtonStyle = css({
  borderRadius: 'pill',
  color: 'text.secondary',
})

const deleteButtonStyle = css({
  borderRadius: 'pill',
  color: 'text.secondary',
  _hover: {
    color: 'red.500',
  },
})

function formatDate(date?: string) {
  if (!date) {
    return null
  }

  return date.replaceAll('-', '.')
}

function formatDateRange(startDate?: string, endDate?: string) {
  const start = formatDate(startDate)
  const end = formatDate(endDate)

  if (start && end) {
    return `${start} - ${end}`
  }

  return start ?? end ?? '일정 미정'
}

export function MyTripCourseCard({
  course,
  canManage,
  onDeleteTrip,
}: MyTripCourseCardProps) {
  const router = useRouter()

  const detailHref = ROUTES.TRIP_DETAIL(String(course.routeId))
  const editHref = ROUTES.TRIP_EDIT(String(course.routeId))

  const handleNavigate = () => {
    router.push(detailHref)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleNavigate()
    }
  }

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    router.push(editHref)
  }

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onDeleteTrip?.(course.routeId)
  }

  return (
    <article
      className={cardStyle}
      role="link"
      tabIndex={0}
      aria-label={`${course.title} 상세 보기`}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
    >
      <div className={imageWrapStyle}>
        {course.imageUrl ? (
          <Image
            src={course.imageUrl}
            alt={`${course.title} 대표 이미지`}
            fill
            sizes="(max-width: 768px) 100vw, 220px"
            className={imageStyle}
          />
        ) : (
          <div className={fallbackStyle}>
            <ImageIcon size={28} aria-hidden="true" />
            <span>대표 이미지 없음</span>
          </div>
        )}
      </div>

      <div className={contentStyle}>
        <h3 className={titleStyle}>{course.title}</h3>

        <div className={metaRowStyle}>
          <span className={metaItemStyle}>
            <MapPin size={14} aria-hidden="true" />
            {course.regionName ?? '지역 미정'}
          </span>
          <span className={metaItemStyle}>
            <CalendarDays size={14} aria-hidden="true" />
            {formatDateRange(course.startDate, course.endDate)}
          </span>
          {course.dayCount ? (
            <span className={dayChipStyle}>{course.dayCount}일 일정</span>
          ) : null}
          {course.placeCount ? (
            <span className={metaItemStyle}>
              <PlusCircle size={14} aria-hidden="true" />
              장소 {course.placeCount}개
            </span>
          ) : null}
        </div>

        <p className={descriptionStyle}>{course.description}</p>

        {course.tags.length > 0 ? (
          <div className={tagsStyle}>
            {course.tags.map((tag) => (
              <KeywordTag key={tag} label={tag} />
            ))}
          </div>
        ) : null}
      </div>

      {canManage ? (
        <div className={actionsStyle}>
          <div className={actionsInnerStyle}>
            <IconButton
              aria-label={`${course.title} 수정`}
              size="sm"
              className={editButtonStyle}
              onClick={handleEditClick}
            >
              <Pencil size={15} aria-hidden="true" />
            </IconButton>
            <IconButton
              aria-label={`${course.title} 삭제`}
              size="sm"
              className={deleteButtonStyle}
              onClick={handleDeleteClick}
            >
              <Trash2 size={15} aria-hidden="true" />
            </IconButton>
          </div>
        </div>
      ) : null}
    </article>
  )
}

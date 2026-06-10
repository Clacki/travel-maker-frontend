import Link from 'next/link'
import { ArrowLeft, Pencil, Share2, Trash2 } from 'lucide-react'
import { Button } from '@/components/common/button'
import { ROUTES } from '@/constants/routes'
import type { TripCourseDetail } from '../types/tripDetail'
import { css } from '@/styled-system/css'

const actionsStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '3',
  p: { base: '4', md: '5' },
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
})

const groupStyle = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

const linkButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2',
  minH: '10',
  px: '5',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'sm',
  bg: 'bg.surface',
  color: 'text.primary',
  fontSize: 'md',
  fontWeight: 'semibold',
  lineHeight: 'tight',
  transitionProperty: 'background-color, border-color, color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    borderColor: 'primary',
    color: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const editLinkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2',
  minH: '10',
  px: '5',
  borderWidth: '1px',
  borderColor: 'primary',
  borderRadius: 'sm',
  bg: 'primary',
  color: 'text.inverse',
  fontSize: 'md',
  fontWeight: 'semibold',
  lineHeight: 'tight',
  transitionProperty: 'background-color, border-color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    bg: 'primary.hover',
    borderColor: 'primary.hover',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const dangerButtonStyle = css({
  color: 'text.secondary',
  _hover: {
    borderColor: 'primary',
    color: 'primary',
  },
})

interface TripDetailActionsProps {
  trip: TripCourseDetail
}

export function TripDetailActions({ trip }: TripDetailActionsProps) {
  return (
    <section className={actionsStyle} aria-label="코스 상세 작업">
      <Link href={ROUTES.TRIPS} className={linkButtonStyle}>
        <ArrowLeft size={17} aria-hidden="true" />
        목록으로
      </Link>

      <div className={groupStyle}>
        <Button variant="neutral">
          <Share2 size={17} aria-hidden="true" />
          공유하기
        </Button>
        {trip.isOwner ? (
          <>
            <Link
              href={ROUTES.TRIP_EDIT(String(trip.id))}
              className={editLinkStyle}
            >
              <Pencil size={17} aria-hidden="true" />
              수정하기
            </Link>
            <Button variant="neutral" className={dangerButtonStyle}>
              <Trash2 size={17} aria-hidden="true" />
              삭제하기
            </Button>
          </>
        ) : null}
      </div>
    </section>
  )
}

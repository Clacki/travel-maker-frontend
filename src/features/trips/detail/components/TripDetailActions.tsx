'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Pencil, Share2, Trash2 } from 'lucide-react'
import { isAxiosError } from 'axios'
import { LoginModal } from '@/components/auth/LoginModal'
import { Button } from '@/components/common/button'
import { ROUTES } from '@/constants/routes'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { Toast } from '@/components/common/Toast/Toast'
import { deleteRoute } from '@/features/trips/api/routesApi'
import type { TripCourseDetail } from '../types/tripDetail'
import { css, cx } from '@/styled-system/css'

const actionsStyle = css({
  display: { base: 'grid', md: 'flex' },
  gridTemplateColumns: {
    base: 'repeat(2, minmax(0, 1fr))',
    md: 'none',
  },
  flexWrap: { md: 'wrap' },
  alignItems: 'center',
  justifyContent: { md: 'space-between' },
  gap: { base: '2', md: '3' },
  p: { base: '4', md: '5' },
  bg: 'bg.surface',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
})

const ownerActionsStyle = css({
  gridTemplateColumns: {
    base: 'repeat(4, minmax(0, 1fr))',
    md: 'none',
  },
})

const groupStyle = css({
  display: { base: 'contents', md: 'flex' },
  flexWrap: { md: 'wrap' },
  gap: '2',
})

const actionItemStyle = css({
  width: { base: 'full', md: 'auto' },
  minH: { base: '12', md: '10' },
  minW: 0,
  gap: { base: '0', md: '2' },
  px: { base: '0', md: '5' },
  fontSize: { base: 'xs', md: 'md' },
})

const actionIconStyle = css({
  flexShrink: 0,
  width: { base: '5', md: 'auto' },
  height: { base: '5', md: 'auto' },
})

const actionLabelStyle = css({
  display: { base: 'none', md: 'inline' },
  minW: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
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

interface TripDetailActionsProps {
  trip: TripCourseDetail
}

export function TripDetailActions({ trip }: TripDetailActionsProps) {
  const router = useRouter()
  const userProfile = useUserProfileStore((state) => state.userProfile)
  const isOwner =
    trip.isOwner ||
    (userProfile !== null && Number(userProfile.id) === trip.author.id)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
    } catch {}

    setToastVisible(true)
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2000)
  }, [])

  const handleDelete = async () => {
    const confirmed = window.confirm(
      '정말로 이 코스를 삭제하시겠습니까? 삭제된 코스는 복구할 수 없습니다.'
    )
    if (!confirmed) {
      return
    }

    try {
      await deleteRoute(trip.id)
      router.push(ROUTES.TRIPS)
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        setIsLoginModalOpen(true)
        return
      }

      if (isAxiosError(error) && error.response?.status === 403) {
        alert('이 코스를 삭제할 권한이 없습니다.')
        return
      }

      alert('코스 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <>
      <section
        className={cx(actionsStyle, isOwner && ownerActionsStyle)}
        aria-label="코스 상세 작업"
      >
        <Link
          href={ROUTES.TRIPS}
          className={cx(linkButtonStyle, actionItemStyle)}
          aria-label="목록으로"
        >
          <ArrowLeft size={17} aria-hidden="true" className={actionIconStyle} />
          <span className={actionLabelStyle}>목록으로</span>
        </Link>

        <div className={groupStyle}>
          <Button
            variant="neutral"
            className={actionItemStyle}
            aria-label="공유하기"
            onClick={handleShare}
          >
            <Share2 size={17} aria-hidden="true" className={actionIconStyle} />
            <span className={actionLabelStyle}>공유하기</span>
          </Button>
          {isOwner ? (
            <>
              <Link
                href={ROUTES.TRIP_EDIT(String(trip.id))}
                className={cx(editLinkStyle, actionItemStyle)}
                aria-label="수정하기"
              >
                <Pencil
                  size={17}
                  aria-hidden="true"
                  className={actionIconStyle}
                />
                <span className={actionLabelStyle}>수정하기</span>
              </Link>
              <Button
                variant="danger"
                className={actionItemStyle}
                aria-label="삭제하기"
                onClick={handleDelete}
              >
                <Trash2
                  size={17}
                  aria-hidden="true"
                  className={actionIconStyle}
                />
                <span className={actionLabelStyle}>삭제하기</span>
              </Button>
            </>
          ) : null}
        </div>
      </section>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
      <Toast message="링크가 복사되었습니다" visible={toastVisible} />
    </>
  )
}

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Pencil, Share2, Trash2 } from 'lucide-react'
import { isAxiosError } from 'axios'
import { LoginModal } from '@/components/auth/LoginModal'
import { Button } from '@/components/common/button'
import { ROUTES } from '@/constants/routes'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { deleteRoute } from '@/features/trips/api/routesApi'
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
  const router = useRouter()
  const userProfile = useUserProfileStore((state) => state.userProfile)
  const isOwner =
    trip.isOwner ||
    (userProfile !== null && Number(userProfile.id) === trip.author.id)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle'
  )
  const shareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (shareTimerRef.current) {
        clearTimeout(shareTimerRef.current)
      }
    }
  }, [])

  const handleShare = useCallback(async () => {
    const url = window.location.href

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: trip.title, url })
        return
      } catch {
        // 사용자 취소 또는 미지원 시 클립보드 복사로 폴백
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setShareStatus('copied')
      if (shareTimerRef.current) {
        clearTimeout(shareTimerRef.current)
      }
      shareTimerRef.current = setTimeout(() => setShareStatus('idle'), 1500)
    } catch {
      setShareStatus('failed')
      if (shareTimerRef.current) {
        clearTimeout(shareTimerRef.current)
      }
      shareTimerRef.current = setTimeout(() => setShareStatus('idle'), 2000)
    }
  }, [trip.title])

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
      <section className={actionsStyle} aria-label="코스 상세 작업">
        <Link href={ROUTES.TRIPS} className={linkButtonStyle}>
          <ArrowLeft size={17} aria-hidden="true" />
          목록으로
        </Link>

        <div className={groupStyle}>
          <Button
            variant="neutral"
            onClick={handleShare}
            disabled={shareStatus !== 'idle'}
          >
            {shareStatus === 'copied' ? (
              <Check size={17} aria-hidden="true" />
            ) : (
              <Share2 size={17} aria-hidden="true" />
            )}
            {shareStatus === 'idle' && '공유하기'}
            {shareStatus === 'copied' && '링크 복사됨!'}
            {shareStatus === 'failed' && 'URL을 직접 복사해주세요'}
          </Button>
          {isOwner ? (
            <>
              <Link
                href={ROUTES.TRIP_EDIT(String(trip.id))}
                className={editLinkStyle}
              >
                <Pencil size={17} aria-hidden="true" />
                수정하기
              </Link>
              <Button
                variant="neutral"
                className={dangerButtonStyle}
                onClick={handleDelete}
              >
                <Trash2 size={17} aria-hidden="true" />
                삭제하기
              </Button>
            </>
          ) : null}
        </div>
      </section>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  )
}

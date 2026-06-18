'use client'

import { useRef, useState } from 'react'

import { css, cx } from '@/styled-system/css'

import { buttonRecipe } from '@/components/common/button/Button'
import { patchUserAvatar } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { loadCurrentUserProfile } from '@/features/auth/utils/currentUserProfile'

interface AvatarButtonProps {
  travelTypeId: number
}

const avatarButtonStyle = css({
  alignSelf: 'flex-start',
  cursor: 'pointer',
})

export function AvatarButton({ travelTypeId }: AvatarButtonProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized)
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const isLoadingRef = useRef(false)

  // 인증 초기화 전이거나 비로그인 상태면 버튼 미노출
  if (!isAuthInitialized || !isLoggedIn) {
    return null
  }

  const handleClick = async () => {
    if (isLoadingRef.current) {
      return
    }
    isLoadingRef.current = true
    setStatus('loading')

    try {
      const result = await patchUserAvatar(travelTypeId)
      if (result.updated) {
        await loadCurrentUserProfile()
        setStatus('success')
      } else {
        setStatus('error')
      }
      setTimeout(() => setStatus('idle'), 2000)
    } catch (error) {
      console.error('프로필 이미지 지정 실패:', error)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    } finally {
      isLoadingRef.current = false
    }
  }

  const label = {
    idle: '프로필 이미지로 지정',
    loading: '저장 중...',
    success: '저장 완료!',
    error: '오류 발생',
  }[status]

  return (
    <button
      type="button"
      className={cx(
        buttonRecipe({ variant: 'secondary', size: 'md', shape: 'pill' }),
        avatarButtonStyle
      )}
      onClick={handleClick}
      disabled={status === 'loading'}
    >
      {label}
    </button>
  )
}

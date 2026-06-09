'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/common/button'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { loadCurrentUserProfile } from '@/features/auth/utils/currentUserProfile'
import { redirectToKakaoLogin } from '@/services/auth'
import { css, cx } from '@/styled-system/css'

type CallbackStatus = 'loading' | 'success' | 'error'

const AUTH_FAILED_ERROR = 'auth_failed'

const parseBooleanParam = (value: string | null) => {
  if (value === null) {
    return false
  }

  return value.toLowerCase() === 'true'
}

const sectionStyle = css({
  minH: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  px: '4',
  py: '16',
  bg: 'bg.canvas',
})

const panelStyle = css({
  width: 'full',
  maxW: '420px',
  display: 'grid',
  gap: '4',
  p: { base: '5', md: '6' },
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  bg: 'bg.surface',
  boxShadow: 'md',
  textAlign: 'center',
})

const titleStyle = css({
  color: 'text.primary',
  fontSize: 'xl',
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const messageStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
  lineHeight: 'normal',
})

const statusDotStyle = css({
  width: '10',
  height: '10',
  mx: 'auto',
  borderRadius: 'pill',
  bg: 'primary.soft',
  borderWidth: 'thick',
  borderColor: 'primary',
})

const errorDotStyle = css({
  bg: 'bg.muted',
  borderColor: 'warning',
})

const actionGroupStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '2',
})

const homeLinkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minH: '8',
  px: '3',
  borderWidth: '1px',
  borderColor: 'primary.soft',
  borderRadius: 'pill',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'sm',
  fontWeight: 'semibold',
  lineHeight: 'tight',
  transitionProperty: 'border-color, box-shadow',
  transitionDuration: '150ms',
  _hover: {
    borderColor: 'primary',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

export function AuthCallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const clearUserProfile = useUserProfileStore(
    (state) => state.clearUserProfile
  )
  const callbackAccessToken =
    searchParams.get('access_token') ?? searchParams.get('accessToken')
  const callbackError = searchParams.get('error')
  const isNewUser = parseBooleanParam(searchParams.get('is_new_user'))
  const hasAuthFailed = callbackError === AUTH_FAILED_ERROR
  const hasRequestedRef = useRef(false)
  const [status, setStatus] = useState<CallbackStatus>(
    callbackAccessToken && !callbackError ? 'loading' : 'error'
  )
  const [message, setMessage] = useState(
    hasAuthFailed
      ? '로그인에 실패했습니다. 다시 시도해 주세요.'
      : callbackError
        ? '로그인 처리 중 오류가 발생했습니다. 다시 시도해 주세요.'
        : callbackAccessToken
          ? '카카오 로그인을 처리하고 있습니다.'
          : '로그인 토큰이 없습니다. 다시 시도해 주세요.'
  )

  useEffect(() => {
    if (hasRequestedRef.current) {
      return
    }

    if (callbackError || !callbackAccessToken) {
      hasRequestedRef.current = true
      clearAuth()
      clearUserProfile()
      return
    }

    hasRequestedRef.current = true

    const completeLogin = async () => {
      try {
        setAccessToken(callbackAccessToken)
        try {
          await loadCurrentUserProfile()
        } catch (error) {
          console.error('Current user request failed after login.', error)
          clearUserProfile()
        }
        setStatus('success')
        setMessage(
          isNewUser
            ? '회원가입이 완료되었습니다. 홈으로 이동합니다.'
            : '로그인이 완료되었습니다. 홈으로 이동합니다.'
        )
        router.replace(ROUTES.HOME)
      } catch (error) {
        console.error(error)
        clearAuth()
        clearUserProfile()
        setStatus('error')
        setMessage('로그인 처리 중 문제가 발생했습니다. 다시 시도해 주세요.')
      }
    }

    void completeLogin()
  }, [
    callbackAccessToken,
    callbackError,
    clearAuth,
    clearUserProfile,
    isNewUser,
    router,
    setAccessToken,
  ])

  const isError = status === 'error'
  const handleRetryLogin = () => {
    try {
      redirectToKakaoLogin()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className={sectionStyle}>
      <div aria-live="polite" className={panelStyle}>
        <div className={cx(statusDotStyle, isError && errorDotStyle)} />
        <h1 className={titleStyle}>
          {status === 'success' ? '로그인 완료' : '카카오 로그인'}
        </h1>
        <p className={messageStyle}>{message}</p>
        {isError && (
          <div className={actionGroupStyle}>
            <Button onClick={handleRetryLogin} size="sm" shape="pill">
              다시 로그인
            </Button>
            <Link href={ROUTES.HOME} className={homeLinkStyle}>
              홈으로 이동
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

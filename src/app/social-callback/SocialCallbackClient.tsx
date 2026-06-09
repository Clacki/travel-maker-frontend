'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { useUserProfileStore } from '@/features/auth/store/useUserProfileStore'
import { loadCurrentUserProfile } from '@/features/auth/utils/currentUserProfile'
import { loginWithKakaoCode } from '@/services/auth'
import { css, cx } from '@/styled-system/css'

type CallbackStatus = 'loading' | 'success' | 'error'

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

export function SocialCallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const clearUserProfile = useUserProfileStore(
    (state) => state.clearUserProfile
  )
  const code = searchParams.get('code')
  const hasRequestedRef = useRef(false)
  const [status, setStatus] = useState<CallbackStatus>(
    code ? 'loading' : 'error'
  )
  const [message, setMessage] = useState(
    code
      ? '카카오 로그인을 처리하고 있습니다.'
      : '로그인 인증 코드가 없습니다. 다시 시도해주세요.'
  )

  useEffect(() => {
    if (!code || hasRequestedRef.current) {
      return
    }

    hasRequestedRef.current = true

    const exchangeCode = async () => {
      try {
        const { access_token: accessToken } = await loginWithKakaoCode({ code })

        setAccessToken(accessToken)
        try {
          await loadCurrentUserProfile()
        } catch (error) {
          console.error('Current user request failed after login.', error)
          clearUserProfile()
        }
        setStatus('success')
        setMessage('로그인이 완료되었습니다. 홈으로 이동합니다.')
        router.replace('/')
      } catch (error) {
        console.error(error)
        setStatus('error')
        setMessage('로그인 처리 중 문제가 발생했습니다. 다시 시도해주세요.')
      }
    }

    void exchangeCode()
  }, [clearUserProfile, code, router, setAccessToken])

  const isError = status === 'error'

  return (
    <section className={sectionStyle}>
      <div aria-live="polite" className={panelStyle}>
        <div className={cx(statusDotStyle, isError && errorDotStyle)} />
        <h1 className={titleStyle}>
          {status === 'success' ? '로그인 완료' : '카카오 로그인'}
        </h1>
        <p className={messageStyle}>{message}</p>
      </div>
    </section>
  )
}

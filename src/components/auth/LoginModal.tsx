'use client'

import { Modal } from '@/components/common/modal'
import { demoLogin } from '@/features/auth/api/authApi'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { loadCurrentUserProfile } from '@/features/auth/utils/currentUserProfile'
import { setDemoSession } from '@/features/auth/utils/tokenStorage'
import { css } from '@/styled-system/css'
import { useState } from 'react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const contentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '5',
  textAlign: 'center',
})

const logoStyle = css({
  display: 'inline-flex',
  alignItems: 'baseline',
  fontSize: { base: '2xl', md: '3xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
  letterSpacing: '0',
})

const logoTravelStyle = css({
  color: 'text.primary',
})

const logoMakerStyle = css({
  color: 'primary',
})

const dividerStyle = css({
  width: '12',
  height: '2px',
  borderRadius: 'pill',
  bg: 'primary',
})

const headingGroupStyle = css({
  display: 'grid',
  gap: '2',
})

const titleStyle = css({
  color: 'text.primary',
  fontSize: { base: 'xl', md: '2xl' },
  fontWeight: 'bold',
  lineHeight: 'tight',
})

const descriptionStyle = css({
  color: 'text.secondary',
  fontSize: 'sm',
  lineHeight: 'normal',
})

const guideBoxStyle = css({
  width: 'full',
  display: 'grid',
  gap: '3',
  p: '4',
  borderWidth: '1px',
  borderColor: 'border.subtle',
  borderRadius: 'lg',
  bg: 'bg.canvas',
  textAlign: 'left',
})

const guideItemStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '3',
  color: 'text.primary',
  fontSize: 'sm',
  fontWeight: 'medium',
  lineHeight: 'normal',
})

const guideDotStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '5',
  height: '5',
  borderRadius: 'pill',
  bg: 'primary.soft',
  color: 'primary',
  fontSize: 'xs',
  fontWeight: 'bold',
})

const kakaoButtonStyle = css({
  width: 'full',
  minH: '12',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3',
  px: '5',
  borderWidth: '1px',
  borderColor: '#FEE500',
  borderRadius: 'sm',
  bg: '#FEE500',
  color: 'rgba(0, 0, 0, 0.85)',
  fontSize: 'md',
  fontWeight: 'bold',
  lineHeight: 'tight',
  transitionProperty: 'background-color, border-color, box-shadow, transform',
  transitionDuration: '150ms',
  _hover: {
    bg: '#F7DC00',
    borderColor: '#F7DC00',
    transform: 'translateY(-1px)',
  },
  _focusVisible: {
    outline: 'none',
    boxShadow: 'focus',
  },
})

const kakaoIconStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '6',
  height: '6',
  borderRadius: 'pill',
  bg: 'rgba(0, 0, 0, 0.84)',
  color: '#FEE500',
  fontSize: 'sm',
  fontWeight: 'bold',
  lineHeight: '1',
})

const helperTextStyle = css({
  color: 'text.secondary',
  fontSize: 'xs',
  lineHeight: 'normal',
})

const guideItems = [
  '찜한 여행지 저장',
  '취향 기반 여행 추천',
  '나만의 여행 코스 만들기',
]

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleKakaoLogin = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setErrorMessage(null)
    try {
      const { access_token } = await demoLogin()
      setDemoSession()
      setAccessToken(access_token)
      await loadCurrentUserProfile()
      onClose()
    } catch (error) {
      console.error(error)
      setErrorMessage('데모 로그인에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal ariaLabel="로그인" isOpen={isOpen} onClose={onClose} size="md">
      <div className={contentStyle}>
        <div className={logoStyle} aria-label="TRAVELMAKER">
          <span className={logoTravelStyle}>TRAVEL</span>
          <span className={logoMakerStyle}>MAKER</span>
        </div>

        <div className={dividerStyle} />

        <div className={headingGroupStyle}>
          <h2 className={titleStyle}>로그인</h2>
          <p className={descriptionStyle}>
            트래블메이커에서 나만의 여행을 시작해보세요.
          </p>
        </div>

        <div className={guideBoxStyle}>
          {guideItems.map((item) => (
            <div className={guideItemStyle} key={item}>
              <span className={guideDotStyle} aria-hidden="true">
                ✓
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <button
          className={kakaoButtonStyle}
          onClick={handleKakaoLogin}
          disabled={isSubmitting}
          type="button"
        >
          <span className={kakaoIconStyle} aria-hidden="true">
            K
          </span>
          {isSubmitting ? '로그인 중...' : '카카오로 데모 로그인'}
        </button>

        <p className={helperTextStyle}>
          실제 카카오 인증 없이 포트폴리오용 데모 계정으로 로그인됩니다.
        </p>
        {errorMessage && <p className={helperTextStyle}>{errorMessage}</p>}
      </div>
    </Modal>
  )
}
